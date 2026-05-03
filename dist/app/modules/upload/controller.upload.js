"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUploadUrl = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
const http_status_1 = __importDefault(require("http-status")); // Or use numeric codes directly
// Initialize S3 Client (Make sure AWS env vars are loaded)
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const generateUploadUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filename, contentType } = req.body;
        // Basic Validation
        if (!filename || !contentType) {
            return res.status(http_status_1.default.BAD_REQUEST).json({
                success: false,
                message: 'Filename and contentType are required'
            });
        }
        // Sanitize filename and create unique key
        const safeFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '-'); // Replace unsafe characters
        const uniqueKey = `uploads/images/${(0, uuid_1.v4)()}-${safeFilename}`; // Define your folder structure
        // Prepare S3 command
        const command = new client_s3_1.PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: uniqueKey,
            ContentType: contentType,
            // ACL: 'public-read' // Optional: Uncomment if you want files public by default
        });
        // Generate the pre-signed URL (valid for 10 minutes)
        const uploadUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 600 });
        // Construct the final, permanent URL of the file
        const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${uniqueKey}`;
        // Send successful response
        return res.status(http_status_1.default.OK).json({
            success: true,
            message: 'Upload URL generated successfully',
            data: {
                uploadUrl: uploadUrl, // Temporary URL for PUT request
                fileUrl: fileUrl, // Permanent URL to save in DB
            },
        });
    }
    catch (error) {
        console.error("❌ Error generating S3 pre-signed URL:", error);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to generate upload URL',
            error: error.message
        });
    }
});
exports.generateUploadUrl = generateUploadUrl;
