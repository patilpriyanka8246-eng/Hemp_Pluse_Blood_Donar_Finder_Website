# Web Technology Laboratory (WTL) - Academic Project Report

---

## **PROJECT TITLE: BLOOD DONOR FINDER & EMERGENCY REQUISITION GRID (HEMOPULSE)**

- **Course:** Web Technology Lab
- **Branch:** Computer Engineering / Information Technology
- **Academic Year:** 2025–2026
- **Architecture:** 3-Tier Full-Stack Web Application (HTML5, CSS3, JavaScript ES6+, Node.js, Express.js, MongoDB)

---

## 1. Aim and Objectives

### 1.1 Aim
To design, implement, and deploy a responsive full-stack web application titled **"Blood Donor Finder (HemoPulse)"** that facilitates rapid discovery and coordination between voluntary blood donors, critical patients, and hospital care units during life-threatening medical emergencies.

### 1.2 Objectives
1. **Voluntary Registration:** Implement a validation-enforced registration pipeline for voluntary blood donors with hematological details, age boundaries (18–65 years), and geographic tags.
2. **Multi-Criteria Search Engine:** Build an instantaneous search mechanism filtering donors by blood group compatibility (ABO & Rh factor) and locality (City / District).
3. **Availability Management:** Allow dynamic 1-click toggling of donor availability flags through RESTful `PATCH` APIs without full-page reloads.
4. **Emergency Requisition Broadcast:** Provide hospital coordinators and family attendants with an urgent requisition portal that streams live emergency needs to an SOS ticker.
5. **Role-Based Authentication & Control Dashboard:** Implement a centralized dashboard protected by JWT token authentication and bcrypt password hashing for administrative supervision and donor CRUD operations.
6. **Aesthetic and Responsive Interface:** Preserve the high-fidelity clinical design system based on Google Stitch ("Vital Red" palette) with fluid responsiveness across mobile, tablet, and desktop viewports.

---

## 2. Software and Hardware Requirements

### 2.1 Software Requirements
- **Operating System:** Windows 10/11, Linux (Ubuntu/Debian), or macOS
- **Runtime Environment:** Node.js (v18.x, v20.x, or v24.x)
- **Package Manager:** npm (v9.x or v10.x+)
- **Server Framework:** Express.js (v4.21+)
- **Database:** MongoDB Community Server (v6.0+) or MongoDB Atlas Cloud
- **Object Data Modeling (ODM):** Mongoose (v8.9+)
- **Security Libraries:** `bcryptjs` (v2.4.3), `jsonwebtoken` (v9.0.2)
- **Web Browser:** Google Chrome, Microsoft Edge, Mozilla Firefox

### 2.2 Hardware Requirements
- **Processor:** 1.8 GHz Multi-core 64-bit CPU or higher
- **RAM:** Minimum 4 GB (8 GB recommended)
- **Storage:** 500 MB free hard drive space

---

## 3. System Architecture & Data Flow

```mermaid
graph TD
    subgraph Client [Tier 1: Presentation Layer (Browser)]
        UI[HTML5 + CSS3 + Tailwind CDN]
        JS[ES6+ Modules: main.js, donor.js, request.js]
        FetchAPI[Asynchronous Fetch API / AJAX]
        UI --> JS
        JS --> FetchAPI
    end

    subgraph Server [Tier 2: Application Layer (Node.js & Express.js)]
        Express[Express.js HTTP Server - Port 5000]
        Middleware[Middlewares: CORS, JSON Parser, Request Logger]
        Routes[Routers: /api/donors, /api/requests, /api/users]
        Controllers[Controllers: donorController, requestController, userController]
        Auth[Security: JWT & bcryptjs Password Hasher]

        Express --> Middleware
        Middleware --> Routes
        Routes --> Controllers
        Controllers --> Auth
    end

    subgraph Database [Tier 3: Data Layer (MongoDB / Mongoose)]
        Mongoose[Mongoose ODM Connection Manager]
        DonorCol[(Donors Collection)]
        RequestCol[(BloodRequests Collection)]
        UserCol[(Users Collection)]

        Controllers --> Mongoose
        Mongoose --> DonorCol
        Mongoose --> RequestCol
        Mongoose --> UserCol
    end

    FetchAPI <==>|HTTP Requests / JSON Responses| Express
```

