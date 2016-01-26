import moment from "moment-timezone";

import {ALARMS_TOPIC_ARN, TIMEZONE} from "./config";
import sns from "./services/sns";

export default async function notifyAlarm (reading) {
    return sns.publish({
        Message: [
            `Sensor ${reading.sensorId} triggered automatic alarm`,
            `on ${moment(reading.date).tz(TIMEZONE).format("llll")}`
        ].join("\n"),
        Subject: "Triggered alarm",
        TopicArn: ALARMS_TOPIC_ARN
    });
}
