import {v4} from "node-uuid";

import {ALARMS_COLLECTION_NAME} from "./config";
import mongodb from "./services/mongodb";

export default async function writeAlarm (reading, sensor) {
    const db = await mongodb;
    const selector = {
        _id: `automatic-alarm-for-pod-${sensor._id}`
    };
    const modifier = {
        podId: sensor._id,
        type: "automatic",
        name: `Automatic alarm for pod ${sensor._id}`,
        active: true,
        $addToSet: {
            notifications: {
                _id: v4(),
                date: reading.date
            }
        }
    };
    return db.collection(ALARMS_COLLECTION_NAME)
        .update(selector, modifier, {upsert: true});
}
