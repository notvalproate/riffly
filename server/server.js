const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
    cors({
        origin: 'http://localhost:4200',
        credentials: true,
    })
);
app.use(cookieParser());

const authRouter = require('./routes/auth.js');
const apiRouter = require('./routes/api.js');

app.use('/auth', authRouter);
app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log('Server running on http://localhost:' + PORT + '/');
});