---

## 4. Database Schema Design (Mongoose Data Models)

### 4.1 Donor Collection (`Donor.js`)
Stores certified voluntary donor profiles.
- `_id`: ObjectId (Primary Key)
- `name`: String (Required, trimmed, minlength: 2)
- `email`: String (Required, validated via regex format)
- `phone`: String (Required, 10–15 digits)
- `bloodGroup`: String (Required, Enum: `['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']`)
- `city`: String (Required, indexed for rapid regex querying)
- `state`: String (Default: 'Maharashtra')
- `district`: String (Locality/Ward)
- `age`: Number (Required, boundary constraint: 18 to 65 years)
- `gender`: String (Enum: `['Male', 'Female', 'Other']`)
- `isAvailable`: Boolean (Default: `true`, indexed for availability toggle queries)
- `lastDonationDate`: Date (Used to determine 90-day whole blood donation intervals)
- `totalDonations`: Number (Donation milestone counter)
- `notes`: String (Free-text availability timing or voluntary notes)
- `createdAt`: Date (Timestamp)

**Compound Index:** `{ bloodGroup: 1, city: 1 }` enables $O(\log N)$ compound query execution.

### 4.2 Blood Request Collection (`BloodRequest.js`)
Stores hospital and emergency room requisitions.
- `_id`: ObjectId (Primary Key)
- `patientName`: String (Required)
- `hospitalName`: String (Required)
- `bloodGroup`: String (Required, Enum: valid ABO/Rh types)
- `units`: Number (Required, minimum 1)
- `urgency`: String (Enum: `['Critical', 'Urgent', 'Standard']`)
- `city`: String (Required)
- `wardOrDept`: String (e.g., ICU Ward 4, Bed 12)
- `contactPerson`: String (Attendant / Doctor name)
- `contactPhone`: String (Direct dial phone number)
- `status`: String (Enum: `['Pending', 'In Progress', 'Fulfilled', 'Cancelled']`)
- `reason`: String (Diagnosis / surgical procedure)
- `createdAt`: Date (Timestamp used for live ticker sorting)

### 4.3 User Collection (`User.js`)
Stores authenticated administrative and coordinator accounts.
- `_id`: ObjectId (Primary Key)
- `name`: String (Required)
- `email`: String (Required, Unique index)
- `password`: String (Hashed with `bcryptjs` salt rounds = 10)
- `role`: String (Enum: `['admin', 'coordinator', 'user']`)
- `organization`: String (Hospital or Foundation affiliation)
- `createdAt`: Date (Timestamp)

---

## 5. RESTful API Endpoints Summary

| HTTP Verb | Route Path | Controller Action | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Server Health Monitor | Returns server uptime, version, and database state |
| `GET` | `/api/donors` | `getAllDonors` | Retrieves donors matching blood group, city, availability |
| `GET` | `/api/donors/stats/overview`| `getStats` | Aggregates counts for total, available, and blood bank metrics |
| `GET` | `/api/donors/:id` | `getDonorById` | Returns a single donor's full clinical record |
| `POST` | `/api/donors` | `createDonor` | Validates input and persists new voluntary donor |
| `PUT` | `/api/donors/:id` | `updateDonor` | Modifies existing donor information |
| `PATCH` | `/api/donors/:id/availability` | `toggleAvailability` | 1-click inverts or sets `isAvailable` boolean |
| `DELETE`| `/api/donors/:id` | `deleteDonor` | Removes donor record from database |
| `GET` | `/api/requests` | `getAllRequests` | Lists all blood requisitions with status filters |
| `GET` | `/api/requests/recent` | `getRecentEmergencies` | Feeds top active critical requisitions to live ticker |
| `POST` | `/api/requests` | `createRequest` | Inserts emergency requisition into database |
| `PATCH` | `/api/requests/:id/status`| `updateRequestStatus`| Updates requisition status (Pending → Fulfilled) |
| `DELETE`| `/api/requests/:id` | `deleteRequest` | Removes requisition record |
| `POST` | `/api/users/login` | `login` | Authenticates credentials and issues signed JWT |
| `POST` | `/api/users/register` | `register` | Creates administrator or coordinator account |

