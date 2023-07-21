import { MatchersV3, PactV3 } from "@pact-foundation/pact";
import { readFileSync } from "fs";
import path from "path";
import * as uploadService from "../src/services/upload.service";

const provider = new PactV3({
  dir: "./pacts/",
  consumer: "consumer",
  provider: "provider",
  logLevel: "debug",
});

describe("POST /api/upload", () => {
  const PDF_FILE_PATH = path.join(process.cwd(), "tests/empty.pdf");
  const PDF_FILE_DATA = readFileSync(PDF_FILE_PATH);

  describe("Specifying expected response headers causes issue with the body", () => {
    it("upload file and return fileId as string", async () => {
      provider
        .uponReceiving("a request to upload pdf with expected headers")
        .withRequestMultipartFileUpload(
          {
            method: "POST",
            path: `/api/upload`,
          },
          "text/plain",
          PDF_FILE_PATH,
          "file"
        )
        .willRespondWith({
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          status: 200,
          body: MatchersV3.string("some string"),
        });

      await provider.executeTest(async (mockServer) => {
        const result = await uploadService.uploadPdf({
          baseUrl: mockServer.url,
          file: new Blob([PDF_FILE_DATA], {
            type: "application/pdf",
          }),
        });
        // expect(result.data).toEqual("some string");
      });
    });
  });

  describe("Without expected response headers the body is as expected", () => {
    it("upload file and return fileId as string", async () => {
      provider
        .uponReceiving("a request to upload pdf without expected headers")
        .withRequestMultipartFileUpload(
          {
            method: "POST",
            path: `/api/upload`,
          },
          "text/plain",
          PDF_FILE_PATH,
          "file"
        )
        .willRespondWith({
          // headers: { "Content-Type": "text/plain;charset=utf-8" },
          status: 200,
          body: MatchersV3.string("some string"),
        });

      await provider.executeTest(async (mockServer) => {
        const result = await uploadService.uploadPdf({
          baseUrl: mockServer.url,
          file: new Blob([PDF_FILE_DATA], {
            type: "application/pdf",
          }),
        });
        expect(result.data).toEqual("some string");
      });
    });
  });
});
