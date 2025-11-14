"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = exports.asyncHandler = void 0;
function asyncHandler(handler) {
    return function wrapped(req, res, next) {
        Promise.resolve(handler(req, res, next)).catch(next);
    };
}
exports.asyncHandler = asyncHandler;
function sendSuccess(res, data, status) {
    if (status === void 0) { status = 200; }
    res.status(status).json({ success: true, data: data });
}
exports.sendSuccess = sendSuccess;
function sendError(res, message, status) {
    if (status === void 0) { status = 400; }
    res.status(status).json({ success: false, message: message });
}
exports.sendError = sendError;
