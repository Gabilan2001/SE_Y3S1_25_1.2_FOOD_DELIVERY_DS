// Function to generate a verification email template
const verifyEmailTemplate = ({ name, url }) => {
    return `
    <p>Dear ${name},</p>
    <p>Thank you for registering with DS project IT22606426.</p>
    <p>Please click the button below to verify your email:</p>
    <a href="${url}" 
       style="color: white; background: blue; padding: 10px 20px; text-decoration: none; display: inline-block; border-radius: 5px;">
        Verify Email
    </a>
    <p>If you did not create this account, please ignore this email.</p>
    `;
};

// Export the function so it can be used in other files
export default verifyEmailTemplate;
