/**
 * @fileOverview contains the various functions to manage the users route.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import nodemailer, { Transporter } from "nodemailer";

export interface IMailer {
  send: (mail: IMail) => Promise<{ messageId: string; msg: string }>;
}
export interface IMail {
  to: string;
  from: string;
  body: string;
  subject: string;
  text: string;
}
class NotificationService implements IMailer {
  private notificationTransporter: Transporter;
  constructor(
    private readonly hostCredentials: {
      user: string;
      password: string;
      hostSMTP: string;
    }
  ) {
    // create reusable transporter object using the default SMTP transport
    this.notificationTransporter = nodemailer.createTransport({
      host: this.hostCredentials.hostSMTP,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.hostCredentials.user,
        pass: this.hostCredentials.password,
      },
    });
  }
  send = async (mail: IMail): Promise<{ messageId: string; msg: string }> => {
    // if(process.env.Node_ENV === 'test'){
    //   return {
    //     messageId: '675-4545-664',
    //     msg: "Message sent Successfull",
    //   };
    // }
    // send mail with defined transport object
    let info = await this.notificationTransporter.sendMail({
      from: mail.from, // sender address
      to: mail.to, // list of receivers
      subject: mail.subject, // Subject line
      text: mail.text, // plain text body
      html: mail.body, // html body
    });
    console.log("Message sent: %s", info.messageId);
    this.hostCredentials.hostSMTP === "smtp.ethereal.email" &&
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return {
      messageId: info.messageId,
      msg: "Message sent Successfull",
    };
  };
}

export default NotificationService;
