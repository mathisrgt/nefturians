# Nefturians Project 🚀

Welcome to my Nefturians app, a Next.js application with NextUI, a MySQL database and TypeScript!

## Table of Contents 📋

- [Getting Started](#getting-started-rocket)
- [Project Structure](#project-structure-file_folder)
- [Database Setup](#database-setup-database)
- [API Routes](#api-routes-api)
- [Demo](#demo)

## Getting Started 🚀

To get started with this project, follow these steps:

1. Clone this repository: `git clone https://github.com/mathisrgt/nefturians.git`
2. Install dependencies: `npm install`
3. Create a MySQL database and use the SQL script below.
4. Start the development server: `npm run dev`

## Database Setup 🏢

Make sure to set up a MySQL database and update the `.env` file with the correct database connection details. You can use the migrations to create the necessary tables.

```sql
CREATE DATABASE nefturians_db;

USE nefturians_db;

CREATE TABLE NefturianSides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nefturianIndex INT NOT NULL UNIQUE,
    side INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Routes 🌐
This app uses the following API routes:

- POST /api/index: Retrieves or creates a Nefturian index based on the provided Ethereum address.

- POST /api/side: Creates a new Nefturian record with the specified Nefturian index and side number.

- GET /api/side/:nefturianIndex: Retrieves the Nefturian side number for a given Nefturian index.

- POST /api/setside/:nefturianIndex/:side: Updates the Nefturian side number for a given Nefturian index.

## Technologies Used
- Next.js
- TypeScript
- Express.js
- MySQL
- Next UI (for UI components)
- Crypto (for generating Nefturian indices)
- dotenv (for managing environment variables)

## Demo 👾

<video width="320" height="240" controls>
  <source src="nefturians_demo.mov" type="video/mov">
  Your browser does not support the video tag.
</video>
