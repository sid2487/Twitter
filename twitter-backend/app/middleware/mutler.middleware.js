import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/", "video/", "application/pdf"];
    if(allowedTypes.some(type => file.mimetype.startsWith(type) || file.mimetype == type)) {
        cb(null, true);
    } else {
        cb(new Error("Only image, videos and pdg files are allowed!"), false);
    }
};

export const Upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: 20 * 1024 * 1024 }
});