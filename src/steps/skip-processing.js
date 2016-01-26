import {propEq} from "ramda";

function isForecast (reading) {
    return (
        (reading.source || reading.measurements[0].source) === "forecast"
    );
}

function hasActiveEnergy (reading) {
    return !!reading.measurements.find(propEq("type", "activeEnergy"));
}

async function isPodOrPodAnz (sensor) {
    return !!(
        sensor && (sensor.type === "pod" || sensor.type === "pod-anz")
    );
}

export default async function skipProcessing (reading, sensor) {
    return (
        // Ignore forecast readings
        isForecast(reading) ||
        // Ignore readings without an `activeEnergy` measurements
        !hasActiveEnergy(reading) ||
        // Ignore all readings other than pod and pod-anz readings
        !isPodOrPodAnz(sensor)
    );
}
