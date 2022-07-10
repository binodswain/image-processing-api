import { promises as fs } from "fs";
import path from 'path';

import { ImageQuery } from "../routes/imageRoute"
import { processImage } from "./imageProcessor";

const originalImagePath = path.resolve(__dirname, '../../assets/images/full');
const thumbnailImagePath = path.resolve(__dirname, '../../assets/images/thumb');

const getImageName = (params: ImageQuery) => {
    const { width = 'auto', height = 'auto', filename } = params;
    return `${filename}-${height}x${width}.jpg`
}

/**
 * @description helper function to get image buffer from thumbnail folder
 * @param params object of image query params
 * @returns thumbnail image buffer
 */
export const getThumbnail = async (params: ImageQuery): Promise<Buffer | null> => {
    try {
        const imageName = getImageName(params);
        const thumbnailPath = path.resolve(thumbnailImagePath, imageName);
        const image = await fs.readFile(thumbnailPath);
        return image;
    } catch (error) {
        return null;
    }
}

/**
 * @description helper function to get image buffer from original folder
 * @param filename 
 * @returns image buffer
 */
export const getFullImage = async (filename: string): Promise<Buffer | null> => {
    try {
        const imagePath = path.resolve(originalImagePath, filename);
        const image = await fs.readFile(imagePath);
        return image;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * @description helper function to generate thumbnail image and save it to thumbnail folder
 * @param params object of image query params
 * @returns image buffer
 */
export const createThumbnail = async (params: ImageQuery): Promise<Buffer | Error> => {
    const imageName = getImageName(params);
    const originalPath = path.resolve(originalImagePath, `${params.filename}.jpg`);
    const thumbnailPath = path.resolve(thumbnailImagePath, imageName);
    // get sharp image buffer
    const imageBuffer = await processImage({
        width: params.width,
        height: params.height,
        filepath: originalPath,
    })

    // save resized image
    await saveThumbnail({ imageBuffer, imageName: thumbnailPath });
    // return resized image buffer
    return imageBuffer;
}

/**
 * @description helper function to save resized image in thumbnail folder
 * @param params object of  imageBuffer, imageName
 */
const saveThumbnail = async (params: {
    imageName: string,
    imageBuffer: Buffer
}): Promise<void> => {
    const { imageName, imageBuffer } = params;
    const thumbnailPath = path.resolve(thumbnailImagePath, imageName);
    await fs.writeFile(thumbnailPath, imageBuffer);
}

/**
 * @description helper function to check if image exists in original folder
 * @param filename original filename
 * @returns boolean value
 */
export const doesFileExist = async (filename: string): Promise<boolean> => {
    try {
        const filePath = path.resolve(originalImagePath, `${filename}.jpg`);
        const stats = await fs.stat(filePath);
        return stats.isFile();
    } catch (error) {
        return false;
    }
}

/**
 * @description helper function to check if image filename exists in thumbnail folder
 * @param filename thumbnails filename
 * @returns boolean value
 */
export const doesThumbnailExist = async (filename: string): Promise<boolean> => {
    try {
        const filePath = path.resolve(thumbnailImagePath, filename);
        const stats = await fs.stat(filePath);
        return stats.isFile();
    } catch (error) {
        return false;
    }
}

/**
 * @description helper function to fetch list of images in original folder
 * @returns array of image object with filename and url
 */
export const getImageList = async (): Promise<Array<{ filename: string; url: string }>> => {
    const files = await fs.readdir(originalImagePath);
    return files.map(file => {
        const [ext] = file.split('.').reverse();
        const filename = file.split(`.${ext}`)[0];
        return { filename, url: `/api/images?filename=${filename}` }
    });
}

/**
 * @description helper function to fetch list of images in thumbnail folder
 * @returns array of image object with filename and url
 */
export const getThumbnailList = async (): Promise<Array<{
    filename: string;
    url: string;
    meta: {
        width: string;
        height: string;
        filename: string;
    }
}>> => {
    const files = await fs.readdir(thumbnailImagePath);
    return files.filter(item => {
        if (item.startsWith('.')) {
            return false;
        }
        return true;
    }).map(file => {
        const [filename, height_width] = file.split('.')[0].split('-');
        const [height, width] = height_width.split('x');
        return {
            filename: file, url: `/api/images?filename=${filename}&height=${height}&width=${width}`, meta: {
                filename, height, width
            }
        }
    });
}