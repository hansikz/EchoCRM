# EchoCRM
EchoCRM is a modern, AI-powered customer relationship management platform designed to amplify customer satisfaction and optimize campaign delivery. With real-time insights, gamified journeys, campaign management, and AI-generated suggestions, EchoCRM ensures no customer feedback ever goes unheard.

## Features
###User Authentication: 
Secure login using Google OAuth 2.0.

###Data Ingestion: 
REST APIs to bring in customer and order data, processed asynchronously with RabbitMQ.

###Audience Segmentation: 
Build dynamic customer segments using AND/OR logic based on spending, visits, activity, and tags, with real-time audience size previews.

###Campaign Management: 
Create campaigns with personalized messages and track delivery stats in a dedicated history page.

###Personalized Delivery: 
Simulated message sending with delivery status updates (Sent, Failed, Delivered) via callbacks.

##AI-Powered Tools:

AI-generated message and subject line suggestions.

AI-driven insights for campaign performance.

Quick segment creation from natural language input.

Engaging User Experience: Dashboard CRM tips, achievement milestones, and a subscription model UI (Free and Pro tiers).

Modern UI: Built with Tailwind CSS and a custom color palette for a clean look.

##Architecture Overview
scss
Copy
Edit
User ↔ Frontend (Next.js)
       ↕
Backend (Node.js + Express)
       ↕
MongoDB, RabbitMQ, AI Service (OpenAI)
Frontend handles user interactions.

Backend exposes REST APIs, manages authentication, processes messages via RabbitMQ, and integrates AI services.

MongoDB stores customer, campaign, and segment data.

RabbitMQ manages asynchronous processing.

AI services generate smart suggestions and insights.

##Tech Stack
Frontend: Next.js, React.js, Tailwind CSS, Axios

Backend: Node.js, Express.js, Mongoose (MongoDB)

Database: MongoDB

Authentication: Passport.js (Google OAuth 2.0, JWT)

Messaging Queue: RabbitMQ

AI Integration: OpenAI API (GPT models)

Dev Tools: Docker, Nodemon, Git, VS Code

Getting Started
Prerequisites
Node.js (v18 or newer)

Docker Desktop (running)

Git

Setup
Clone the repo

bash
Copy
Edit
git clone https://github.com/YOUR_USERNAME/EchoCRM.git
cd EchoCRM
Start MongoDB and RabbitMQ with Docker

bash
Copy
Edit
docker-compose up -d
Backend Setup

bash
Copy
Edit
cd backend
cp .env.example .env
# Fill in your credentials in the .env file
npm install
npm run dev
Frontend Setup

bash
Copy
Edit
cd ../frontend
# Create .env.local with API URL if needed
npm install
npm run dev
Open your browser

Go to http://localhost:3000 to start using EchoCRM.

##AI Features Summary
Generates campaign message variants.

Suggests email subject lines.

Provides campaign performance insights.

Requires OpenAI API key for real AI responses; otherwise, mocks data.

##Known Limitations
Campaign messages are simulated — no real emails or SMS sent.

Subscription plans are UI placeholders; no payment integration yet.

Basic error handling and security; needs enhancements for production.

Scalability considerations are minimal — designed for demo and development.

Achievements system is conceptual and limited.

##Future Enhancements
Real payment integration (e.g., Stripe).

Actual email/SMS delivery services (e.g., SendGrid, Twilio).

Advanced analytics and reporting dashboards.

Predictive AI-powered customer insights.

Role-based access controls.

A/B testing for campaigns.

Full customer communication history.

Campaign templates and team collaboration features.
