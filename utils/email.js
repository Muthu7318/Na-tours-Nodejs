const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.fname = user.name.split(' ')[0];
    this.url = url;
    this.from = `muthukumar ${process.env.EMAIL_FROM}`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return 1;
    }
    // for dev
    //1) create transporter - this will actually send email
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      // activate in gmail less secure app option
    });
  }

  async send(template, subject) {
    // render the html for email based on pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        fname: this.fname,
        url: this.url,
        subject: subject,
      }
    );
    // define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html: html,
      text: htmlToText.fromString(html),
      //html
    };

    // create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours adventure');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'your password reset token valid for only 10 mins'
    );
  }
};
