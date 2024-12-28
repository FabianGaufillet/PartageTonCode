import * as uploadHelper from "../helpers/uploadHelper.js";
import { tempFolder, uploadLimit } from "../utils/constants.js";

export const uploadFile = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res
      .status(400)
      .json({ message: "No files were uploaded.", data: null });
  }
  if (req.files.file.size > uploadLimit) {
    return res
      .status(400)
      .json({ message: "File size is too large.", data: null });
  }
  const file = req.files.file;
  const { fileId } = req.body;
  const buffer = file.data;
  const { status, message, data } = await uploadHelper.uploadFile(
    buffer,
    fileId,
  );
  return res.status(status).json({ message, data });
};
