const nodemailer = require('nodemailer');

function buildTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

async function sendOtpEmail({ to, code }) {
  const allowConsole = process.env.ALLOW_CONSOLE_OTP === 'true';
  const transport = buildTransport();

  const subject = 'UniThrift verification code';
  const text = `Your verification code is: ${code}\n\nThis code expires in ~10 minutes.`;

  if (!transport) {
    if (allowConsole) {
      // eslint-disable-next-line no-console
      console.log(`[OTP console mode] To: ${to} Code: ${code}`);
      return { ok: true, transport: 'console' };
    }
    throw Object.assign(new Error('Email transport not configured (SMTP env vars missing).'), { statusCode: 500, expose: false });
  }

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  await transport.sendMail({
    from,
    to,
    subject,
    text
  });

  return { ok: true, transport: 'smtp' };
}

module.exports = { sendOtpEmail };

