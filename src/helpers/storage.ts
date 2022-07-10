import { promises as fs } from "fs";
import path from 'path';

import { ImageQuery } from "../routes/imageRoute"
import { processImage } from "./imageProcessor";

const originalImagePath = path.resolve(__dirname, '../../assets/images/full');
const thumbnailImagePath = path.resolve(__dirname, '../../assets/images/thumb');

/**
 * @description helper function to get thumbnail filename with extension
 * @param params object of filename, width, height
 * @returns thumbnail filename with extension
 */
const getImageName = async (params: ImageQuery): Promise<string> => {
    const { width = 'auto', height = 'auto', filename } = params;
    const map = await getThumbnailMap()
    return map[`${filename}-${height}x${width}`]
}

/**
 * @description helper function to generate thumbnail filename with resize args
 * @param params object of filename, width, height, extension
 * @returns thumbnail filename with extension
 */
const createThumbnailName = (params: {
    filename: string,
    width: number | '',
    height: number | '',
    ext: string
}): string => {
    const { width = 'auto', height = 'auto', filename, ext } = params;
    return `${filename}-${height}x${width}.${ext}`;
}

/**
 * @description helper function to get image buffer from thumbnail folder
 * @param params object of image query params
 * @returns thumbnail image buffer
 */
export const getThumbnail = async (params: ImageQuery): Promise<Buffer | null> => {
    try {
        const imageName = await getImageName(params);
        const thumbnailPath = path.resolve(thumbnailImagePath, imageName);
        const image = await fs.readFile(thumbnailPath);
        return image;
    } catch (error) {
        return null;
    }
}

/**
 * @description helper function to get image buffer from original folder
 * @param filename filename of image without extension
 * @returns image buffer
 */
export const getFullImage = async (filename: string): Promise<Buffer | null> => {
    try {
        const filenameMap = await getFilenameMap();
        const imagePath = path.resolve(originalImagePath, filenameMap[filename]);
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
    const filenameMap = await getFilenameMap();
    const originalPath = path.resolve(originalImagePath, filenameMap[params.filename]);
    // get sharp image buffer
    const { imageBuffer, ext } = await processImage({
        width: params.width,
        height: params.height,
        filepath: originalPath,
    })

    const imageName = await createThumbnailName({ ...params, ext });
    const thumbnailPath = path.resolve(thumbnailImagePath, imageName);

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
        const filenameMap = await getFilenameMap();
        const filePath = path.resolve(originalImagePath, filenameMap[filename]);
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, ...rest] = file.split('.').reverse();
        const temp = rest.reverse().join('.');
        const [filename, height_width] = temp.split('-');
        const [height, width] = height_width.split('x');
        return {
            filename: file,
            url: `/api/images?filename=${filename}&height=${height}&width=${width}`,
            meta: {
                filename, height, width
            }
        }
    });
}

/**
 * @description helper function to create js map of filename and original filename
 * @returns map of filename and original filename with extension
 */
async function getFilenameMap(): Promise<{ [key: string]: string }> {
    const filelist = await fs.readdir(originalImagePath);

    const filenameMap = filelist.reduce((acc: {
        [key: string]: string
    }, file: string) => {
        const [ext] = file.split('.').reverse();
        const filename = file.split(`.${ext}`)[0];
        acc[filename] = file;
        return acc;
    }, {})

    return filenameMap;
}

/**
 * @description helper function to get image map of thumb and thumbnail-with extension
 * @returns map of filename and thumbnail filename with extension
 */
async function getThumbnailMap(): Promise<{ [key: string]: string }> {
    const filelist = await getThumbnailList();
    const filenameMap = filelist.reduce((acc: {
        [key: string]: string
    }, file: { filename: string; meta: { filename: string; height: string; width: string } }) => {
        acc[`${file.meta.filename}-${file.meta.height}x${file.meta.width}`] = file.filename;
        return acc;
    }, {})
    return filenameMap;
}