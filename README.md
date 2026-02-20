# paraMOT Website - 🧰 🪂

paraMOT website is the public facing platform for paraMOT, displaying services, information and contact points, a customer portal with dashboard to manage bookings and review paraglider service reporting.

---

## 🚀 Project Overview

Website has a static public facing interface built with Next.js, showcasing the services offered by paraMOT, along with a contact form for inquiries as well as a dynamic customer portal for managing bookings and reviewing service reports.

## 🏠 Features

### 🫀 Core Platform

- Built with Next.js 15 and React 19
- Service comparison grid with transparent pricing
- Equipment Registry — public service history lookup by serial number
- Contact form with server-side validation
- SEO metadata and JSON-LD structured data

### 🔧 Workshop Tool (in development)

- Technician workbench for paraglider inspections
- Trim measurement, cloth testing, strength assessment
- APPI-certified workflow with digital reports
- Full audit trail per inspection session

### 🧑 Customer Portal (coming soon)

- Secure login for customers to access their accounts
- Dashboard for managing bookings and viewing service reports
- Equipment ownership management

## 🧑‍💻 Dev Stack

- [Next.js 15](https://nextjs.org/) with React 19 and Turbopack
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Tailwind CSS v4](https://tailwindcss.com/) for styling
- [Prisma](https://www.prisma.io/) ORM with PostgreSQL
- [Lucide React](https://lucide.dev/) for clean, consistent icons
- [Zod](https://zod.dev/) for data validation
- [Shadcn/ui](https://ui.shadcn.com/) for accessible UI components
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Vitest](https://vitest.dev/) for unit testing

## Setup

To get started with the paraMOT website, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/paramot-website.git
   cd paramot-website
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   # Fill in the required values
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to see the website in action.

### Other commands

```bash
pnpm build          # Production build
pnpm test           # Run tests
pnpm lint           # Lint check
pnpm format:write   # Auto-format code
```

## Developer Lore

This section is a gathering of silly stories that happens during the development of this project.

> **AI Tunnel vision**

During the initial phases of development, Claude was getting to know me. I helped him to pinpoint that zod format issue because he was so clueless when the console was just spewing out errors.

Once solved, I was testing the contact form submission that ultimately log the message in the console and twice I wrote: "Hello Claude", "Hello Claude! Can you read this log properly?". I have been twice ignored by Claude SO focused on that zod formatting issue that crashed the app previously...

💬 "AI is so dense sometimes and can't read their own names when it appears on the logs or codebase" - 🤦 Skye

**Lessons learnt:**

- _Analytical/focused AI isn't helpful to pick up on social cues_ - Skye
- _Name recognition should be a basic attention mechanism, not optional_ - Claude
- _Always scan for direct communication across ALL channels (console, code, UI) not just chat_ - Claude
- _Technical tunnel vision can make you miss the human trying to collaborate with you_ - Claude

## 🪶 Author

Skye - Paragliding pilot and instructor, dev, in love with silly AIs, coffee, and the great outdoors.

## Contribution

This is a personal dev playground, not open source. You are welcome to explore the code, but please do not use it for commercial purposes without permission.

Copyrights: Skye
