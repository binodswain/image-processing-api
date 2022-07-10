import { doesFileExist, getThumbnail, createThumbnail, doesThumbnailExist } from "../helpers/storage";
import { clearThumbnailFolder } from "./helpers/cleanup";

describe("Test storage utility functions", () => {
    beforeAll(clearThumbnailFolder)
    afterAll(clearThumbnailFolder)

    it("check valid filenames", async () => {
        const result = await doesFileExist('fjord');
        const result3 = await doesFileExist('encenadaport');
        const result2 = await doesFileExist('icelandwaterfall');
        const result4 = await doesFileExist('palmtunnel');
        const result5 = await doesFileExist('santamonica');
        expect(result).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);
        expect(result4).toBe(true);
        expect(result5).toBe(true);
    });

    it("checks invalid filenames", async () => {
        const result = await doesFileExist('invalid');
        expect(result).toBe(false);
    });

    it('creates image thumbnail', async () => {
        const queryData = {
            filename: 'fjord',
            width: 100,
            height: 100
        }
        await createThumbnail(queryData);
        const output = await doesThumbnailExist(`fjord-100x100.jpg`);
        expect(output).toBe(true);
    })

    it('checks existing image thumbnail', async () => {
        const queryData = {
            filename: 'fjord',
            width: 100,
            height: 100
        }
        const output = await getThumbnail(queryData);
        expect(!!output).toBe(true);
    })

    it('throws error if invalid filename', async () => {
        const queryData = {
            filename: 'random',
            width: 100,
            height: 100
        }
        await expectAsync(createThumbnail(queryData)).toBeRejectedWithError();
    })

    it('throws error if invalid resize arg', async () => {
        const queryData = {
            filename: 'random',
            width: 100,
            height: -100
        }
        await expectAsync(createThumbnail(queryData)).toBeRejectedWithError();
    })

}); 