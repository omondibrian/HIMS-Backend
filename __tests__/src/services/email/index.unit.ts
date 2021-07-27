import "reflect-metadata";
import nodemailer from "nodemailer";
import NotificationService, { IMail } from "../../../../src/services/email";

describe("Notification service", () => {
  const setup = async () => {
    const test = await nodemailer.createTestAccount();
    return test;
  };

  it("should successfully send mail", async () => {
    const testAccount = await setup();
    const notification = new NotificationService({
      hostSMTP: "smtp.ethereal.email",
      user: testAccount.user,
      password: testAccount.pass,
    });
    const mail: IMail = {
      to: "test@gmail.com",
      from: "noreply@gmail.com",
      body: "<H1> test msg</H1>",
      subject: "testing",
      text: "test msg",
    };
    const result = await notification.send(mail);
    console.log(result);
    expect(result).toBeDefined();
  }, 100000);
});
