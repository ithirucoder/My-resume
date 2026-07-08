# EmailJS Setup Instructions

To enable the contact form to send emails to your Gmail address (ithirucoder@gmail.com), you need to configure EmailJS. Follow these steps:

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (the free tier allows up to 200 emails/month)
3. Verify your email address

## Step 2: Create an Email Service

1. After logging in, click on "Email Services" in the sidebar
2. Click "Add New Service"
3. Select "Gmail" as your email service
4. Click "Connect Account" and authorize EmailJS to access your Gmail
5. Your service will be created with a Service ID (copy this ID)

## Step 3: Create an Email Template

1. Click on "Email Templates" in the sidebar
2. Click "Create New Template"
3. Give your template a name (e.g., "Contact Form")
4. Configure the template with the following:

**Subject:**
```
New Contact Form Message from {{from_name}}
```

**To Email:**
```
ithirucoder@gmail.com
```

**Message Body:**
```
You have received a new message from your contact form!

From: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}
```

5. Save the template and copy the Template ID

## Step 4: Get Your Public Key

1. Click on your account name in the top right
2. Go to "Account" or "General Settings"
3. Copy your "Public Key" (also called Public Key)

## Step 5: Update Contact.html

Open `Contact.html` and replace the placeholder values in the JavaScript section:

**Line 136 - Replace YOUR_EMAILJS_PUBLIC_KEY:**
```javascript
emailjs.init("YOUR_ACTUAL_PUBLIC_KEY");
```

**Line 208 - Replace YOUR_EMAILJS_SERVICE_ID and YOUR_EMAILJS_TEMPLATE_ID:**
```javascript
emailjs.send('YOUR_ACTUAL_SERVICE_ID', 'YOUR_ACTUAL_TEMPLATE_ID', templateParams)
```

## Step 6: Test the Contact Form

1. Open your website in a browser
2. Navigate to the Contact page
3. Fill out the form with test data
4. Click "Send Message"
5. Check your Gmail inbox for the test email

## Important Notes

- **Free Tier Limits:** EmailJS free tier allows 200 emails per month. If you expect more traffic, consider upgrading.
- **Security:** Your Public Key is safe to expose in frontend code. It has limited permissions.
- **Spam Protection:** Consider adding reCAPTCHA if you receive spam submissions.
- **Email Delivery:** Emails are sent through EmailJS servers, which may take a few seconds to arrive.

## Troubleshooting

**Email not sending:**
- Check browser console for error messages
- Verify all three IDs (Public Key, Service ID, Template ID) are correct
- Ensure your Gmail account is properly connected to EmailJS

**Template variables not working:**
- Make sure template variables match exactly: `{{from_name}}`, `{{from_email}}`, `{{subject}}`, `{{message}}`
- Check that the template is saved and active

**Rate limiting:**
- If you hit the free tier limit, upgrade your plan or wait for the next month

## Alternative: Use Formspree

If you prefer not to use EmailJS, you can use Formspree as an alternative:

1. Go to [https://formspree.io/](https://formspree.io/)
2. Create a free account
3. Create a new form with your email (ithirucoder@gmail.com)
4. Replace the form action in Contact.html with your Formspree endpoint
5. Remove the EmailJS JavaScript code

For Formspree, you would change the form tag to:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" class="contact-form">
```
