# Team Retrospective & Action Tracker - Backend API

A RESTful API backend for managing team retrospectives, action items, and team collaboration. Built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

- JWT-based authentication with profile management
- Team management with roles (Owner/Member) and descriptions
- Retrospective sessions with 3-column board (Went Well, Needs Improvement, Kudos)
- Card management with soft delete and voting support
- Action items tracking with status management
- Pagination support for retrospectives
- Comprehensive testing suite

## 🎥 Demo

Watch the demo videos to see the application in action:

1. **Demo Video 1**: [https://www.loom.com/share/2250694abbf14798a339ab5641cf7332](https://www.loom.com/share/2250694abbf14798a339ab5641cf7332)

2. **Demo Video 2**: [https://www.loom.com/share/6f0eef69ab424d5ca2fd3ee8973e092c](https://www.loom.com/share/6f0eef69ab424d5ca2fd3ee8973e092c)

## 📦 Tech Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT for authentication
- Jest + Supertest for testing

## 📌 Note

This is the **backend API** repository. The frontend application should be in a separate repository and connect to this API at `http://localhost:5000/api`.

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create `.env` file:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/retro-tracker
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/retro-tracker?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
# In development, multiple origins are allowed (5173, 5174, 3000, 3001)
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Run Tests

```bash
npm test
```

## 📚 API Documentation

### Authentication

#### Register

- **POST** `/api/auth/register`
- Body: `{ name, email, password }`
- Returns: `{ token, user }`

#### Login

- **POST** `/api/auth/login`
- Body: `{ email, password }`
- Returns: `{ token, user }`

#### Get Current User

- **GET** `/api/auth/me`
- Headers: `Authorization: Bearer <token>`
- Returns: `{ user }`

#### Update Profile

- **PUT** `/api/auth/profile`
- Headers: `Authorization: Bearer <token>`
- Body: `{ name?, email?, password? }`
- Returns: `{ user }`

### Teams

#### Create Team

- **POST** `/api/teams`
- Headers: `Authorization: Bearer <token>`
- Body: `{ name, description? }`
- Returns: `{ team }`

#### Get User Teams

- **GET** `/api/teams`
- Headers: `Authorization: Bearer <token>`
- Returns: `{ teams }`

#### Get Team by ID

- **GET** `/api/teams/:teamId`
- Headers: `Authorization: Bearer <token>`
- Returns: `{ team }`

#### Update Team (Rename)

- **PUT** `/api/teams/:teamId`
- Headers: `Authorization: Bearer <token>` (Team Owner only)
- Body: `{ name?, description? }`
- Returns: `{ team }`

#### Invite Member

- **POST** `/api/teams/:teamId/invite`
- Headers: `Authorization: Bearer <token>` (Team Owner only)
- Body: `{ email, role? }` (role: `admin` maps to `owner`, `member` is default)
- Returns: `{ membership }`

#### Get Team Members

- **GET** `/api/teams/:teamId/members`
- Headers: `Authorization: Bearer <token>`
- Returns: `{ members }` (roles transformed: `owner` → `admin` for frontend compatibility)

#### Remove Member

- **DELETE** `/api/teams/:teamId/members/:memberId`
- Headers: `Authorization: Bearer <token>` (Team Owner only)
- Returns: `{ message: "Member removed" }`

### Retrospectives

#### Create Retro

- **POST** `/api/teams/:teamId/retros`
- Headers: `Authorization: Bearer <token>`
- Body: `{ name, sprintNumber?, startDate?, endDate? }`
- Returns: `{ retro }` (with populated `createdBy` field)

#### Get Team Retros

- **GET** `/api/teams/:teamId/retros?search=&startDate=&endDate=&page=&limit=`
- Headers: `Authorization: Bearer <token>`
- Returns: `{ items, total, page, limit }` (paginated response with card counts)

#### Get Retro Details

- **GET** `/api/retros/:retroId`
- Headers: `Authorization: Bearer <token>`
- Returns: `{ retro }`

#### Delete Retro

- **DELETE** `/api/retros/:retroId`
- Headers: `Authorization: Bearer <token>`
- Returns: `{ message: "Retrospective deleted" }`

### Cards

#### Create Card

- **POST** `/api/retros/:retroId/cards`
- Headers: `Authorization: Bearer <token>`
- Body: `{ type, content }`
- Returns: `{ card }`

#### Get Retro Cards

- **GET** `/api/retros/:retroId/cards?includeDeleted=false`
- Headers: `Authorization: Bearer <token>`
- Returns: `{ cards }` (with `authorName` and `author` fields)

#### Update Card

- **PUT** `/api/cards/:cardId`
- Headers: `Authorization: Bearer <token>` (Card Owner only)
- Body: `{ content?, votes? }`
- Returns: `{ card }`

#### Delete Card (Soft Delete)

- **DELETE** `/api/cards/:cardId`
- Headers: `Authorization: Bearer <token>` (Card Owner only)
- Returns: `{ message: "Card deleted" }`

### Action Items

#### Create Action Item

- **POST** `/api/teams/:teamId/action-items`
- Headers: `Authorization: Bearer <token>`
- Body: `{ retroId, title, description?, assignedTo? }`
- Returns: `{ actionItem }`

#### Get Team Action Items

- **GET** `/api/teams/:teamId/action-items?status=&retroId=&search=`
- Headers: `Authorization: Bearer <token>`
- Returns: `{ actionItems }` (filtered by status, retroId, or search term)

#### Update Action Item

- **PUT** `/api/action-items/:actionItemId`
- Headers: `Authorization: Bearer <token>`
- Body: `{ title?, description?, status?, assignedTo? }`
- Returns: `{ actionItem }`

#### Delete Action Item

- **DELETE** `/api/action-items/:actionItemId`
- Headers: `Authorization: Bearer <token>`
- Returns: `{ message: "Action item deleted" }`

## 📋 Response Format

All API responses follow a standard format:

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

## 🏗️ Project Structure

```
src/
├── config/          # Configuration (DB, env, logger)
├── controllers/     # Request handlers
├── middleware/      # Auth, authorization, error handling
├── models/          # Mongoose models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
├── types/           # TypeScript types
├── tests/           # Test files
├── app.ts           # Express app setup
└── server.ts         # Server entry point
```

## 🧪 Testing

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Docker

#### Production Build

Build and run the production Docker image:

```bash
# Build the image
docker build -t retro-tracker-backend .

# Run the container
docker run -p 5000:5000 \
  -e MONGODB_URI=your_mongodb_uri \
  -e JWT_SECRET=your_jwt_secret \
  -e CORS_ORIGIN=http://localhost:5173 \
  retro-tracker-backend
```

#### Docker Compose (Production)

Run the entire stack (backend + MongoDB) with Docker Compose:

```bash
# Create .env file with your environment variables
cp .env.example .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

#### Docker Compose (Development)

For development with hot reload:

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# The backend will auto-reload on code changes
```

#### Docker Features

- **Multi-stage build** for optimized production image
- **Non-root user** for security
- **Health checks** for container monitoring
- **Volume persistence** for MongoDB data
- **Hot reload** support in development mode

## 🏛️ Architecture & Design Decisions

### Data Modeling

**TeamMembership as Separate Collection:**
- Chose to model team memberships as a separate collection rather than embedding in Team
- **Rationale:** 
  - Allows efficient queries for "user's teams" and "team's members"
  - Easier to manage role changes and membership history
  - Better for many-to-many relationships
  - Enables compound indexes for uniqueness and fast lookups

**Soft Delete for Cards:**
- Cards are marked as `isDeleted: true` rather than physically deleted
- **Rationale:**
  - Preserves data integrity and audit trail
  - Allows "Show deleted" toggle in UI
  - Enables recovery if needed
  - Better for analytics and historical data

### API Design

**RESTful Structure:**
- Clear separation: `/api/auth/*`, `/api/teams/*`, `/api/retros/*`, `/api/cards/*`, `/api/action-items/*`
- Nested resources where logical (e.g., `/api/teams/:teamId/retros`)
- Consistent response format with `success`, `data`, and `message` fields

**Pagination:**
- Implemented for retrospectives list (`page`, `limit` query params)
- **Rationale:** Better performance for teams with many retros, standard REST practice

### Security

**JWT Authentication:**
- Token-based auth with 7-day expiration
- Stored in Authorization header (Bearer token)
- No refresh tokens (simplified for MVP)

**Role-Based Access Control (RBAC):**
- Two roles: `OWNER` and `MEMBER`
- Middleware-based authorization checks
- Owner-only actions: invite members, remove members, rename team
- Card ownership: Only authors can edit/delete their cards

### Code Organization

**Layered Architecture:**
- **Routes:** Define endpoints and middleware
- **Controllers:** Handle HTTP requests/responses
- **Services:** Business logic and data operations
- **Models:** Database schemas and validation
- **Middleware:** Authentication, authorization, error handling

**Separation of Concerns:**
- Business logic separated from HTTP handling
- Reusable service functions
- Centralized error handling
- Type-safe with TypeScript

## ✅ Implemented Features

### Core Features (100% Complete)
- ✅ User authentication (register, login, profile management)
- ✅ Team management (create, invite, rename, remove members)
- ✅ Retrospective sessions (create, list, search, filter, pagination)
- ✅ Retro board with 3 columns (Went Well, Needs Improvement, Kudos)
- ✅ Card management (create, edit, soft delete, voting)
- ✅ Action items (create, update, filter, search)
- ✅ Role-based access control (Owner/Member)
- ✅ Authorization middleware for all protected routes

### Additional Features (Beyond Requirements)
- ✅ Profile update endpoint
- ✅ Team descriptions
- ✅ Card voting support
- ✅ Pagination for retrospectives
- ✅ Text search for retros and action items
- ✅ Date range filtering for retros

## ⚠️ Known Limitations

1. **No Email Notifications:**
   - Team invitations are created but no actual emails are sent
   - Users must be manually informed about invitations

2. **No Refresh Tokens:**
   - JWT tokens expire after 7 days
   - Users must re-login after expiration
   - No automatic token refresh mechanism

3. **No Real-time Updates:**
   - No WebSocket/SSE support
   - Frontend must poll or manually refresh for updates

4. **Limited Test Coverage:**
   - Tests cover authentication and retro creation
   - Additional tests for cards, action items, and edge cases would improve coverage

5. **No File Uploads:**
   - Avatar images are generated from initials only
   - No support for custom avatar uploads

6. **No Team Deletion:**
   - Teams can be created but not deleted
   - Only members can be removed

## 🔄 Assumptions & Trade-offs

### Assumptions

1. **Frontend Handles State:**
   - Assumes frontend manages team selection and UI state
   - Backend provides stateless API only

2. **Email Uniqueness:**
   - Assumes email addresses are unique identifiers
   - No support for multiple accounts per email

3. **Team Invitations:**
   - Invitations are created immediately (no pending state)
   - Assumes user exists in system before invitation

4. **Card Types:**
   - Three fixed card types (went_well, needs_improvement, kudos)
   - No custom card types or categories

### Trade-offs

1. **TeamMembership vs Embedded:**
   - **Chose:** Separate collection
   - **Trade-off:** Extra query for membership checks, but better scalability

2. **Soft Delete vs Hard Delete:**
   - **Chose:** Soft delete for cards
   - **Trade-off:** Slightly more complex queries, but preserves data

3. **Pagination:**
   - **Chose:** Server-side pagination for retros
   - **Trade-off:** More API calls, but better performance for large datasets

4. **JWT vs Session:**
   - **Chose:** Stateless JWT tokens
   - **Trade-off:** No server-side session management, but easier horizontal scaling

5. **TypeScript Strict Mode:**
   - **Chose:** TypeScript for type safety
   - **Trade-off:** More verbose code, but better maintainability and fewer runtime errors

## 📝 License

MIT