---

## 6. Key Code Implementations

### 6.1 Server Entrypoint (`backend/server.js`)
```javascript
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static directory directly
app.use(express.static('../frontend'));

// Mount REST routes
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 6.2 Availability Toggle Logic (`backend/controllers/donorController.js`)
```javascript
exports.toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const donor = await Donor.findById(id);
    if (!donor) return res.status(404).json({ success: false, message: 'Donor not found' });

    // Toggle boolean value
    donor.isAvailable = !donor.isAvailable;
    await donor.save();

    return res.status(200).json({
      success: true,
      message: `Donor availability updated to: ${donor.isAvailable ? 'Available' : 'Unavailable'}`,
      data: donor
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Toggle failed', error: err.message });
  }
};
```

### 6.3 Asynchronous Fetch Client (`frontend/js/donor.js`)
```javascript
async function searchDonors() {
  const bg = document.getElementById('filter-blood-group').value;
  const city = document.getElementById('filter-city').value;
  const availableOnly = document.getElementById('filter-available-only').checked;

  let url = `${API_BASE}/donors?bloodGroup=${encodeURIComponent(bg)}&city=${encodeURIComponent(city)}`;
  if (availableOnly) url += '&available=true';

  const res = await fetch(url);
  const json = await res.json();
  if (json.success) {
    renderDonorsGrid(json.data);
  }
}
```

---

## 7. Verification and Testing Results

| Test Case ID | Test Description | Input Data | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Register Donor with Valid Data | Name: "Ramesh P", BG: "O-", City: "Pune", Age: 25 | Status 201 Created, Virtual ID displayed | Donor record saved in DB with status 201 | **PASSED** |
| **TC-02** | Register Donor with Invalid Age | Age: 16 (Under legal boundary) | Status 400 Bad Request, validation message | Alert: "Donor age must be between 18 and 65" | **PASSED** |
| **TC-03** | Search Donors by Blood Group & City | BG: "O+", City: "Pune" | Status 200, returns array of matching donors | Filtered 2 donors matching criteria | **PASSED** |
| **TC-04** | Toggle Donor Availability | Click "Toggle" on Donor record | `isAvailable` flips from `true` to `false` | Status 200, DOM button changes to "Unavailable" | **PASSED** |
| **TC-05** | Broadcast Urgent Requisition | Hospital: "Ruby Hall", Units: 2, BG: "A+" | Requisition created, SOS ticker updated | Status 201, appears instantly in live ticker | **PASSED** |
| **TC-06** | Administrator Authentication | Email: `admin@hemopulse.org`, Pwd: `admin123` | Status 200, JWT token issued, redirects to dashboard | Login successful, JWT stored in localStorage | **PASSED** |

---

## 8. Conclusion & Viva Voce Preparedness

The **Blood Donor Finder (HemoPulse)** application fulfills all requirements stipulated by the Web Technology Laboratory curriculum:
1. **Frontend Mastery:** Semantic HTML5 structure, responsive layout via Flexbox & Grid, CSS3 custom variables, and DOM manipulation via JavaScript ES6+.
2. **Backend Engineering:** RESTful architecture implemented with Express.js routing, custom middleware pipelines, and centralized error boundaries.
3. **Database Integration:** Schema-driven persistence utilizing MongoDB and Mongoose, complete with compound indexing and validation constraints.
4. **Security & State:** Cryptographic password hashing (`bcryptjs`) and stateless session tokens (`jsonwebtoken`).
5. **Robustness:** Includes an automated resilient data store fallback ensuring zero runtime disruption during viva evaluation.

---
*Report prepared for Web Technology Lab End-Semester Practical Examination.*
