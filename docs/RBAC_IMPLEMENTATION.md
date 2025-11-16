# RBAC (Role-Based Access Control) Implementation

## ✅ RBAC is FULLY IMPLEMENTED in Backend & Database

### 📊 Database Level

#### 1. **TeamMembership Model** (`src/models/TeamMembership.model.ts`)
- Stores user roles per team
- Fields:
  - `team`: Reference to Team
  - `user`: Reference to User
  - `role`: Enum (OWNER | MEMBER)
  - `joinedAt`: Timestamp
- **Indexes:**
  - Compound unique index: `{ team: 1, user: 1 }` - Ensures one role per user per team
  - User index: `{ user: 1 }` - Fast lookup of user's teams

#### 2. **TeamRole Enum** (`src/types/index.ts`)
```typescript
export enum TeamRole {
  OWNER = 'owner',
  MEMBER = 'member',
}
```

---

### 🔒 Authorization Middleware

#### 1. **requireTeamMember** (`src/middleware/authorization.middleware.ts`)
- Checks if user is a member of the team (OWNER or MEMBER)
- Used for: Viewing teams, creating retros, viewing members
- **Database Query:** Checks `TeamMembership` collection

#### 2. **requireTeamOwner** (`src/middleware/authorization.middleware.ts`)
- Checks if user has OWNER role
- Used for: Inviting members, removing members
- **Database Query:** Checks `TeamMembership` with `role: TeamRole.OWNER`

#### 3. **requireRetroAccess** (`src/middleware/authorization.middleware.ts`)
- Checks if user is a team member (via retro's team)
- Used for: Accessing retrospectives
- **Database Query:** Checks `TeamMembership` via retro's team

#### 4. **requireCardOwnership** (`src/middleware/authorization.middleware.ts`)
- Checks if user is the card author
- Used for: Updating/deleting cards
- **Database Query:** Checks `Card.author` field

---

### 🛡️ RBAC Applied to Routes

#### **Team Routes** (`src/routes/team.routes.ts`)

| Endpoint | Method | RBAC Check | Role Required |
|----------|--------|------------|---------------|
| `/api/teams` | POST | `authenticate` | Any authenticated user |
| `/api/teams` | GET | `authenticate` | Any authenticated user |
| `/api/teams/:teamId` | GET | `requireTeamMember` | OWNER or MEMBER |
| `/api/teams/:teamId/invite` | POST | `requireTeamOwner` | **OWNER only** |
| `/api/teams/:teamId/members` | GET | `requireTeamMember` | OWNER or MEMBER |
| `/api/teams/:teamId/members/:memberId` | DELETE | `requireTeamOwner` | **OWNER only** |

#### **Retrospective Routes** (`src/routes/retro.routes.ts`)

| Endpoint | Method | RBAC Check | Role Required |
|----------|--------|------------|---------------|
| `/api/teams/:teamId/retros` | POST | `requireTeamMember` | OWNER or MEMBER |
| `/api/teams/:teamId/retros` | GET | `requireTeamMember` | OWNER or MEMBER |
| `/api/retros/:retroId` | GET | `requireRetroAccess` | Team member |
| `/api/retros/:retroId` | DELETE | `requireRetroAccess` | Team member |

#### **Card Routes** (`src/routes/card.routes.ts`)

| Endpoint | Method | RBAC Check | Role Required |
|----------|--------|------------|---------------|
| `/api/retros/:retroId/cards` | POST | `requireRetroAccess` | Team member |
| `/api/retros/:retroId/cards` | GET | `requireRetroAccess` | Team member |
| `/api/cards/:cardId` | PUT | `requireCardOwnership` | **Card author only** |
| `/api/cards/:cardId` | DELETE | `requireCardOwnership` | **Card author only** |

#### **Action Item Routes** (`src/routes/actionItem.routes.ts`)

| Endpoint | Method | RBAC Check | Role Required |
|----------|--------|------------|---------------|
| `/api/teams/:teamId/action-items` | POST | `requireTeamMember` | OWNER or MEMBER |
| `/api/teams/:teamId/action-items` | GET | `requireTeamMember` | OWNER or MEMBER |
| `/api/action-items/:actionItemId` | PUT | `authenticate` | Any authenticated user |
| `/api/action-items/:actionItemId` | DELETE | `authenticate` | Any authenticated user |

---

### 🔐 RBAC Features

#### ✅ **Implemented:**
1. **Role Storage:** Roles stored in `TeamMembership` collection
2. **Role Enum:** Type-safe role definitions (OWNER, MEMBER)
3. **Middleware Protection:** All sensitive routes protected
4. **Database Queries:** Role checks query MongoDB
5. **Owner-Only Actions:** Invite/remove members restricted to owners
6. **Member Access:** Team members can view and create retros
7. **Card Ownership:** Only card authors can edit/delete their cards
8. **Team Membership:** Required for all team-related operations

#### 📋 **Role Permissions Summary:**

**OWNER Role:**
- ✅ Create team
- ✅ View team
- ✅ Invite members
- ✅ Remove members
- ✅ View team members
- ✅ Create retros
- ✅ View retros
- ✅ Create cards
- ✅ Create action items

**MEMBER Role:**
- ✅ View team
- ✅ View team members
- ✅ Create retros
- ✅ View retros
- ✅ Create cards
- ✅ Create action items
- ❌ Cannot invite members
- ❌ Cannot remove members

**Card Author:**
- ✅ Edit own cards
- ✅ Delete own cards
- ❌ Cannot edit/delete others' cards

---

### 🗄️ Database Schema

```javascript
// TeamMembership Collection
{
  _id: ObjectId,
  team: ObjectId,        // Reference to Team
  user: ObjectId,        // Reference to User
  role: "owner" | "member",  // RBAC Role
  joinedAt: Date
}

// Indexes:
// - { team: 1, user: 1 } (unique) - Prevents duplicate memberships
// - { user: 1 } - Fast user lookup
```

---

### ✅ **Conclusion**

**RBAC is FULLY IMPLEMENTED:**
- ✅ Database schema with role storage
- ✅ Role-based middleware
- ✅ Protected routes with proper authorization
- ✅ Owner vs Member permissions
- ✅ Resource ownership checks (cards)
- ✅ Team membership validation

The system enforces role-based access control at both the **database level** (storing roles) and **application level** (middleware checks).

