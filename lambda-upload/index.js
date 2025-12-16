// index.js
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// Initialize S3 client
const s3 = new S3Client({ region: "ap-southeast-2" });

exports.handler = async function(event) {
    try {
        // Parse incoming request body
        const body = JSON.parse(event.body);
        const fileName = body.fileName;
        const fileContent = Buffer.from(body.fileContent, "base64");

        // S3 upload parameters
        const params = {
            Bucket: "pdf-uploads-jeeva-987654", // your S3 bucket name
            Key: fileName,
            Body: fileContent,
            ContentType: "application/pdf"
        };

        // Upload to S3
        await s3.send(new PutObjectCommand(params));

        // Return success response with CORS headers
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            body: JSON.stringify({ message: "PDF uploaded successfully!" })
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            body: JSON.stringify({ message: "Upload failed", error: err.message })
        };
    }
};
