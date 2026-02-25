# PawConnect Backend

Backend REST API powering PawConnect, a platform designed to help citizens report lost or found animals and enable authorities to manage and respond efficiently.

This project demonstrates secure authentication, and scalable backend design using Node.js and MongoDB.

PawConnect aims to:
	•	Allow citizens to report lost or found animals
	•	Enable agents to manage reports efficiently
	•	Provide real-time notification tracking
	•	Securely manage media uploads
	•	Enforce role-based access control

This backend was built with a strong focus on modularity, security, and maintainability.

## Architecture

backend/
  controllers/     # HTTP layer
  services/        # Business logic
  repositories/    # Data access abstraction
  models/          # Mongoose schemas
  middlewares/     # Auth, validation, error handling
  routes/          # Route definitions
  errors/          # Centralized error system

## Authentification & Authorization

  •	JWT-based authentication
	•	Role-based access control (civil, agent)
	•	Secure route protection via middleware
	•	Establishment-scoped access for agents

Protected routes require : 
  Authorization: Bearer <token>

JWT payload contains:
  • userId
  • role
  • establishmentId (for agents)

## Features

Animal Reports
  • Create a report (citizen)
  • Update report status (agent)
  • Upload report photo
  • Retrieve personal reports

Notifications
  • Get user notifications
  • Mark one as read
  • Mark all as read

Establishments
  • Create establishment
  • Retrieve establishment list

Secure Media Upload
  • Cloudinary signed upload endpoint

## Technical Stack
  • Node.js
  • Express
  • MongoDB + Mongoose
  • JWT
  • Cloudinary
  • express-rate-limit
  • Jest / Supertest

## Standardized Error Format

All business errors follow a unified structure:
{
  "error": "INVALID_INPUT",
  "message": "Validation failed",
  "details": []
}

This ensures consistency between backend and frontend error handling.

## Testing

Testing is implemented with:
  • Jest
  • Supertest

Run manually:
  npx jest

## What This Project Demonstrates

  • Clean backend architecture
	•	Secure authentication flow
	•	Role-based authorization
	•	RESTful API design
	•	MongoDB data modeling
	•	Error normalization strategy
	•	Production-oriented middleware configuration

## Author

PawConnect was developed in 2 weeks as part of the La Capsule bootcamp.

The goal was to design and deliver a complete frontend + backend application within a strict two-week deadline, achieving a production-ready MVP.

Developed by a team of 5 using GitHub and agile practices (feature branching, collaborative development), the project reflects real-world delivery constraints and modular backend architecture principles.
