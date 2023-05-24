import nodemailer from 'nodemailer'
import config from './config/config.js'
import Twilio from 'twilio'
import logger from './logger.js'

export const sendMail = (user, textMessage) => {
    let configMail = {
        service: 'gmail',
        auth: {
            user: config.app.mail_sender,
            pass: 'tpejkdmdokxoejtc'
        }
    }
    let transporter = nodemailer.createTransport(configMail)
    let message = {
        from: config.app.mail_sender,
        to: user.email,
        subject: textMessage.subject,
        text: textMessage.text
    }
    transporter.sendMail(message)
        .then(() => {
            //return res.status(201).json({ msg: 'Recibiste un correo' })
            logger.log('info', 'Registro de usuario existoso')
        })
        .catch(error => {return res.status(500).json({ error })})
}

export const sendSMS = (phoneNumber) => {
    //const number = user.phoneNumber
    const number = process.env.TEST_PHONE
    let randomN = Math.floor(Math.random() * 90000) + 10000
    
    //const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const accountSid = process.env.SMS_ACCOUNTID
    const authToken = process.env.SMS_TOKEN
    const client = Twilio(accountSid, authToken);

    client.messages
        .create({body: `El codigo de confirmación es ${randomN}`, from: '+16205089446', to: number})
        .then(message => console.log(message.sid));
}