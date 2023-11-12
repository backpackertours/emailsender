require('dotenv').config()
const express = require('express')
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const fs = require('fs')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// setup email transporter object
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

app.get('/sendemail', (req, res) => {
    const { name, phone, email, message } = req.body

    // html template for email
    const renderedHtml = ejs.render(`
    <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thanks for the Inquiry, <%= name %>!</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }

                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                }

                .title {
                    text-align: center;
                    color: #333;
                    font-size: 24px;
                    margin-bottom: 20px;
                }

                .body-content {
                    color: #555;
                    font-size: 16px;
                    line-height: 1.5;
                    margin-bottom: 30px;
                    text-align: center;
                }

                .footer {
                    text-align: center;
                    color: #777;
                    font-size: 16px;
                }

                .logo {
                    width: 40%;
                    height: auto;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="title">
                    <h2>Thanks for the Inquiry <%= name %>!</h2>
                </div>
                <div class="body-content">
                    <p>Thank you for reaching out to us! We have received your inquiry and would like to express our
                        appreciation for considering Backpacker Tours.
                        We will get back to you as soon as possible with the information you need. If you have any additional
                        details to share or questions in the meantime, feel free to reach out to us at backpackmumbai@gmail.com
                        or +91 8082647928, +91 8286835202.
                    </p>
                    <h3>Details You Shared</h3>
                    <p>Name: <%= name %></p>
                    <p>Email: <%= email %></p>
                    <p>Contact No: <%= phone %></p>
                    <p>Message: <%= message %></p>
                </div>
                <div class="footer">
                    <img class="logo"
                        src="https://res.cloudinary.com/dgjllfp17/image/upload/v1699731972/backpackers/logo_ifq8uf.png">
                    <p>Email - backpackmumbai@gmail.com</p>
                    <p>Phone - +91 8082647928, +91 8286835202</p>
                </div>
            </div>
        </body>
        </html>
    `, { name, phone, email, message });

    // generate mail structure
    const mailOptions = {
        from: process.env.MAIL_USER,
        to: `${email}, ${process.env.MAIL_USER}`,
        subject: `Thanks for Enquiry ${name}!`,
        html: renderedHtml
    };

    // send email and send response back
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.status(500).send({ error: error });
        } else {
            res.status(200).send({ 'response': 'success', 'info': info.response });
        }
    });
})

app.listen(process.env.PORT, () => {
    console.log('Listening on port : ', process.env.PORT);
})