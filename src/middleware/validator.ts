import express from 'express';
import { doesFileExist } from '../helpers/storage';

/**
 * @description route level middileware to validate query params
 * - if width or height is provided, value should be a +ve number
 * @param req express.Request
 * @param res express.Response
 * @param next express.NextFunction
 * @returns 
 */
export const validateQueryParam = (req: express.Request, res: express.Response, next: express.NextFunction): express.Response<string> | void => {
    const { width, height } = req.query;

    if ((width && !isNaN(parseInt(width as string)) && parseInt(width as string) < 0)) {
        return res.status(400).send('invalid width param');
    }

    if ((height && !isNaN(parseInt(height as string)) && parseInt(height as string) < 0)) {
        return res.status(400).send('invalid height param');
    }

    next();
}

/**
 * @description route level middileware to validate filename query 
 * - if filename is provided, it should be present in assets folder
 * - if filename is not provided but resize params is present, throw error
 * - if filename is not provided and resize params is not present, proceed next to return all images
 * @param req express.Request
 * @param res express.Response
 * @param next express.NextFunction
 * @returns 
 */
export const validateQueryFilename = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void | express.Response<string>> => {
    const { filename, width, height } = req.query;
    const file = await doesFileExist(filename as string)

    // check if filename matches the file in assets folder
    if (filename && !file) {
        return res.status(400).send('invalid filename query params');
    }

    // if resize param is provided, check if filename is passed
    if ((width || height) && !file) {
        return res.status(400).send('filename query is missing');
    }

    next();
}