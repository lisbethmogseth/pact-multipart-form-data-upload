import axios from "axios";

interface UploadParams {
  baseUrl: string;
  file: Blob;
}

export const uploadPdf = async ({ baseUrl, file }: UploadParams) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${baseUrl}/api/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
