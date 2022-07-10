
import { promises as fs } from 'fs';
import path from "path";

export const clearThumbnailFolder = async (): Promise<void> => {
    const files = await fs.readdir('assets/images/thumb');
    for (const file of files) {
        if (file !== '.gitkeep') {
            await fs.unlink(path.join('assets/images/thumb', file));
        }
    }
}