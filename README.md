# API with Node.js + PostgreSQL + Redis + TypeORM: JWT Authentication

This implement JSON Web Token (JWT) Authentication with Node.js, PostgreSQL,
TypeORM, ExpressJs, Redis, Docker, and Docker-compose. We will implement the
assymetric (RS256 algorithm) JSON Web Token authentication manually without
using any Node.js authentication library like PassportJs.

![API with Node.js + PostgreSQL + TypeORM: JWT Authentication](https://res.cloudinary.com/dyxgn1seq/image/upload/v1686494333/github/express_typeorm_ljnc1s.webp)

## Topics Covered

-  List the Node.js API Routes
-  User Login and Register Flow with JWT Authentication
-  Defining Base and User Entities with TypeORM
-  Defining Zod Schemas to Validate Request Body
-  Create Middleware to Parse Zod Schema
-  Password Management with Bcrypt
-  Create Services to Interact with the Database
-  Asymmetric Encryption (RS256 algorithm) Json Web Tokens
-  Service to Sign Access and Refresh Tokens
-  Error Handling in Express
-  Create Authentication Route Controllers
-  Create User Route Controller
-  Create Authentication Middleware Guard
-  Create the API Routes
   -  Authentication Routes
   -  User Routes
-  Add the Routes to the Express Middleware Stack
-  Run Database Migrations with TypeORM
-  Inspect the Data with VS Code MySQL Extension

Steps to run this project:

1. Run `yarn` command
2. Setup database settings inside `src/utils/data-source.ts` file
3. Run `yarn start` command
