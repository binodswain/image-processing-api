import express from 'express';
import multer from 'multer';
const routes = express.Router();

const storage = multer.diskStorage(
    {
        destination: 'assets/images/full/',
        filename: function (req, file, cb): void {
            cb(null, file.originalname.replace(/\s/g, '_'));
        }
    }
);

const upload = multer({ storage })

/**
 * @description POST endpoint to upload image from UI
 */
routes.post('/upload', upload.single('image'), (req: express.Request, res: express.Response): void => {
    res.json({
        message: 'File uploaded successfully',
    })
});


export default routes;