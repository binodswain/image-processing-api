import supertest from "supertest";

import { doesThumbnailExist, getImageList } from "../helpers/storage";
import { clearThumbnailFolder } from "./helpers/cleanup";
import app from "../index";

const request = supertest(app);

describe("Endpoint testing", () => {
    let fullsizeImage: Array<{ filename: string; url: string }> | null = null;

    beforeAll(clearThumbnailFolder);
    beforeAll(async () => {
        fullsizeImage = await getImageList();
    });

    it("GET req to base url", async () => {
        const response = await request.get("/");
        expect(response.status).toBe(200);
    });

    it("GET req with valid params", async () => {
        const response = await request.get(
            "/api/images?filename=palmtunnel&height=700&width=800"
        );
        expect(response.status).toBe(200);
        const output = await doesThumbnailExist(`palmtunnel-700x800.jpg`);
        expect(output).toBe(true);
    });

    it("GET req with invalid filename", async () => {
        const response = await request.get(
            "/api/images?filename=invalid&height=700&width=800"
        );
        expect(response.status).toBe(400);
        const output = await doesThumbnailExist(`invalid-700x800.jpg`);
        expect(output).toBe(false);
    });

    it("GET req with only height param", async () => {
        const response = await request.get(
            "/api/images?filename=palmtunnel&height=700"
        );
        expect(response.status).toBe(200);
        const output = await doesThumbnailExist(`palmtunnel-700xauto.jpg`);
        expect(output).toBe(true);
    });

    it("GET req with only width param", async () => {
        const response = await request.get(
            "/api/images?filename=palmtunnel&width=800"
        );
        expect(response.status).toBe(200);
        const output = await doesThumbnailExist(`palmtunnel-autox800.jpg`);
        expect(output).toBe(true);
    });

    it("GET req with only filename param", async () => {
        const response = await request.get("/api/images?filename=palmtunnel");
        expect(response.status).toBe(200);
    });

    it("GET req with missing filename param", async () => {
        const response = await request.get("/api/images?width=800&height=700");
        expect(response.status).toBe(400);
    });

    it("GET req to fetch all fullsize images", async () => {
        const response = await request.get("/api/images");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(fullsizeImage);
    });
});
