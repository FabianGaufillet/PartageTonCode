export const uploadFile = async (file, path) => {
  try {
    await file.mv(path);
    return { status: 200, message: "File uploaded successfully", data: path };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};
