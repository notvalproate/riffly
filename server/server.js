const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require("compression");
require('dotenv').config();

const authRoutes = require('./routes/auth.js');
const meRoutes = require('./routes/me.js');
const trackRoutes = require('./routes/track.js');

const errorHandler = require('./middleware/error.handler.js');

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

app.use('/auth', authRoutes);
app.use('/me', meRoutes);
app.use('/track', trackRoutes);

app.use(errorHandler);

app.listen(PORT, async () => {
    console.log('Server running on http://localhost:' + PORT + '/');
});
