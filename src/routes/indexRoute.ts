import express from "express";
import path from "path";
const routes = express.Router();

const viewDirectory = path.resolve(__dirname, "../views/");

/**
 * @description GET endpoint to get index page
 * @param req express.Request
 * @param res express.Response
 * @returns express.Response
 * @throws Error
 */
routes.get("/", (req: express.Request, res: express.Response): void => {
    res.sendFile("home.html", { root: viewDirectory });
});

/**
 * @description GET endpoint to get upload UI
 * @param req express.Request
 * @param res express.Response
 * @returns express.Response
 * @throws Error
 */
routes.get("/upload", (req: express.Request, res: express.Response): void => {
    res.sendFile("upload.html", { root: viewDirectory });
});

/**
 * @description GET endpoint to render processed thumbnail UI
 * @param req express.Request
 * @param res express.Response
 * @returns express.Response
 * @throws Error
 */
routes.get(
    "/thumbnails",
    (req: express.Request, res: express.Response): void => {
        res.sendFile("thumbnails.html", { root: viewDirectory });
    }
);

/**
 * @description GET endpoint to render fullsize image UI
 * @param req express.Request
 * @param res express.Response
 * @returns express.Response
 * @throws Error
 */
routes.get(
    "/fullimages",
    (req: express.Request, res: express.Response): void => {
        res.sendFile("fullimages.html", { root: viewDirectory });
    }
);

export default routes;
