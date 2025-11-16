# Complete Backend API Endpoints

## ✅ All APIs Implemented - Total: 22 Endpoints

### 🔐 Authentication APIs (3 endpoints)
**Base: `/api/auth`**

1. **POST** `/api/auth/register`
   - Register a new user
   - Body: `{ name, email, password }`
   - Returns: `{ token, user }`

2. **POST** `/api/auth/login`
   - Login user
   - Body: `{ email, password }`
   - Returns: `{ token, user }`

3. **GET** `/api/auth/me`
   - Get current user info
   - Headers: `Authorization: Bearer <token>`
   - Returns: `{ user }`

---

### 👥 Team APIs (7 endpoints)
**Base: `/api/teams`** (All require authentication)

1. **POST** `/api/teams`
   - Create a new team
   - Body: `{ name, description? }`
   - Returns: `{ team }`

2. **GET** `/api/teams`
   - Get all teams for current user
   - Returns: `{ teams }`

3. **GET** `/api/teams/:teamId`
   - Get team by ID (requires team membership)
   - Returns: `{ team }`

4. **PUT** `/api/teams/:teamId`
   - Update team name/description (requires team owner)
   - Body: `{ name?, description? }`
   - Returns: `{ team }`

5. **POST** `/api/teams/:teamId/invite`
   - Invite member to team (requires team owner)
   - Body: `{ email, role? }`
   - Returns: `{ membership }`

6. **GET** `/api/teams/:teamId/members`
   - Get all team members (requires team membership)
   - Returns: `{ members }`

7. **DELETE** `/api/teams/:teamId/members/:memberId`
   - Remove member from team (requires team owner)
   - Returns: `{ message: "Member removed" }`

---

### 📋 Retrospective APIs (4 endpoints)
**Base: `/api`** (All require authentication)

1. **POST** `/api/teams/:teamId/retros`
   - Create a new retrospective (requires team membership)
   - Body: `{ name, sprintNumber?, startDate?, endDate? }`
   - Returns: `{ retro }`

2. **GET** `/api/teams/:teamId/retros`
   - Get all retros for a team (requires team membership)
   - Query params: `?search=&startDate=&endDate=`
   - Returns: `{ retros }` (with card counts)

3. **GET** `/api/retros/:retroId`
   - Get retro by ID (requires retro access)
   - Returns: `{ retro }`

4. **DELETE** `/api/retros/:retroId`
   - Delete retrospective (requires retro access)
   - Returns: `{ message: "Retrospective deleted" }`

---

### 🃏 Card APIs (4 endpoints)
**Base: `/api`** (All require authentication)

1. **POST** `/api/retros/:retroId/cards`
   - Create a new card (requires retro access)
   - Body: `{ type, content }`
   - Returns: `{ card }`

2. **GET** `/api/retros/:retroId/cards`
   - Get all cards for a retro (requires retro access)
   - Query params: `?includeDeleted=false`
   - Returns: `{ cards }`

3. **PUT** `/api/cards/:cardId`
   - Update card (requires card ownership)
   - Body: `{ content }`
   - Returns: `{ card }`

4. **DELETE** `/api/cards/:cardId`
   - Soft delete card (requires card ownership)
   - Returns: `{ message: "Card deleted" }`

---

### ✅ Action Item APIs (4 endpoints)
**Base: `/api`** (All require authentication)

1. **POST** `/api/teams/:teamId/action-items`
   - Create action item (requires team membership)
   - Body: `{ retroId, title, description?, assignedTo? }`
   - Returns: `{ actionItem }`

2. **GET** `/api/teams/:teamId/action-items`
   - Get all action items for a team (requires team membership)
   - Query params: `?status=&retroId=&search=`
   - Returns: `{ actionItems }`

3. **PUT** `/api/action-items/:actionItemId`
   - Update action item
   - Body: `{ title?, description?, status?, assignedTo? }`
   - Returns: `{ actionItem }`

4. **DELETE** `/api/action-items/:actionItemId`
   - Delete action item
   - Returns: `{ message: "Action item deleted" }`

---

### 🏥 Health Check (1 endpoint)

1. **GET** `/health`
   - Server health check
   - Returns: `{ status: "ok", timestamp }`

---

## 📊 Summary

- **Total Endpoints**: 23
- **Authentication**: 3 endpoints
- **Teams**: 7 endpoints
- **Retrospectives**: 4 endpoints
- **Cards**: 4 endpoints
- **Action Items**: 4 endpoints
- **Health Check**: 1 endpoint

## 🔒 Security Features

✅ JWT-based authentication
✅ Role-based authorization (Owner/Member)
✅ Team membership validation
✅ Retro access control
✅ Card ownership verification
✅ All routes protected except `/health` and auth endpoints

## ✅ Implementation Status

All APIs are **fully implemented** and ready to use!

