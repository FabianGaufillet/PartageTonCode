import { uploadLimit } from "../utils/constants.js";

export default {
  limits: {
    fileSize: uploadLimit,
  },
  createParentPath: true,
  safeFileNames: true,
  preserveExtension: true,
  abortOnLimit: true,
};
