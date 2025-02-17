# Build-a-Site AI

Build-a-Site AI is an automated website builder that leverages the power of AI to generate content and images for your website. The application uses OpenAI API for content creation and Stable Diffusion AI for image generation. The content is then added to prebuilt section templates and styled using TailwindCSS. The processed content is stored in an AWS S3 bucket which is made public. Users have the option to edit and update the content, and when saved, the site files are updated in the bucket. Users can also add a domain using Cloudflare.

## Features

- AI-powered content and image generation
- Prebuilt section templates
- Styling using TailwindCSS
- Content storage in AWS S3 bucket
- Editable content
- Domain addition using Cloudflare

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js and npm
- You have a basic understanding of JavaScript and Node.js

## Installing Build-a-Site AI

To install Build-a-Site AI, follow these steps:

1. Clone the repo
```git clone https://github.com/i-dream-of-ai/build-a-site```

2. Install NPM packages
```npm install```


## Using Build-a-Site AI

This application uses a number of environment variables for configuration. You'll need to set these up to get the application running.

To use Build-a-Site AI, follow these steps:

1. Rename `.env.example` to `.env`.

2. Update the `.env` file with your credentials and settings:

   - `NEXTAUTH_SECRET`: A secret used to encrypt session data. You can generate a random string for this.
   - `NEXTAUTH_URL`: The base URL for your application.
   - `NEXT_PUBLIC_APP_URL`: The public URL for your application.
   - `ADMIN_EMAIL`: The email address for the admin user of the application.
   - `MONGODB_URI`: The URI for your MongoDB database.
   - `MONGODB_DB`: The name of your MongoDB database.
   - `DEFAULT_MODEL`, `NEXT_PUBLIC_DEFAULT_MODEL`, `NEXT_PUBLIC_DEFAULT_TEMPERATURE`, `NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT`: These are settings for the OpenAI API calls. You should not need to change these unless you have specific requirements.
   - `OPENAI_API_KEY`, `OPENAI_ORGANIZATION`: Your OpenAI API key and organization ID.
   - `STABLE_DIFFUSION_KEY`: Your Stable Diffusion API key for image generation.
   - `SENDGRID_API_KEY`, `EMAIL_SECRET`, `EMAIL_FROM`: Your SendGrid API key, a secret for encrypting email data, and the email address for outgoing emails.
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`: Your Stripe API keys for handling user subscriptions.
   - `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`: Your AWS credentials for deploying to AWS S3. Make sure to set the necessary permissions in your AWS account.

3. After setting up the `.env` file, you can start the application with `npm run start`.

## Technologies Used

This project utilizes a number of cutting-edge libraries and services:

- [OpenAI API](https://openai.com/): Used for generating website content.
- [Stable Diffusion AI](https://stablediffusion.ai/): Used for generating images.
- [TailwindCSS](https://tailwindcss.com/): A utility-first CSS framework used for styling the application.
- [PostCSS](https://postcss.org/): A tool for transforming CSS with JavaScript.
- [AWS S3](https://aws.amazon.com/s3/): Used for storing and serving the generated website content.
- [Cloudflare](https://www.cloudflare.com/): Used for managing domains.
- [NextAuth.js](https://next-auth.js.org/): A complete open source authentication solution for Next.js applications.
- [MongoDB](https://www.mongodb.com/): A source-available cross-platform document-oriented database program.
- [SendGrid](https://sendgrid.com/): A cloud-based SMTP provider that allows you to send email without having to maintain email servers.
- [Stripe](https://stripe.com/): Online payment processing for internet businesses.

