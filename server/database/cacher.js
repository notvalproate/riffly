const { createClient } = require('redis');

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
});

client.connect().then(() => {
    console.log("Successfully connected to redis");
}).catch((e) => {
    console.log(e);
});

module.exports = client;