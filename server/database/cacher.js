const { createClient } = require('redis');
require('dotenv').config();

// NOT GOOD TO EXPORT VARIABLE DECLARED WITH LET
let client = null;

if(process.env.MODE === 'development') {
    client = createClient({
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
        },
    });
} else {
    client = createClient();
}

client.connect().then(() => {
    console.log("Successfully connected to redis");
}).catch((e) => {
    console.log(e);
});

module.exports = client;