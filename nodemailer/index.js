require("dotenv").config();
let nodemailer = require("nodemailer");
let cors = require("cors");
const express = require("express");
const app = express();
app.use(express.json());
app.use(cors());

app.post("/register", (req, res) => {
  const { email } = req.body;

  console.log(email);

  // Create an email message
  const mailOptions = {
    from: "2020.sarvesh.limaye@ves.ac.in",
    to: email,
    subject: "[Medscape] Welcome Onboard",
    text: `Hello,Thank you for registering on our website .`,
  };

  // Send the email
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "2020.sarvesh.limaye@ves.ac.in",
      pass: process.env.password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent");
    }
  });
});

app.post("/register-doctor", (req, res) => {
  const { email } = req.body;
  console.log(email);
  // Create an email message
  const mailOptions = {
    from: "2020.sarvesh.limaye@ves.ac.in",
    to: email,
    subject: "[Medscape] Welcome Onboard",
    text: `Hello,Thank you for registering on our website. We look forward to reviewing your appilication and we will get back to you soon`,
  };

  // Send the email
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "2020.sarvesh.limaye@ves.ac.in",
      pass: process.env.password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent");
    }
  });
});

app.post("/patient-link", (req, res) => {
  const { email, link, date, startTime, endTime } = req.body;

  console.log(email + "patient");

  // Create an email message
  const mailOptions = {
    from: "2020.sarvesh.limaye@ves.ac.in",
    to: email,
    subject: `[MedScape] Meetlink link for ${date}`,
    html: `
    <p><b>Appointment Approved . Find the meet Link attached below🎉🎉!</b></p>
     <a href=${link}>Link </a>
     <p> Start Time : ${startTime} </p>
     <p> End Time : ${endTime} </p>
    <br>
    <p>Best regards,</p>
    <p>[Medscape]  Team</p>
    `,
  };

  // Send the email
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "2020.sarvesh.limaye@ves.ac.in",
      pass: process.env.password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent");
    }
  });
});

app.post("/doctor-link", (req, res) => {
  const { email, link, date, startTime, endTime } = req.body;

  console.log(email + "doctor");

  // Create an email message
  const mailOptions = {
    from: "2020.sarvesh.limaye@ves.ac.in",
    to: email,
    subject: `[MedScape] Meetlink link for ${date}`,
    html: `
    <p><b>Find the meet Link attached below🎉🎉!</b></p>
     <a href=${link}>Link </a>
     <p> Start Time : ${startTime} </p>
     <p> End Time : ${endTime} </p>
    <br>
    <p>Best regards,</p>
    <p>[Medscape]  Team</p>
    `,
  };

  // Send the email
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "2020.sarvesh.limaye@ves.ac.in",
      pass: process.env.password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent");
    }
  });
});
app.post("/doctor-approval", (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  // Create an email message
  const mailOptions = {
    from: "2020.sarvesh.limaye@ves.ac.in",
    to: email,
    subject: "[MedScape] Doctor Registration Approved",
    html: `
    <p><b>Congratulations🎉🎉!</b></p>
    <p>We are thrilled to inform you that, the  you registeration has been approved.</p>
    <p>We thank you for taking initiative to register and help patiens!</p>
    <p>If you have any further questions or need assistance, please feel free to contact us. We look forward to a fantastic event!</p>
    <br>
    <p>Best regards,</p>
    <p>[Medscape] Event Team</p>
    `,
  };

  // Send the email
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "2020.sarvesh.limaye@ves.ac.in",
      pass: process.env.password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent");
    }
  });
});
async function main() {
  app.listen(5000, console.log(`Server started at port 5000`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
