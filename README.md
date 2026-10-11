# 🩸 Blood Donor Finder (HemoPulse)
### College Web Technology Lab (WTL) End-Semester Full-Stack Project

> **A real-time, responsive full-stack web application connecting voluntary blood donors with hospitals, emergency seekers, and medical centers in critical scenarios.**

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack & Syllabus Mapping](#technology-stack--syllabus-mapping)
3. [Folder Structure](#folder-structure)
4. [Core Features & User Flows](#core-features--user-flows)
5. [Database Schemas (Mongoose / MongoDB)](#database-schemas-mongoose--mongodb)
6. [REST API Documentation](#rest-api-documentation)
7. [Installation & Execution Guide](#installation--execution-guide)
8. [Demo Credentials](#demo-credentials)
9. [Viva Voce Questions & Answers (WTL Preparation)](#viva-voce-questions--answers-wtl-preparation)

---

## 1. Project Overview

**Blood Donor Finder (HemoPulse)** is an academic Web Technology Lab project designed to solve blood requisition friction during critical clinical emergencies. The system enables:
- Voluntary donors to register their blood group, location, and availability.
- Hospital attendants and seekers to locate compatible donors within seconds filtered by **Blood Group** and **City**.
- Healthcare coordinators to broadcast emergency blood requisitions onto a real-time SOS ticker.
- Administrators to manage donor records, toggle real-time donation availability, and track fulfillment metrics.

The visual design is built with the **Vital Red** clinical design system from Stitch, emphasizing scannability, urgent clarity, and emotional reassurance.

---

## 2. Technology Stack & Syllabus Mapping

| Layer | Technologies Used | Academic Concepts Demonstrated |
| :--- | :--- | :--- |
| **Frontend Structure** | HTML5 Semantic Elements | `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, semantic form inputs, custom data attributes |
| **Frontend Styling** | CSS3 & Custom Tailwind Palette | CSS custom variables (`:root`), Flexbox, CSS Grid, smooth transitions, responsive breakpoints (`sm`, `md`, `lg`, `xl`), frosted glass (`backdrop-blur`), ping pulse animations |
| **Frontend Logic** | Vanilla JavaScript (ES6+) | `async/await`, Fetch API, DOM manipulation, URLSearchParams parsing, client-side input validation, dynamic modal creation, event delegation, `localStorage` JWT session handling |
| **Backend Runtime** | Node.js (v20+ / v24+) | Non-blocking asynchronous I/O, event-driven architecture, modular CommonJS exports |
| **Backend Framework** | Express.js (v4.21+) | REST API routing, custom middleware (logging, CORS, JSON parsing), centralized error handling, static file hosting |
| **Database & Modeling**| MongoDB & Mongoose ODM | Schema design, field type validation, enum constraints, compound indexes (`bloodGroup` + `city`), database seeding, resilient in-memory fallback store |
| **Security & Auth** | JWT (`jsonwebtoken`) & `bcryptjs` | Password salt hashing (10 rounds), stateless bearer token verification, role-based authorization (`admin`, `coordinator`, `user`) |

---

## 3. Folder Structure

```text
Blood-Donor-Finder/
│
├── frontend/
│   ├── index.html              # Home landing page: hero search, live SOS ticker, stats, 3 steps, compatibility guide
│   ├── find-donor.html         # Donor search engine: blood group & city filters, availability toggle, donor cards
│   ├── register.html           # Donor registration form: medical eligibility validation & virtual donor ID card
│   ├── request.html            # Blood requisition portal: reactive live broadcast preview & community demands feed
│   ├── login.html              # Authentication portal: sign in / register with 1-click evaluator demo accounts
│   ├── dashboard.html          # Admin & coordinator control center: donor CRUD, availability toggle, requests manager
│   ├── css/
│   │   └── style.css           # Vital Red design tokens, toast animations, modal styling, blood group badges
│   ├── js/
│   │   ├── main.js             # API base URL, session state, toast helpers, modal generator, SOS ticker loader
│   │   ├── donor.js            # Donor search engine, URL parameter parsing, donor card renderer, registration handler
│   │   └── request.js          # Requisition submission, live reactive preview card updater, feed loader
│   └── images/                 # Project assets and screenshots
│
├── backend/
│   ├── server.js               # Express application entrypoint, static file hosting, REST route mounting
│   ├── package.json            # Node.js dependencies and run scripts
│   ├── .env                    # Environment variables (PORT, MONGODB_URI, JWT_SECRET)
│   ├── db.js                   # Mongoose connection manager, auto-seeding, and resilient in-memory fallback
│   ├── models/
│   │   ├── Donor.js            # Mongoose schema for voluntary blood donors
│   │   ├── BloodRequest.js     # Mongoose schema for emergency blood requisitions
│   │   └── User.js             # Mongoose schema for users with bcrypt password hashing
│   ├── routes/
│   │   ├── donorRoutes.js      # REST API route endpoints for donors
│   │   ├── requestRoutes.js    # REST API route endpoints for blood requisitions
│   │   └── userRoutes.js       # REST API route endpoints for authentication
│   └── controllers/
│       ├── donorController.js  # CRUD, filtering by group/city, availability toggle, KPI stats
│       ├── requestController.js# Blood requisition creation, emergency feed, status updates
│       └── userController.js   # User registration, bcrypt comparison, JWT generation
│
├── docs/
│   ├── project-report.md       # Comprehensive academic lab report for viva submission
│   └── screenshots/            # Reference user interface captures
│
└── README.md                   # Complete project documentation and viva cheat sheet
```

---

## 4. Core Features & User Flows

### Flow 1: Register Donor → Stored in Database
1. User visits `register.html`.
2. Fills in donor profile (Full Name, Email, Phone, Age 18–65, Blood Group, City, District, Availability status, Last donation date).
3. Client performs front-end validation (age bounds, 10-digit phone, email syntax, mandatory consent checks).
4. Asynchronous `POST /api/donors` call is made with JSON payload.
5. Controller verifies uniqueness and schema rules, then persists the record in MongoDB.
6. A responsive **Virtual Donor ID Card** modal displays instantly with a confirmation badge.

### Flow 2: Search by Blood Group + City → Matching Donors
1. User enters criteria on `index.html` or `find-donor.html` (e.g., Blood Group: `O-`, City: `Pune`, Available Only: `true`).
2. Client queries `GET /api/donors?bloodGroup=O-&city=Pune&available=true`.
3. Server executes case-insensitive regex query on MongoDB with indexed fields.
4. Matching donor cards are dynamically rendered showing:
   - Blood type badge (crimson / teal / amber).
   - Availability pill (green pulsating dot if available, gray if resting).
   - Direct `tel:` link to initiate an immediate phone call.
   - Profile modal detailing donation history and eligibility.

### Flow 3: Create Blood Requisition → Live Broadcast Feed
1. Seeker visits `request.html`.
2. Fills in Patient Name, Hospital Name, Ward/Dept, City, Blood Group, Units needed, Urgency (`Critical` < 2 hrs, `Urgent` < 12 hrs, `Standard`), Contact Person, Phone, and Medical Reason.
3. The **Interactive Live Requisition Preview Card** updates in real-time as the user types.
4. Submitting triggers `POST /api/requests`. The new document is stored with status `Pending`.
5. The request immediately appears in the **Live SOS Ticker** at the top of every page and in the **Spotlight Feed** on the homepage.

### Flow 4: Manage Availability & Admin Dashboard
1. Administrator signs in at `login.html` (using pre-filled demo account `admin@hemopulse.org`).
2. Central Dashboard displays real-time KPI metrics: Total Donors, Available Ready, Active Requisitions, Fulfilled Units.
3. **1-Click Availability Toggle:** Clicking the status button triggers `PATCH /api/donors/:id/availability`. The server flips `isAvailable` without reloading the page.
4. **Donor Management:** Edit donor information (`PUT /api/donors/:id`) or delete record (`DELETE /api/donors/:id`).
5. **Requisition Management:** Update status from `Pending` → `In Progress` → `Fulfilled` via dropdown selector.
6. **Viva Voce Inspector Tab:** Interactive architectural diagram and API cheat sheet for student presentation during examination.

---

## 5. Database Schemas (Mongoose / MongoDB)

### Donor Schema (`models/Donor.js`)
```javascript
const donorSchema = new mongoose.Schema({
  name:             { type: String, required: true, trim: true },
  email:            { type: String, required: true, lowercase: true, trim: true },
  phone:            { type: String, required: true, trim: true },
  bloodGroup:       { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  city:             { type: String, required: true, trim: true },
  state:            { type: String, default: 'Maharashtra' },
  district:         { type: String, default: '' },
  age:              { type: Number, required: true, min: 18, max: 65 },
  gender:           { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
  isAvailable:      { type: Boolean, default: true },
  lastDonationDate: { type: Date, default: null },
  totalDonations:   { type: Number, default: 1 },
  notes:            { type: String, default: '' },
  createdAt:        { type: Date, default: Date.now }
});

donorSchema.index({ bloodGroup: 1, city: 1 });
donorSchema.index({ isAvailable: 1 });
```

### BloodRequest Schema (`models/BloodRequest.js`)
```javascript
const bloodRequestSchema = new mongoose.Schema({
  patientName:      { type: String, required: true, trim: true },
  hospitalName:     { type: String, required: true, trim: true },
  bloodGroup:       { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  units:            { type: Number, required: true, min: 1, default: 1 },
  urgency:          { type: String, enum: ['Critical', 'Urgent', 'Standard'], default: 'Urgent' },
  city:             { type: String, required: true, trim: true },
  wardOrDept:       { type: String, default: 'General Ward' },
  contactPerson:    { type: String, required: true, trim: true },
  contactPhone:     { type: String, required: true, trim: true },
  reason:           { type: String, default: 'Clinical Requisition' },
  status:           { type: String, enum: ['Pending', 'In Progress', 'Fulfilled', 'Cancelled'], default: 'Pending' },
  notes:            { type: String, default: '' },
  createdAt:        { type: Date, default: Date.now }
});
```

### User Schema (`models/User.js`)
```javascript
const userSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, required: true, minlength: 6 },
  role:         { type: String, enum: ['user', 'coordinator', 'admin'], default: 'user' },
  phone:        { type: String, default: '' },
  organization: { type: String, default: '' },
  createdAt:    { type: Date, default: Date.now }
});
```

---

## 6. REST API Documentation

### Donor Endpoints (`/api/donors`)
| Method | Endpoint | Description | Query / Body Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/donors` | Retrieve donors list with optional filters | `?bloodGroup=O-&city=Pune&available=true&search=kumar` |
| `GET` | `/api/donors/stats/overview` | Fetch counts for KPI cards and live metrics | None |
| `GET` | `/api/donors/:id` | Fetch single donor by ID | ID in URL parameter |
| `POST` | `/api/donors` | Register new donor | JSON `{ name, email, phone, bloodGroup, age, city, ... }` |
| `PUT` | `/api/donors/:id` | Update complete donor record | JSON `{ name, phone, city, bloodGroup, notes }` |
| `PATCH` | `/api/donors/:id/availability` | Quick 1-click toggle availability flag | JSON `{ isAvailable?: boolean }` (inverts if omitted) |
| `DELETE` | `/api/donors/:id` | Remove donor document from registry | ID in URL parameter |

### Blood Requisition Endpoints (`/api/requests`)
| Method | Endpoint | Description | Query / Body Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/requests` | List requisitions | `?status=Pending&urgency=Critical&city=Pune` |
| `GET` | `/api/requests/recent` | Top active urgent requisitions for ticker | None |
| `POST` | `/api/requests` | Broadcast new blood need | JSON `{ patientName, hospitalName, bloodGroup, units, city, contactPerson, contactPhone }` |
| `PATCH` | `/api/requests/:id/status` | Update requisition status | JSON `{ status: "Fulfilled" }` |
| `DELETE` | `/api/requests/:id` | Delete requisition | ID in URL parameter |

### User & Authentication Endpoints (`/api/users`)
| Method | Endpoint | Description | Body Parameters |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/login` | Authenticate user & issue JWT token | JSON `{ email, password }` |
| `POST` | `/api/users/register` | Create new account | JSON `{ name, email, password, role }` |
| `GET` | `/api/users/profile` | Get current logged-in user profile | Requires `Authorization: Bearer <token>` |

---

## 7. Installation & Execution Guide

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v18.x or v20.x or v24.x).
- Standard web browser (Chrome, Edge, Firefox).
- *Optional:* Local MongoDB instance running on `localhost:27017` or MongoDB Atlas URI in `.env`.
  *(Note: The system contains an automatic in-memory fallback that starts seamlessly if MongoDB is not locally running, guaranteeing zero crashes during viva presentation).*

### Steps to Run:

1. **Open Terminal / Command Prompt:**
   ```bash
   cd "stitch_blood_donor_finder_web_application/backend"
   ```

2. **Install Dependencies (if not already installed):**
   ```bash
   npm install
   ```

3. **Start the Server:**
   ```bash
   npm start
   ```
   *(For development auto-reloading: `npm run dev`)*

4. **Access the Application in your Browser:**
   - **Frontend UI Home:** [http://localhost:5000](http://localhost:5000)
   - **Find Donors:** [http://localhost:5000/find-donor.html](http://localhost:5000/find-donor.html)
   - **Donor Registration:** [http://localhost:5000/register.html](http://localhost:5000/register.html)
   - **Emergency Request:** [http://localhost:5000/request.html](http://localhost:5000/request.html)
   - **Admin Dashboard:** [http://localhost:5000/dashboard.html](http://localhost:5000/dashboard.html)
   - **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 8. Demo Credentials

For quick evaluation during college lab examination, 1-click credential buttons are present on `login.html`:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@hemopulse.org` | `admin123` | Full CRUD permissions on Donors, Requisitions, and System metrics |
| **Hospital Coordinator** | `coordinator@hospital.org` | `coord123` | Broadcast requisitions, update hospital cases, mark fulfilled |
| **Voluntary Donor** | `donor@hemopulse.org` | `donor123` | Donor profile access, personal donation history |

---

## 9. Viva Voce Questions & Answers (WTL Preparation)

### Q1: What architectural pattern does this web application follow?
**Answer:** The project follows the **Client-Server 3-Tier Architecture**:
1. **Presentation Tier (Client):** HTML5, CSS3, and JavaScript (ES6+) running in the browser.
2. **Application Tier (Server):** Node.js and Express.js implementing a RESTful API service.
3. **Data Tier (Database):** MongoDB managed through the Mongoose Object Data Modeling (ODM) library.

### Q2: How does asynchronous data communication work between Frontend and Backend?
**Answer:** The frontend uses the JavaScript `fetch()` API with `async/await`. When a user searches for donors or submits a form, an HTTP request is dispatched with JSON payload (`Content-Type: application/json`). The browser doesn't reload the entire page (SPA-like AJAX behavior); instead, the DOM is dynamically updated with the JSON response received from Express routes.

### Q3: Why is CORS middleware needed in Express?
**Answer:** CORS (Cross-Origin Resource Sharing) is a security mechanism enforced by browsers. If the frontend were served on a different port or domain from the backend (e.g. port 3000 calling port 5000), the browser would block the request by default. The `cors()` middleware adds appropriate `Access-Control-Allow-Origin` HTTP headers so authorized clients can consume the REST API.

### Q4: Explain the difference between `PUT` and `PATCH` in your REST API.
**Answer:** 
- `PUT /api/donors/:id` replaces or updates the entire donor resource with the provided representation (name, email, phone, city, age, etc.).
- `PATCH /api/donors/:id/availability` performs a partial update, modifying only the single `isAvailable` boolean field without requiring other fields to be sent.

### Q5: How are passwords secured in the database?
**Answer:** Passwords are never saved in plain text. When a user registers, the Mongoose `pre('save')` hook intercepts the document, generates a cryptographic salt, and hashes the password using `bcryptjs` (one-way hashing). During login, `bcrypt.compare()` compares the plain text password attempt with the stored cryptographic hash.

### Q6: What is a Mongoose compound index and why did you use one on `bloodGroup` and `city`?
**Answer:** An index speeds up query execution. Because donor search queries predominantly filter by both blood group and location simultaneously (`Donor.find({ bloodGroup: 'O-', city: 'Pune' })`), a compound index `donorSchema.index({ bloodGroup: 1, city: 1 })` allows the database engine to find matching documents directly via a B-tree search in logarithmic time $O(\log N)$ instead of scanning every document in the collection ($O(N)$ full table scan).

### Q7: What are HTTP Status Codes used in your API?
**Answer:**
- `200 OK`: Successful retrieval or update (`GET`, `PUT`, `PATCH`).
- `201 Created`: Successful resource creation (`POST /api/donors`, `POST /api/requests`).
- `400 Bad Request`: Validation failure (missing required field, age out of bounds).
- `401 Unauthorized`: Invalid credentials or missing JWT token.
- `404 Not Found`: Resource ID not present in the database.
- `500 Internal Server Error`: Unhandled server exception caught by centralized error middleware.

### Q8: How is the application resilient if MongoDB daemon is not running on the examiner's PC?
**Answer:** In `backend/db.js`, the database connector attempts to connect to MongoDB with a short timeout. If the daemon is inactive, it catches the connection error and seamlessly initializes a high-fidelity in-memory data store with realistic seed records. All CRUD APIs, search regex, availability toggles, and status updates work identically, guaranteeing a flawless viva demonstration.

---
*Created for Academic Web Technology Lab Examination Evaluation.*
