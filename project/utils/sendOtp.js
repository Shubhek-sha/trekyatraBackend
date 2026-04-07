// services/sendOtp.js
import nodemailer from 'nodemailer';

// re_Dp6EPYxv_3ExHgHAxTmPnJvf9D3FH8avi

export const sendOtp = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      family: 4,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,
      // secure: true,
    });

    await transporter.sendMail({
      from: `"TrekYatra" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🏔️ Your Verification Code',
      text: `Your OTP is ${otp}. Valid for 1 minute.`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>OTP Verification</title>
</head>
<body style="margin:0;padding:0;background-color:#0f1a0e;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f1a0e;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">

          <!-- Mountain Header Banner -->
          <tr>
            <td style="background:linear-gradient(160deg,#1a3a1a 0%,#2d5a27 50%,#1a3a1a 100%);border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center;border:1px solid #3a6b33;border-bottom:none;position:relative;overflow:hidden;">
              <!-- Mountain SVG -->
              <div style="margin-bottom:16px;">
                <svg width="80" height="56" viewBox="0 0 80 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="40,4 72,52 8,52" fill="none" stroke="#a8d5a2" stroke-width="2"/>
                  <polygon points="22,28 40,4 58,28" fill="#2d5a27" stroke="#c8e6c4" stroke-width="1.5"/>
                  <line x1="33" y1="18" x2="47" y2="18" stroke="white" stroke-width="1.5" stroke-opacity="0.6"/>
                  <circle cx="62" cy="12" r="5" fill="none" stroke="#f0d080" stroke-width="1.5"/>
                  <line x1="62" y1="5" x2="62" y2="2" stroke="#f0d080" stroke-width="1"/>
                  <line x1="62" y1="19" x2="62" y2="22" stroke="#f0d080" stroke-width="1"/>
                  <line x1="55" y1="12" x2="52" y2="12" stroke="#f0d080" stroke-width="1"/>
                  <line x1="69" y1="12" x2="72" y2="12" stroke="#f0d080" stroke-width="1"/>
                </svg>
              </div>
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#a8d5a2;font-family:Arial,sans-serif;">TrekYatra</p>
              <h1 style="margin:0;font-size:26px;color:#f0f7ee;font-family:'Georgia',serif;font-weight:normal;letter-spacing:1px;">Verify Your Identity</h1>
            </td>
          </tr>

          <!-- Main Card Body -->
          <tr>
            <td style="background:#ffffff;padding:40px;border-left:1px solid #3a6b33;border-right:1px solid #3a6b33;">

              <!-- Greeting -->
              <p style="margin:0 0 8px;font-size:15px;color:#3a3a2a;line-height:1.6;">
                You're one step away from your next adventure.
              </p>
              <p style="margin:0 0 32px;font-size:14px;color:#6b7a60;line-height:1.6;">
                Use the code below to verify your account. It expires in <strong style="color:#2d5a27;">1 minute</strong>.
              </p>

              <!-- OTP Box -->
              <div style="background:linear-gradient(135deg,#f4f9f2 0%,#e8f4e4 100%);border:2px solid #a8d5a2;border-radius:12px;padding:28px 24px;text-align:center;margin-bottom:32px;">
                <p style="margin:0 0 10px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#6b8c60;font-family:Arial,sans-serif;">Your One-Time Code</p>
                <div style="font-size:42px;font-weight:bold;letter-spacing:10px;color:#1a3a1a;font-family:'Courier New',monospace;line-height:1.2;">${otp}</div>
              </div>

              <!-- Warning Note -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#fff8e6;border-left:3px solid #e8a020;border-radius:0 8px 8px 0;padding:14px 16px;">
                    <p style="margin:0;font-size:13px;color:#7a5a10;line-height:1.5;">
                      🔒 Never share this code with anyone. TrekYatra staff will never ask for your OTP.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Didn't request note -->
              <p style="margin:0;font-size:13px;color:#9a9a8a;line-height:1.6;text-align:center;">
                Didn't request this? You can safely ignore this email.<br/>Your account remains secure.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1a2e18;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border:1px solid #3a6b33;border-top:none;">
              <!-- Trail dots -->
              <div style="margin-bottom:14px;">
                <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#3a6b33;margin:0 3px;"></span>
                <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#5a8b50;margin:0 3px;"></span>
                <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#3a6b33;margin:0 3px;"></span>
              </div>
              <p style="margin:0 0 4px;font-size:12px;color:#6b8c60;font-family:Arial,sans-serif;">TrekYatra — Explore treks of Nepal</p>
              <p style="margin:0;font-size:11px;color:#3a5535;font-family:Arial,sans-serif;">© ${new Date().getFullYear()} TrekYatra. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,
    });

    return {success: true};
  } catch (error) {
    console.error('Failed to send OTP:', error);
    return {success: false, error: 'Failed to send OTP'};
  }
};
