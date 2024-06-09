import dotenv from 'dotenv';
dotenv.config();

const env = {
    app: {
        mode: process.env.MODE || 'development',
        port: process.env.PORT || 4000,
        domain: process.env.DOMAIN || 'localhost',
        client: process.env.CLIENT_URL || 'http://localhost:4200',
    },
    spotify: {
        clientID: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    },
    lyrics: {
        geniusToken: process.env.GENIUS_CLIENT_TOKEN,
        musixMatchToken: process.env.MUSIX_MATCH_TOKEN,
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
    },
    aws: {
        accessKey: process.env.AWS_ACCESS_KEY,
        secretKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_REGION,
    }
};

export default env;
