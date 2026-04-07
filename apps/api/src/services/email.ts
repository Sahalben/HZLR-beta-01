import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOtpEmail(to: string, otp: string) {
  return resend.emails.send({
    from: process.env.FROM_EMAIL ?? 'noreply@hzlr.in',
    to,
    subject: 'Your HZLR verification code',
    html: `
      HZLR.
      <br/><br/>
      Your verification code:
      <h2>${otp}</h2>
      Expires in 5 minutes. Never share this code.
    `
  })
}
