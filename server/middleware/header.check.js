import asyncHandler from "express-async-handler";
import env from "../utils/environment.js";
import ApiError from "../utils/api.error.js";

const checkHeaders = asyncHandler((req, res, next) => {
    const clientHeader = req.get('X-Riffly-Client-Type');
    const versionHeader = req.get('X-Riffly-Version');

    console.log(clientHeader, versionHeader);

    if (!clientHeader || !versionHeader) {
        throw new ApiError(400, 'Invalid Client - Request Denied');
    }

    if (versionHeader !== env.app.version) {
        throw new ApiError(400, 'Invalid Client Version - Please Update Your App');
    }

    next();
});

export default checkHeaders;
