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
