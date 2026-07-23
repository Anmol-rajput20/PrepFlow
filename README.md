# 📘 PrepFlow - Student Productivity Dashboard

PrepFlow is a full-stack productivity web application that helps students organize their academic work efficiently. It enables users to create work areas, manage tasks, track deadlines, visualize progress through analytics, and receive automated deadline reminders.

## 🚀 Live Demo

🔗 **Live Website:** prep-flow-beta.vercel.app

---

## 📸 Features

### 📋 Task Management
- Create multiple work areas
- Add, edit and delete subtasks
- Set deadlines for every task
- Mark tasks as completed
- Automatic progress tracking

### 📊 Analytics Dashboard
- Total Tasks
- Completed Tasks
- Pending Tasks
- Overdue Tasks
- Completion Percentage
- Pie Chart Visualization
- Work Area Activity Bar Chart

### 📅 Calendar
- Interactive calendar interface
- View tasks scheduled for a selected date
- Deadline visualization

### 👤 User Profile
- Secure authentication using Clerk
- Profile information
- Personalized dashboard experience

### 🔔 Push Notifications
- Browser push notifications
- Deadline reminder system
- Automated notification scheduling using Firebase Cloud Functions

### 📱 Responsive Design
- Desktop
- Tablet
- Mobile

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- CSS3
- React Router DOM
- Recharts
- React Calendar

## Backend & Cloud
- Firebase Firestore
- Firebase Cloud Functions
- Firebase Cloud Messaging (FCM)

## Authentication
- Clerk Authentication

## Deployment
- Vercel
- Firebase

---

# 📂 Project Structure

```text
src/
│
├── components/
│   ├── Dashboard.jsx
│   ├── Layout.jsx
│   ├── Sidebar.jsx
│   └── WorkArea.jsx
│
├── pages/
│   ├── Analytics.jsx
│   ├── CalendarPage.jsx
│   └── Profile.jsx
│
├── firebase.js
├── firebase-messaging.js
├── App.jsx
└── main.jsx

functions/
│
└── index.js
```

---

# ⚙️ Installation

Move into the project

```bash
cd prepflow
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

---

# 🔐 Environment Variables

Create a `.env` file in the project root.

```env
VITE_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY
```

---

# ☁️ Firebase Setup

- Create a Firebase Project
- Enable Firestore Database
- Enable Cloud Messaging
- Deploy Cloud Functions

Deploy Functions

```bash
firebase deploy --only functions
```

---

# 📊 Application Workflow

```text
User Login
      │
      ▼
Authentication (Clerk)
      │
      ▼
Dashboard
      │
      ├──────────────► Work Areas
      │                     │
      │                     ▼
      │                Tasks & Deadlines
      │
      ├──────────────► Analytics
      │
      ├──────────────► Calendar
      │
      └──────────────► Profile

               │
               ▼

Firebase Firestore

               │
               ▼

Cloud Functions

               │
               ▼

Push Notifications
```

---

# 🚀 Future Enhancements

- Smart notification scheduling
- Email reminders
- Dark mode
- Drag and drop task management
- Task categories
- Notes attachment
- File uploads
- Weekly productivity reports
- AI-powered task prioritization

---

# 🎯 Learning Outcomes

This project helped in understanding:

- React Component Architecture
- React Hooks
- Client-side Routing
- Authentication using Clerk
- Firebase Firestore CRUD Operations
- Cloud Functions
- Firebase Cloud Messaging
- Data Visualization using Recharts
- Responsive UI Design
- Full Stack Deployment

---


# 👨‍💻 Author

**Anmol Rajput**

MCA Student  
Thapar Institute of Engineering & Technology

---

# ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

It motivates me to build more projects and improve this application further.
