export default class ApiError extends Error {
    constructor(
        statusCode,
        message = 'Unexpected Error Occurred, please try again.'
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
    }
}
