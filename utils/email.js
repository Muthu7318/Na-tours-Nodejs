const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const sgMail = require('@sendgrid/mail');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.fname = user.name.split(' ')[0];
    this.url = url;
    this.from = `testing@gmail.com`;
  }

  newTransport() {
    // if (process.env.NODE_ENV === 'production') {
    // console.log('🧨prod');
    // return nodemailer.createTransport({
    //   service: 'SendGrid',
    //   auth: {
    //     user: process.env.EMAIL_SENDGRID_USERNAME,
    //     pass: process.env.EMAIL_SENDGRID_PASSWORD,
    //   },
    // });
    // }
    // console.log('🧨develpme');
    // for dev
    // 1) create transporter - this will actually send email
    // return nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: process.env.EMAIL_PORT,
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    //   // activate in gmail less secure app option
    // });
    // console.log(process.env.EMAIL_SENDGRID_USERNAME);
    // console.log(process.env.EMAIL_SENDGRID_PASSWORD);
    // return nodemailer.createTransport({
    //   service: 'SendGrid',
    //   auth: {
    //     user: process.env.EMAIL_SENDGRID_USERNAME,
    //     pass: process.env.EMAIL_SENDGRID_PASSWORD,
    //   },
    // });

    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'muthumarshal@gmail.com',
        pass: 'lexisarahwill',
      },
    });
  }

  async send(template, subject) {
    // sgMail.setApiKey(process.env.EMAIL_SENDGRID_PASSWORD);
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
      // from: 'test',
      to: this.to,
      subject: subject,
      html: html,
      text: htmlToText.fromString(html),
      //html
    };
    console.log(this.from);
    // create a transport and send email
    await this.newTransport().sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    // await sgMail.send(mailOptions).then(() => {
    // console.log('Email sent');
    // });
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
