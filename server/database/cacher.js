const { createClient } = require('redis');
require('dotenv').config();

function createRedisClient() {
    if(process.env.MODE === 'development') {
        return createClient({
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
            },
        });
    } else {
        return createClient();
    }
}

const client = createRedisClient();

client.connect().then(() => {
    console.log("Successfully connected to redis");
}).catch((e) => {
    console.log(e);
});

module.exports = client;
