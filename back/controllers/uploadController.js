import * as uploadHelper from "../helpers/uploadHelper.js";
import { tempFolder } from "../utils/constants.js";

export const uploadFile = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res
      .status(400)
      .json({ message: "No files were uploaded.", data: null });
  }
  const file = req.files.file;
  const { fileId } = req.body;
  const extension = file.name.split(".").pop();
  const path = `${tempFolder}${fileId}.${extension}`;
  const { status, message, data } = await uploadHelper.uploadFile(file, path);
  return res.status(status).json({ message, data });
};
