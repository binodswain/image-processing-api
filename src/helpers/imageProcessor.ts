import sharp from 'sharp';

interface ImageResizeType {
    width: number | '';
    height: number | '';
    filepath: string;
}

/**
 * @description util function to resize image with sharp module
 * @param params - object of image resize params
 * @returns image buffer
 */
export const processImage = async (params: ImageResizeType): Promise<Buffer> => {
    const { width, height, filepath } = params;
    const image = await sharp(filepath)
        .resize(width || null, height || null)
        .jpeg()
        .toBuffer();
    return image;
}