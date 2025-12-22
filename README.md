## 🌱 Digital Life Lessons

Live Website:
🔗 https://digitallifelessons-phero11.netlify.app/

# 📌 Project Overview

Digital Life Lessons is a modern full-stack web platform built to help people share real-life experiences and learn from one another. The idea is simple but powerful: every experience teaches something, and those lessons deserve a place to live.

Users can write, explore, and interact with life lessons shared by the community. From personal growth to mindset shifts, the platform encourages reflection, learning, and meaningful digital interaction. The application focuses heavily on usability, performance, and a clean, premium user experience.

The interface is fully responsive, visually polished, and designed to feel smooth on both desktop and mobile devices.

# ✨ Core Features

# 👥 User Experience & Authentication

The platform supports secure authentication using both Email/Password and Google Social Login. After logging in, users get access to role-based dashboards tailored for normal users and administrators. Profile management is available so users can update their personal information easily. A built-in dark and light mode ensures comfortable reading in any environment.

# 📖 Lesson Creation & Interaction

Users can create and publish their own life lessons through a simple and intuitive editor. Lessons can be discovered using advanced search, category filters, emotional tone filters, and multiple sorting options such as newest, oldest, most liked, and most saved.

Community interaction is a core focus. Users can like lessons, save them as favorites, and leave comments. Premium lessons are available exclusively for subscribed members, adding value to the paid plan. A reporting system allows users to flag inappropriate content for admin review.

# 💳 Membership & Payments

The platform offers both Free and Premium access levels. Premium users unlock exclusive content and additional benefits. Secure payment processing is handled through Stripe, ensuring a safe and reliable upgrade experience.

# 🛠️ Admin Dashboard & Controls

Administrators have access to a powerful control panel where they can manage users, assign admin roles, and ban accounts if necessary. All lessons are visible for moderation, including reported content. A visual analytics dashboard displays key statistics such as total users, lessons, and revenue.

# 🧑‍💻 Technologies Used

Frontend Stack

The frontend is built with React.js for a component-based architecture and Tailwind CSS for fast, consistent styling. DaisyUI enhances UI components, while React Router enables smooth client-side navigation. Server state and API calls are managed efficiently using TanStack Query and Axios. Animations are handled with Framer Motion and AOS, and dashboards use Recharts for clean data visualization.

# Backend & Services

The backend follows a RESTful architecture using Node.js and Express.js, with MongoDB as the database. Firebase Authentication is used for secure user management, and Stripe API handles payment processing.

# ⚙️ Local Setup Guide

Follow the steps below to run the project locally.

Prerequisites

You’ll need Node.js (version 16 or higher), npm or yarn, a MongoDB database, Firebase project credentials, and a Stripe account.

Installation Steps

# Clone the repository

git clone https://github.com/your-username/digital-life-lessons-client.git
cd digital-life-lessons-client

Install dependencies

npm install

Configure environment variables

Create a .env.local file in the root directory and add the following:

apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
appId: import.meta.env.VITE_FIREBASE_APP_ID,

VITE_API_URL=http://localhost:5001/api

VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key

Run the development server

npm run dev

The app will run at:
👉 http://localhost:5174

🙌 Final Notes

This project was developed to demonstrate modern React development practices, secure authentication flows, role-based access control, and real-world payment integration. It reflects a strong focus on user experience, clean UI design, and scalable architecture.

Big respect to the open-source community for the tools and libraries that made this project possible. 🚀
