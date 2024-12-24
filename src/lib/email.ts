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
        name: 'EDUVITA Platform',
        address: process.env.SMTP_FROM_EMAIL!
      },
      to: email,
      subject: 'Welcome to the EDUVITA Platform – Unlock Your Academic and Coding Potential! 🌟',
      html: `  
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
          <h2>Hello ${firstName},</h2>
          
          <p>Thank you for registering on the <strong>EDUVITA Platform</strong>! 🌟 Here, you can explore a variety of features tailored to enhance both your academic journey and coding skills. Whether you're a student or a teacher, EDUVITA has something valuable for everyone!</p>
          
          <p>Before getting started, let’s walk through some key features and important guidelines for a seamless experience. 📝⚡</p>
          
          <h3>🚨 Platform Features & Guidelines</h3>
          
          <h4>For Students:</h4>
          <ul>
            <li>📌 <strong>Coding Challenges</strong>: Test your skills with curated challenges and stand a chance to unlock exciting opportunities! 💼✨</li>
            <li>📌 <strong>Exam Seat Allocation</strong>: View your assigned exam seats and stay informed.</li>
            <li>📌 <strong>Exam Timetables</strong>: Access your exam schedule anytime, ensuring you’re always prepared.</li>
          </ul>
          
          <h4>For Teachers:</h4>
          <ul>
            <li>📌 <strong>Exam Invigilation Duty</strong>: Check your invigilation assignments effortlessly.</li>
            <li>📌 <strong>Timetable Management</strong>: Stay updated with exam schedules at a glance.</li>
            <li>📌 <strong>Coding Test Evaluation</strong>: Review and grade student submissions with ease.</li>
          </ul>
          
          <h3>🎯 Coding Test Guidelines</h3>
          <ul>
            <li>📌 <strong>Questions</strong>: 5 compulsory questions covering various topics—no skipping!</li>
            <li>⏳ <strong>Duration</strong>: 1 hour to complete the test.</li>
            <li>🔄 <strong>Reattempts</strong>: Only 1 reattempt, so give it your best!</li>
            <li>💻 <strong>Languages</strong>: Choose from Python, Java, JavaScript, or C/C++.</li>
            <li>👀 <strong>Proctoring</strong>: Tests are monitored, and any unfair means will lead to disqualification. 🚫⚠️</li>
          </ul>
          
          <p>🧠 <strong>Pro Tip</strong>: Confidence is your best ally. Stay calm, think clearly, and shine! 🌈</p>
          
          <p>We wish you the very best as you navigate the opportunities and tools available on EDUVITA. Let your skills and potential lead the way to success! 🌟</p>
          
          <p>Warm Regards,<br>
          <strong>EDUVITA Support</strong> 😊</p>
        </div>
      `,
      text: `Hello ${firstName},

Thank you for registering on the EDUVITA Platform! 🌟

Platform Features & Guidelines:
For Students:
- Coding Challenges: Test your skills with curated challenges and unlock exciting opportunities! 💼✨
- Exam Seat Allocation: View your assigned exam seats and stay informed.
- Exam Timetables: Access your exam schedule anytime, ensuring you’re always prepared.

For Teachers:
- Exam Invigilation Duty: Check your invigilation assignments effortlessly.
- Timetable Management: Stay updated with exam schedules at a glance.
- Coding Test Evaluation: Review and grade student submissions with ease.

🎯 Coding Test Guidelines:
- Questions: 5 compulsory questions covering various topics—no skipping!
- Duration: 1 hour to complete the test.
- Reattempts: Only 1 reattempt, so give it your best!
- Languages: Python, Java, JavaScript, or C/C++.
- Proctoring: Tests are monitored, and any unfair means will lead to disqualification. 🚫⚠️

Pro Tip: Confidence is your best ally. Stay calm, think clearly, and shine! 🌈

We wish you the very best as you navigate the opportunities and tools available on EDUVITA. Let your skills and potential lead the way to success! 🌟

Warm Regards,
EDUVITA Support 😊`
    })
    
    console.log('Welcome Email sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('Welcome Email Error:', error);
    return false;
  }
}
