

const formidable = require("formidable");
const fs = require("fs-extra");
const moment = require("moment");
const fileUpload = (req, res, next, extra = {}) => {
    try {
        const { upload_path = process.env.UPLOAD_PATH || "public", appendDate = true, pathKey } = extra;

        const form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.maxFieldsSize = 10 * 1024 * 1024; // Max field size of 10MB
        form.maxFileSize = 100 * 1024 * 1024; // Max file size of 100MB

        form.parse(req, async (err, fields, files) => {
            try {
                if (err) {
                    console.error("Formidable Error:", err);
                    return next(err);
                }


                const uploadedDocumentsName = Object.keys(files);
                const returnPaths = [];

                // Iterate over all file keys
                for (const key of uploadedDocumentsName) {
                    const fileOrFiles = files[key];

                    // Handle both single file and array of files
                    const fileArray = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];

                    for (const file of fileArray) {
                        if (!file || !file.filepath) {
                            console.log(`No valid file for key: ${key}`);
                            continue;
                        }

                        // Generate upload path
                        let finalUploadPath = `${upload_path}/${key}`;
                        if (appendDate) {
                            finalUploadPath += `/${moment().format("DD-MM-YYYY")}`;
                        }
                        if (pathKey) {
                            const pathKeyValue = fields[pathKey] ? fields[pathKey] : "";
                            finalUploadPath += `/${pathKeyValue}`;
                        }

                        if (!fs.existsSync(finalUploadPath)) {
                            fs.mkdirSync(finalUploadPath, { recursive: true });
                        }

                        const oldpath = file.filepath;
                        const fileExt = file.originalFilename.split(".").pop();
                        const returnPath = `${finalUploadPath}/${file.originalFilename}_${Date.now()}.${fileExt}`;

                        fs.moveSync(oldpath, returnPath);
                        returnPaths.push({ type: key, path: returnPath });
                    }
                }

           

                res.locals.document_saved_path = returnPaths;
                res.locals.fields = fields;
                next();
            } catch (err) {
                console.error("File Upload Error:", err);
                next(err);
            }
        });
    } catch (err) {
        console.error("Outer Catch Error:", err);
        next(err);
    }
};
module.exports = fileUpload;