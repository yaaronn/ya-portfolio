# YA — Personal Developer Portfolio

A personal portfolio website showcasing my software development experience, technical skills, projects, and professional background.

**Live Website:** https://yaaron.site

## Overview

This project is a full-stack developer portfolio built to present my work, demonstrate my technical capabilities, and provide a way for visitors and potential collaborators to contact me.

## Features

- **Personal Portfolio:** Introduction, professional background, and technical skills.
- **Projects Showcase:** Highlights selected development and AI-related projects.
- **Contact Form:** Allows visitors to send enquiries.
- **Admin Dashboard:** Secure admin login and contact message management.
- **Message Management:** View messages, manage read/unread status, and delete messages.
- **Responsive Design:** Layout adapted for desktop and mobile devices.

## Technology Stack

| Category | Technology |
|---|---|
| Frontend & Backend | Next.js |
| Programming Language | TypeScript |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Authentication | Auth.js |
| Password Hashing | bcryptjs |
| Rate Limiting | Upstash Redis |
| Deployment | Netlify |
| Version Control | Git & GitHub |

## Application Architecture

```text
             Visitor
                |
                v
        Next.js Portfolio
                |
        +-------+-------+
        |               |
        v               v
    Contact Form    Admin Dashboard
        |               |
        v               v
    API Endpoint    Auth.js Login
        |               |
        +-------+-------+
                |
                v
          Prisma ORM
                |
                v
          Neon PostgreSQL
```

## Deployment

The application is deployed on Netlify with a custom domain.

- Production URL: https://yaaron.site
- Source Code: https://github.com/yaaronn/ya-portfolio

## Local Development

### Prerequisites

- Node.js
- npm
- PostgreSQL-compatible database
- Required environment variables

### Installation

Clone the repository:

```bash
git clone https://github.com/yaaronn/ya-portfolio.git
cd ya-portfolio
```

Install dependencies:

```bash
npm install
```

Configure the environment variables in `.env` according to the project configuration.

Generate the Prisma client:

```bash
npx prisma generate
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Project Highlights

- Built and deployed a full-stack portfolio application.
- Integrated a contact management workflow.
- Implemented authenticated administration.
- Connected a PostgreSQL database using Prisma.
- Configured production deployment with a custom domain.

## Author

**YA — Yeshwanth Aaron**

- Portfolio: https://yaaron.site
- GitHub: https://github.com/yaaronn
- LinkedIn: https://www.linkedin.com/in/yeshwanth-aaron-7441a1205/
