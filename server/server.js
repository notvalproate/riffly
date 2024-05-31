import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';

import env from './utils/environment.js';

import authRoutes from './routes/auth.js';
import meRoutes from './routes/me.js';
import trackRoutes from './routes/track.js';

import errorHandler from './middleware/error.handler.js';

const app = express();

app.use(
    compression({
        threshold: 0,
    })
);
app.use(
    cors({
        origin: env.app.client,
        credentials: true,
    })
);
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/me', meRoutes);
app.use('/track', trackRoutes);

app.use(errorHandler);

app.listen(env.app.port, async () => {
    console.log('Server running on http://localhost:' + env.app.port + '/');
});

import connectToDynamoDB from './database/dynamo.js';
import dynamoose from 'dynamoose';

async function test() {
    try {
        connectToDynamoDB();
    
        const User = dynamoose.model("User", {"id": Number, "name": String});
        
        const results = await User.query("name").eq("Tim").exec();

        console.log(results);
    } catch (error) {
        console.error('Failed to connect to DynamoDB: ', error);
    }
}

test();