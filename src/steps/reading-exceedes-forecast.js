import moment from "moment";

function isInDayRange (reading) {
    const hour = moment.utc(reading.date).hour();
    // UTC+1 7/22, as per user story
    return (hour > 6 && hour < 21);
}

export default function readingExceedsForecast (reading, forecastValue) {
    const readingValue = reading.measurements
        .find(measurement => measurement.type === "activeEnergy")
        .value;
    // 300% for day values, 200% for night values, as per user story
    const tolerance = (isInDayRange(reading) ? 3 : 2);
    return (readingValue < tolerance * forecastValue);
}
