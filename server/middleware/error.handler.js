import env from "../utils/environment.js";

const errorHandler = (err, req, res, next) => {
    const errStatus = err.statusCode || 500;
    const errMsg =
        errStatus === 500
            ? 'Something went wrong. Please try again.'
            : err.message;
    const error = {
        success: false,
        status: errStatus,
        message: errMsg,
    };

    if (env.app.mode === 'development') {
        error.stack = err.stack;
    }

    res.status(errStatus).json(error);
};

export default errorHandler;
