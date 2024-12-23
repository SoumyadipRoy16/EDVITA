// src/lib/email.ts

import nodemailer from 'nodemailer'
import { setOTP } from './redis'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const sendOTPEmail = async (email: string) => {
  const otp = generateOTP()
  
  try {
    console.log('Generating OTP:', {
      email,
      otp
    });

    // Store OTP in Upstash Redis with explicit conversion
    await setOTP(email, otp)
    
    console.log('OTP Stored for:', email);

    await transporter.sendMail({
        from: {
            name: 'TMS System',
            address: process.env.SMTP_FROM_EMAIL!
          },
      to: email,
      subject: 'Your OTP for Registration',
      text: `Your OTP is: ${otp}. This OTP will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2>OTP Verification</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <h3 style="background-color: #f0f0f0; padding: 10px; text-align: center; letter-spacing: 5px;">${otp}</h3>
          <p>This OTP will expire in 10 minutes. Do not share it with anyone.</p>
        </div>
      `
    })
    
    console.log('OTP Email sent successfully to:', email);
    return true
  } catch (error) {
    console.error('OTP Generation and Email Error:', error)
    return false
  }
}

export const sendWelcomeEmail = async (firstName: string, email: string) => {
  try {
    await transporter.sendMail({
      from: {
        name: 'TSM Platform',
        address: process.env.SMTP_FROM_EMAIL!
      },
      to: email,
      subject: '🎯 Get Ready to Ace Your TSM Test! 🚀',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
          <h2>Hello ${firstName},</h2>
          
          <p>Thank you for registering on the <strong>TSM Platform</strong>! 🌟 Here, you can test your skills on a curated set of challenges and unlock exciting interview opportunities if you excel. 💼✨</p>
          
          <p>Before diving in, let's go through some <strong>important rules and guidelines</strong> to ensure a smooth and fair test experience. 📝⚡</p>
          
          <h3>🚨 Rules & Guidelines</h3>
          
          <ul>
            <li>📌 <strong>Questions</strong>: You'll face <strong>5 compulsory questions</strong> spanning various topics. No skipping! </li>
            <li>⏳ <strong>Duration</strong>: You'll have exactly <strong>1 hour</strong> to complete the test. ⏱️</li>
            <li>🔄 <strong>Reattempts</strong>: You get <strong>only 1 reattempt</strong>, so bring your A-game! 💪</li>
            <li>💻 <strong>Coding Languages</strong>: Choose from <strong>Python, Java, JavaScript, or C/C++</strong>. </li>
            <li>👀 <strong>Monitoring</strong>: The test is <strong>proctored</strong>. Any unfair means will lead to disqualification. 🚫⚠️</li>
          </ul>
          
          <p>🧠 <strong>Pro Tip</strong>: Confidence is key. Stay calm, think clearly, and give it your best shot! 🌈</p>
          
          <p>We wish you the very best of luck! 🍀 Let your skills shine, and don't let this opportunity pass you by! 🌟</p>
          
          <p><strong>Happy Coding!</strong> 💻🎉</p>
          
          <p>Warm Regards,<br>
          <strong>TSM Support</strong> 😊</p>
        </div>
      `,
      text: `Hello ${firstName},

Thank you for registering on the TSM Platform!

Rules & Guidelines:
- Questions: 5 compulsory questions
- Duration: 1 hour
- Reattempts: 1 reattempt
- Coding Languages: Python, Java, JavaScript, or C/C++
- Monitoring: Proctored test

Pro Tip: Stay confident and give your best!

Best of luck!
TSM Support`
    })
    
    console.log('Welcome Email sent successfully to:', email);
    return true
  } catch (error) {
    console.error('Welcome Email Error:', error)
    return false
  }
}