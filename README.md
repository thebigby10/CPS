# Competitive Programming Platform (Frontend)

A Next.js-based frontend for a Competitive Programming Platform that integrates with a Strapi backend.

## Project Overview

This project provides a learning platform for competitive programming with features including:

- User authentication (login/registration)
- Course browsing and enrollment
- Module-based learning structure
- Role-based access control (students, managers, normal users)
- Admin panel for course and user management

## Installation and Setup

### Prerequisites

- Node.js v18+
- npm or yarn
- Strapi backend running on `http://localhost:1337`

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
3. Create a .env.local file in the root directory with the following environment variables:
  ```bash
  NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
  ```

### Running the Development Server
  ```bash
  npm run dev
  # or
  yarn dev
  ```

Open http://localhost:3000 in your browser.

## Features

### User Roles

### Normal User:

- Browse available courses

- Register as a student

### Student:

- All normal user features

- Enroll in courses

- View enrolled courses

- Access course modules

### Social Media Manager:

- All student features

- Manage courses and modules

- Manage user roles

- Handle enrollments

### Pages

/ - Homepage with course listings

/login - User login

/register - User registration

/courses - Student's enrolled courses

/courses/[id] - Course details and modules

/manager - Admin panel (manager-only)

/reset-password - Password reset flow

## Dependencies

Core Dependencies

- Next.js 15.2.4

- React 19

- TypeScript 5

- Tailwind CSS 4

- Axios 1.10.0

UI Components

- shadcn/ui components (customizable)

- Radix UI primitives

- Lucide React icons

- Class Variance Authority for variant management

## Configuration

### Environment Variables

Create a .env.local file with:
```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

## Strapi Backend Requirements

### Strapi Backend Requirements

Your Strapi backend should have:

- User authentication endpoints

- Course and module content types

- Role-based permissions configured

- Proper CORS settings for http://localhost:3000
