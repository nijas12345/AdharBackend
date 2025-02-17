"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = require("../config/multer");
const vision_1 = require("@google-cloud/vision");
const path_1 = __importDefault(require("path"));
const ocrDetails_1 = require("../config/ocrDetails");
const router = express_1.default.Router();
const client = new vision_1.v1.ImageAnnotatorClient({
    keyFilename: path_1.default.join(__dirname, "..", 'google-cloud-credentials.json'),
});
router.get("/send", (req, res) => {
    console.log("Server is running");
    res.send("Server is running");
});
router.post('/', multer_1.upload.fields([
    { name: 'frontImage', maxCount: 1 },
    { name: 'backImage', maxCount: 1 },
]), async (req, res) => {
    try {
        // Ensure files are available in req.files
        const files = req.files;
        if (files.frontImage && files.backImage) {
            const frontImagePath = path_1.default.resolve(files.frontImage[0].path);
            const backImagePath = path_1.default.resolve(files.backImage[0].path);
            const [frontResult] = await client.textDetection(frontImagePath);
            const [backResult] = await client.textDetection(backImagePath);
            const frontText = frontResult.textAnnotations?.[0]?.description || 'No text detected';
            const backText = backResult.textAnnotations?.[0]?.description || 'No text detected';
            const aadhaarNumberRegex = /\b\d{4} \d{4} \d{4}\b/;
            if (!frontText.toLowerCase().includes('government of india')) {
                res.status(400).json({
                    error: 'Please Upload correct Aadhar front Image.',
                });
                return;
            }
            const frontAadhaarMatch = frontText.match(aadhaarNumberRegex);
            if (!frontAadhaarMatch) {
                res.status(400).json({
                    error: 'No valid Aadhaar number found in the front image.',
                });
                return;
            }
            const frontAadhaarNumber = frontAadhaarMatch[0];
            // Validate Back Image Text
            if (!backText.toLowerCase().includes('unique identification authority of india')) {
                res.status(400).json({
                    error: 'Please upload the exact backside of aadhar".',
                });
                return;
            }
            // const backAadhaarMatch = backText.match(aadhaarNumberRegex);
            // if (!backAadhaarMatch) {
            //    res.status(400).json({
            //     error: 'No valid Aadhaar number found in the back image.',
            //   });
            //   return
            // }
            // const backAadhaarNumber = backAadhaarMatch[0];
            // // Cross-check Aadhaar numbers
            // if (frontAadhaarNumber !== backAadhaarNumber) {
            //    res.status(400).json({
            //     error: `Aadhaar numbers do not match between front and back images: ${frontAadhaarNumber} (front) vs ${backAadhaarNumber} (back).`,
            //   });
            //   return
            // }
            const extractedDetails = (0, ocrDetails_1.extractAadhaarDetails)(frontText, backText);
            res.json({
                success: true,
                data: extractedDetails
            });
        }
        else {
            res.status(400).json({ error: 'Both front and back images are required.' });
        }
    }
    catch (err) {
        console.error('Error handling Aadhaar upload:', err);
        res.status(500).json({ error: 'Internal server error.' });
        return;
    }
});
exports.default = router;
