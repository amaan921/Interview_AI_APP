import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + "-" + file.originalname;
        cb(null, filename);
    }
});

const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 5 } });

export default upload;
