import dotenv from "dotenv";

dotenv.load();

export const MONGODB_URL = process.env.MONGODB_URL;
export const ALARMS_COLLECTION_NAME = "alarms";
export const AGGREGATES_COLLECTION_NAME = "readings-daily-aggregates";
export const SENSORS_COLLECTION_NAME = "sensors";
export const DEBUG = process.env.DEBUG;
export const ALARMS_TOPIC_ARN = process.env.ALARMS_TOPIC_ARN;
export const TIMEZONE = process.env.TIMEZONE || "Europe/Rome";
