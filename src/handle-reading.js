import {SENSORS_COLLECTION_NAME} from "./config";
import mongodb from "./services/mongodb";
import notifyAlarm from "./steps/notify-alarm";
import readingExceedsForecast from "./steps/reading-exceedes-forecast";
import retrieveForecastValue from "./steps/retrieve-forecast";
import skipProcessing from "./steps/skip-processing";
import writeAlarm from "./steps/write-alarm";

async function getSensor (reading) {
    const db = await mongodb;
    return await db.collection(SENSORS_COLLECTION_NAME).findOne({
        _id: reading.sensorId
    });
}

export default async function handleReading (event) {
    const reading = event.data.element;
    /*
    *   Workaround: some events have been incorrectly generated and thus don't
    *   have an `element` property. When processing said events, just return and
    *   move on without failing, as failures can block the kinesis stream.
    */
    if (!reading) {
        return null;
    }
    const sensor = await getSensor(reading);
    if (skipProcessing(reading, sensor)) {
        return null;
    }
    const forecastValue = await retrieveForecastValue(reading, sensor);
    const isCritical = readingExceedsForecast(reading, forecastValue);
    if (!isCritical) {
        return null;
    }
    await writeAlarm(reading, sensor);
    await notifyAlarm(reading);
}
