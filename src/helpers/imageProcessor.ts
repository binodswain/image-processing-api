import sharp from "sharp";

interface ImageResizeType {
    width: number | "";
    height: number | "";
    filepath: string;
}

/**
 * @description util function to resize image with sharp module
 * @param params - object of image resize params
 * @returns image buffer
 */
export const processImage = async (
    params: ImageResizeType
): Promise<{ imageBuffer: Buffer; ext: string }> => {
    const { width, height, filepath } = params;
    // create sharpp instance
    const sharpInstance = await sharp(filepath);

    // get image format from metadata
    const metadata = await sharpInstance.metadata();
    const format = metadata.format;

    const image = await sharpInstance
        .resize(width || null, height || null)
        .toFormat(format || "jpeg")
        .toBuffer();
    return { imageBuffer: image, ext: format || "jpeg" };
};
