const errorHandler = (err, req, res, next) => {
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong. Please try again.';
    const error = {
        success: false,
        status: errStatus,
        message: errMsg,
    };

    if(process.env.NODE_ENV === 'development') {
        error.stack = err.stack
    }

    res.status(errStatus).json(error);
}

module.exports = {
    errorHandler,
};