const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SEND_GRID_API);

const sendWelcomeEmail = (email, name, token) => {
  sgMail.send({
    to: email,
    from: "reiokr@gmail.com",
    subject: "Welcome to the app",
    text:
      "Welcome to the app, ${name}. Let me know how you get along with the app",
    html: `
    <h1 style="color: blue">Task-Manager</h1>
    <h3>New task manager app</h3>
    <p>Welcome to the app, ${name}. Let me know how you get along with the app</p>
    <p style="color: green">verify: ${token}</p>
    `,
  });
};
const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "reiokr@gmail.com",
    subject: "Your Task-Manager account is canceled",
    text:
      "We are sad you leaving us, ${name}. Please let us know why you choose to leave Task-Manager app",
    html: `
    <h1 style="color: blue">Task-Manager</h1>
    <h3>New task manager app</h3>
    <p>We are sad you leaving us, ${name}. Please let us know why you choose to leave Task-Manager app</p>
    `,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
};
