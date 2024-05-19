const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require("compression");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const clientURL = process.env.CLIENT_URL;

app.use(compression({
    threshold: 0
}));
app.use(
    cors({
        origin: clientURL,
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
