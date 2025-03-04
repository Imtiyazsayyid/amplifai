import { ourFileRouter } from "@/app/api/uploadthing/core";
import { genUploader } from "uploadthing/client";

export const { uploadFiles } = genUploader<typeof ourFileRouter>({ url: "/api/uploadthing", package: "" });

export const uploadSingleFile = async (file: File): Promise<ActionResponse> => {
  try {
    const response = await uploadFiles("serverImage", {
      files: [file],
    });

    if (response) {
      return { data: response[0].ufsUrl, message: "Success", status: true };
    }
    return { data: null, message: "Failed to Upload File", status: false };
  } catch (error) {
    return { data: null, message: "Failed to Upload File", status: false };
  }
};
