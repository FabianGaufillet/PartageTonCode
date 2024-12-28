import imgbbUploader from "imgbb-uploader";
import { IMGBB_API_KEY } from "../config/env.js";

export const uploadFile = async (buffer, filename) => {
  try {
    const options = {
      apiKey: IMGBB_API_KEY,
      base64string: buffer.toString("base64"),
      name: filename,
    };
    const data = await imgbbUploader(options);
    if (data.display_url && data.delete_url) {
      return { status: 200, message: "File uploaded", data: data };
    }
    return { status: 400, message: "File not uploaded", data: data };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};
