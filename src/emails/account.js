const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'alijawadsheikh@gmail.com',
        subject: 'Welcome to Task Manager Application',
        text: `Hi ${name},
        Welocme to Task Manager App. Hope you'll love it.`
    });
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'alijawadsheikh@gmail.com',
        subject: 'Thanks for Being Our Valued Customer',
        text: `Hi ${name}
        I am Ali Jawad from Task Management Application, Hope you had enjoyed the app.
        Can you please tell us the reason of your Cancellation?`
    })
}
module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}