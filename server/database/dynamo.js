import dynamoose from 'dynamoose';
import env from '../utils/environment.js';

export default function configDynamoose() {
    const ddb = new dynamoose.aws.ddb.DynamoDB({
        "credentials": {
            "accessKeyId": env.aws.accessKey,
            "secretAccessKey": env.aws.secretKey,
        },
        "region": env.aws.region,
    });

    dynamoose.aws.ddb.set(ddb);
}
