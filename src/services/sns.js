import {SNS} from "aws-sdk";
import {promisifyAll} from "bluebird";

const sns = new SNS({
    apiVersion: "2010-03-31"
});
export default promisifyAll(sns);
