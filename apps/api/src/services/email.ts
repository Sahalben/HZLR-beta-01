import { Resend } from 'resend'

// Initialize lazily to prevent fatal boot crashes if the env var isn't loaded yet
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendOtpEmail(to: string, otp: string) {
  if (!resend) {
    console.log(`[MOCK EMAIL API] To: ${to}, OTP: ${otp}. (No RESEND_API_KEY set)`);
    return { data: { id: 'mock-email-id' } };
  }
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
