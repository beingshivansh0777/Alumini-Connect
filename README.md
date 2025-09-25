#  Alumni Management System(Alumni-Connect)

A **full-featured Alumni Management Platform** built with **React.js + TypeScript + Tailwind CSS**, supporting multi-role access, event management, mentorship, donations, and admin analytics. All data is stored locally using **Local Storage**, and mock integrations are used for payments and messaging.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Project Structure](#project-structure)  
- [Setup & Installation](#setup--installation)  
- [Usage](#usage)  
- [Future Enhancements](#future-enhancements)  
- [License](#license)  

---

## Features

### 1. Multi-Role Login System
- **Alumni:** Create profile, update career info, join events, apply as mentor, donate.  
- **Students:** View alumni directory, request mentorship, apply for internships/events.  
- **Admin (College):** Approve alumni registrations, create events, view donation stats.  
- **Role-Based Dashboard:** Simple dashboards based on role.  
- **Local Storage:** User data saved locally for persistent login.

---

### 2. Alumni Directory (Enhanced)
- Profile cards display: **Name, Year, Company, Designation, LinkedIn**.  
- **Search & Filter:** By Year, Branch, or Industry.  
- **Admin Controls:** Approve or reject alumni profiles.

---

### 3. Event Management
- **Admin:** Create, edit, delete events.  
- **Alumni & Students:** View upcoming events and RSVP (Yes/No).  
- RSVP data stored in **local storage**.

---

### 4. Mentorship Platform
- **Alumni:** Toggle availability as mentor.  
- **Students:** Request mentorship → request stored in alumni’s mentorship inbox.  
- **Admin:** Track mentorship requests for monitoring purposes.  

---

### 5. Donation System (Mock)
- Alumni can donate via **Razorpay demo button**.  
- List of donors displayed with contribution amount.  
- Admin sees **total funds collected**.  

---

### 6. Admin Analytics (Basic but Impressive)
- Interactive charts using **Chart.js / Recharts** (mock data).  
- Metrics displayed:  
  - Total Alumni Registered  
  - Active Mentors  
  - Donations Collected  
  - Students Connected  
- Demonstrates scalability and insights for admins.

---

### 7. Bonus Add-ons (Time Permitting)
- **Messaging System (Mock):** Alumni ↔ Student chat saved in local storage.  
- **Badges/Gamification:** Top Mentor, Early Donor, Event Organizer.  
- **Profile Completion Meter:** Visual indicator of alumni profile completeness (%).  

---

## Tech Stack

- **Frontend:** React.js + TypeScript + Tailwind CSS  
- **State Management:** Local Storage (CRUD operations)  
- **Charts & Analytics:** Chart.js or Recharts  
- **Mock Payments:** Razorpay Sandbox  
- **Responsive Design:** Fully mobile-friendly
