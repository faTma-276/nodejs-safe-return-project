import nodemailer from 'nodemailer'

import  jwt  from 'jsonwebtoken'
import { html } from './user.email.html.js'
import { passwordhtml } from './password.html.js'

export const sendEmail =async(options)=>{
    let transporter =nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:"safereturn10@gmail.com",
            pass:"lafd cgcx pvrw vuey"
        }
    })
    let token =jwt.sign({email:options.email},process.env.jwt_KEY,{ expiresIn: '5m' } )
    let info =await transporter.sendMail({
        from:'"Safe Return" <safereturn10@gmail.com>',
        to:options.email,
        subject:"Confirm Email",
        html:html(token)
    })
    console.log(info)
}

export const sendpassEmail =async(options)=>{
    let transporter =nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:"safereturn10@gmail.com",
            pass:"lafd cgcx pvrw vuey"
        }
    })
    let token =jwt.sign({email:options.email},process.env.jwt_KEY,{ expiresIn: '5m' } )
    let info =await transporter.sendMail({
        from:'"Safe Return" <safereturn10@gmail.com>',
        to:options.email,
        subject:"Reset Password",
        html:passwordhtml(token)
    })
    console.log(info)
}
// export const sendEmail =async({from= process.env.EMAIL,to,subject="hello",html})=>{
//     let transporter =nodemailer.createTransport({
//         service:'gmail',
//         auth:{
//             user:process.env.EMAIL,
//             pass:process.env.PASSWORD
//         }
//     })
//     let token =jwt.sign({email:to},process.env.jwt_KEY)
//     let info =await transporter.sendMail({
//         from:'"Safe Return" <safereturn10@gmail.com>',
//         to,
//         subject,
//         html:html(token),
//     })
//     console.log(info)
// }
