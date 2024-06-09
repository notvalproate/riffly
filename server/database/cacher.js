import { createClient } from 'redis';
import env from '../utils/environment.js';

function createRedisClient() {
    if (env.app.mode === 'development') {
        return createClient({
            socket: {
                host: env.redis.host,
                port: env.redis.port,
            },
            password: env.redis.password,
        });
    } else {
        return createClient();
    }
}

const client = createRedisClient();

client
    .connect()
    .then(() => {
        console.log('Successfully connected to redis');
    })
    .catch((e) => {
        console.log(e);
    });

export default client;
