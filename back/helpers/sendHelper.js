import transporter from "../config/nodemailer.js";

export const sendMail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    if (info.rejected.length > 0) {
      return { status: 400, message: "Email rejected", data: info };
    }
    return { status: 200, message: "Email sent", data: info };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};
