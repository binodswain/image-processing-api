import express from "express";
import {
    createThumbnail,
    getFullImage,
    getImageList,
    getThumbnail,
    getThumbnailList
} from "../helpers/storage";
import {
    validateQueryFilename,
    validateQueryParam
} from "../middleware/validator";
const routes = express.Router();

export interface ImageQuery {
    width: number | "";
    height: number | "";
    filename: string;
}

export interface ImageReqQuery {
    width: string;
    height: string;
    filename: string;
}

/**
 * @description GET endpoint to get images
 *  scenarios:
 *   - if no query param is provided, return list of images with urls
 *   - if only filename is provided, return single full size image
 *   - if filename and resize params is provided, return thumbnail
 * @param req express.Request
 * @param res express.Response
 * @returns express.Response
 */
routes.get(
    "/images",
    validateQueryParam,
    validateQueryFilename,
    async (
        req: express.Request,
        res: express.Response
    ): Promise<express.Response<string> | void> => {
        try {
            const query = req.query as unknown as ImageReqQuery;

            // handle request with no params
            if (!query.height && !query.width && !query.filename) {
                const data = await getImageList();
                return res.json(data);
            }

            // handle request without any resize param
            if (!query.height && !query.width) {
                // return full size image
                const image = await getFullImage(query.filename);
                res.setHeader("Content-Type", "image/jpeg");
                return res.status(200).send(image);
            }

            const queryData = {
                width: query.width && parseInt(query.width),
                height: query.height && parseInt(query.height),
                filename: query.filename
            };

            const image = await getThumbnail(queryData);

            if (image) {
                // thumbnail is available
                res.setHeader("Content-Type", "image/jpeg");
                res.status(200).send(image);
            } else {
                // thumbnail is not available
                const image = await createThumbnail(queryData);
                res.setHeader("Content-Type", "image/jpeg");
                res.status(200).send(image);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }
);

/**
 * @description GET endpoint to processed thumbnail images
 * @param req express.Request
 * @param res express.Response
 */
routes.get("/thumbnails", async (req, res) => {
    const data = await getThumbnailList();
    res.json(data);
});

export default routes;
