import transporter from "../config/nodemailer.js";

export const sendMail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    return { status: 200, message: "Email sent", data: info };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};
