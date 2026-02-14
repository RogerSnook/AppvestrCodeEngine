var nodemailer = require("nodemailer");
    
async function main(params) {
    console.log(">>> Function started. Event ID: ", params.id || "No ID provided");

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
        console.log(">>> Verifying SMTP connection...");
        await transporter.verify();
        console.log(">>> SMTP Connection Successful!");

        // 3. Prepare Email
        const mailOptions = {
            from: '"Code Engine Alerter" <'+ process.env.SMTP_USER +'>',
            to: process.env.SMTP_USER,
            subject: "Cloudant Change Detected",
            text: `A change occurred in Cloudant. ID: ${params.id}`,
            html: `<b>Cloudant Change Detected</b><br><pre>${JSON.stringify(params, null, 2)}</pre>`,
        };

        // 4. Send Mail
        console.log(">>> Sending email...");
        const info = await transporter.sendMail(mailOptions);
        
        console.log(">>> Email sent successfully! Message ID:", info.messageId);
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