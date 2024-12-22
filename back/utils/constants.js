const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4200",
  "https://partagetoncode.onrender.com",
];
const uploadLimit = 2 * 1024 * 1024;
const tempFolder = import.meta.dirname + "/../public/tmp/";
const uploadPath = import.meta.dirname + "/../public/uploads/";
const userNameMinLength = 3;
const userNameMaxLength = 20;
const roles = ["user", "admin"];
const genders = ["male", "female", "other"];
const minAge = 13;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const defaultPostsByPage = 10;
const postTitleMinLength = 3;
const postTitleMaxLength = 100;
const postContentMinLength = 3;
const postContentMaxLength = 10000;
const commentContentMinLength = 3;
const commentContentMaxLength = 10000;
const messageMinLength = 3;
const messageMaxLength = 10000;
const notificationTitleMinLength = 3;
const notificationTitleMaxLength = 100;
const notificationContentMinLength = 3;
const notificationContentMaxLength = 1000;

export {
  allowedOrigins,
  uploadLimit,
  tempFolder,
  uploadPath,
  userNameMinLength,
  userNameMaxLength,
  roles,
  genders,
  minAge,
  passwordRegex,
  emailRegex,
  defaultPostsByPage,
  postTitleMinLength,
  postTitleMaxLength,
  postContentMinLength,
  postContentMaxLength,
  commentContentMinLength,
  commentContentMaxLength,
  messageMinLength,
  messageMaxLength,
  notificationTitleMinLength,
  notificationTitleMaxLength,
  notificationContentMinLength,
  notificationContentMaxLength,
};
