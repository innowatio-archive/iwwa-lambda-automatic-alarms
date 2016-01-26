import moment from "moment";

import {AGGREGATES_COLLECTION_NAME} from "../config";
import mongodb from "../services/mongodb";

function getDayFromReading (date) {
    return moment.utc(date, moment.ISO_8601, true).format("YYYY-MM-DD");
}

function getAggregateId (reading) {
    const {sensorId, date} = reading;
    return `${sensorId}-${getDayFromReading(date)}-forecast-activeEnergy`;
}

async function getAggregate (reading) {
    const db = await mongodb;
    return db.collection(AGGREGATES_COLLECTION_NAME).findOne({
        _id: getAggregateId(reading)
    });
}

const oneHourInMilliseconds = moment.duration(1, "hour").asMilliseconds();

function getNearestForecast (reading, aggregate) {
    const values = aggregate.measurementValues.split(",");
    const startOfDay = moment.utc(aggregate.day).startOf("day").valueOf();
    const readingTimestamp = moment.utc(reading.date).valueOf();
    const nearest = values
        .map((value, index) => [
            value, startOfDay + (index * aggregate.measurementsDeltaInMs)
        ])
        .filter(tuple => !!tuple[0])
        .reduce((nearest, tuple) => {
            const delta = Math.abs(tuple[1] - readingTimestamp);
            return (
                delta < nearest.delta ? {value: tuple[0], delta} : nearest
            );
        }, {value: Infinity, delta: Infinity});
    return (
        nearest.delta > oneHourInMilliseconds ? Infinity : nearest.value
    );
}

export default async function retrieveForecastValue (reading) {
    const forecastAggregate = await getAggregate(reading);
    if (!forecastAggregate) {
        return Infinity;
    }
    return getNearestForecast(reading, forecastAggregate);
}
