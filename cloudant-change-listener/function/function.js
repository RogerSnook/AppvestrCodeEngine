let nodemailer;
nodemailer = require('nodemailer');

async function main(params) {
    console.info(">>> Function started. Event ID: ", params.id || "No ID provided");

    if (process.env.SMTP_SKIP === 'true') {
        console.info('>>> SMTP_SKIP is set; skipping real SMTP operations (local run).');
        console.info('>>> Would send mail to:', process.env.SMTP_USER || '(no SMTP_USER)');
        return {
            status: 'success',
            messageId: 'skipped-local'
        };
    }

    // 1. Setup Transporter
    const transporter = nodemailer.createTransport({
        host: "smtp.comcast.net",
        port: 587, // Changed to 587 for better cloud compatibility
        secure: false, 
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD, 
        },
    });

    try {
        // 2. Verify Connection
        console.info(">>> Verifying SMTP connection...");
        await transporter.verify();
        console.info(">>> SMTP Connection Successful!");

        // 3. Prepare Email
        const mailOptions = {
            from: '"Appvestr® Alerter" <'+ process.env.SMTP_USER +'>',
            to: process.env.SMTP_USER,
            subject: "Appvestr® User Privacy Change Detected",
            text: `A change occurred in Cloudant. ID: ${params.id}`,
            html: `<b>Cloudant Change Detected</b><br><pre>${JSON.stringify(params, null, 2)}</pre>`,
        };

        // 4. Send Mail
        console.info(">>> Sending email...");
        const info = await transporter.sendMail(mailOptions);
        
        console.info(">>> Email sent successfully! Message ID:", info.messageId);
        return { 
            status: "success", 
            messageId: info.messageId 
        };

    } catch (error) {
        console.error(">>> ERROR encountered:", error.message);
        return { 
            status: "error", 
            error: error.message 
        };
    }
}

exports.main = main;