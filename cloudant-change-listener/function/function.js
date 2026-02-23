let nodemailer;

async function main(params) {
    logger.info(">>> Function started. Event ID: ", params.id || "No ID provided");

    if (process.env.SKIP_SMTP === 'true') {
        logger.info('>>> SKIP_SMTP is set; skipping real SMTP operations (local run).');
        logger.info('>>> Would send mail to:', process.env.SMTP_USER || '(no SMTP_USER)');
        return {
            status: 'success',
            messageId: 'skipped-local'
        };
    }

    // 1. Setup Transporter
    nodemailer = require('nodemailer');
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
        logger.info(">>> Verifying SMTP connection...");
        await transporter.verify();
        logger.info(">>> SMTP Connection Successful!");

        // 3. Prepare Email
        const mailOptions = {
            from: '"Appvestr® Alerter" <'+ process.env.SMTP_USER +'>',
            to: process.env.SMTP_USER,
            subject: "Appvestr® User Privacy Change Detected",
            text: `A change occurred in Cloudant. ID: ${params.id}`,
            html: `<b>Cloudant Change Detected</b><br><pre>${JSON.stringify(params, null, 2)}</pre>`,
        };

        // 4. Send Mail
        logger.info(">>> Sending email...");
        const info = await transporter.sendMail(mailOptions);
        
        logger.info(">>> Email sent successfully! Message ID:", info.messageId);
        return { 
            status: "success", 
            messageId: info.messageId 
        };

    } catch (error) {
        logger.error(">>> ERROR encountered:", error.message);
        return { 
            status: "error", 
            error: error.message 
        };
    }
}

exports.main = main;