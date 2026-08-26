# Professional Project Folder Structure

For a 4th-year Computer Science final-year project, having a scalable, clean, and modular folder structure is critical. It shows examiners that you understand software architecture and separation of concerns.

Below is the complete, professional folder structure for your **AI-Powered Personalized Learning System** using React.js, FastAPI, MySQL, and Scikit-learn.

---

## 📂 1. Root Folder
The root folder is the main container for your entire project. It keeps the frontend and backend completely separate.

```text
ai-learning-system/
│
├── frontend/             # The React.js application
├── backend/              # The FastAPI Python application
└── README.md             # Project documentation (setup instructions, architecture)
```

---

## 🎨 2. Frontend Folders (React.js)
Inside the `frontend/` directory, we organize code by feature and purpose to ensure the UI is maintainable.

```text
frontend/
│
├── public/               # Static files (index.html, favicon.ico)
├── src/                  # All your React source code
│   ├── assets/           # Images, global CSS files, fonts
│   ├── components/       # (See Section 8)
│   ├── pages/            # (See Section 9)
│   ├── services/         # (See Section 10)
│   ├── context/          # React Context API (e.g., AuthContext to manage global login state)
│   ├── hooks/            # Custom React hooks (e.g., useAuth(), useFetchData())
│   ├── utils/            # Helper functions (e.g., date formatting, validation logic)
│   ├── App.jsx           # Main component that handles routing
│   └── main.jsx          # Entry point that renders App.jsx into the DOM
│
├── package.json          # Lists all frontend dependencies (React, Recharts)
└── vite.config.js        # Configuration for the Vite bundler
```

---

## ⚙️ 3. Backend Folders (FastAPI)
Inside the `backend/` directory, we use a standard MVC-like architecture adapted for FastAPI to keep database logic, API routes, and Machine Learning separate.

```text
backend/
│
├── app/                  # The main application package
│   ├── api/              # (See Section 4)
│   ├── core/             # (See Section 7)
│   ├── crud/             # Database CRUD operations (Create, Read, Update, Delete)
│   ├── database/         # (See Section 5)
│   ├── ml/               # (See Section 6)
│   ├── models/           # (See Section 11)
│   ├── schemas/          # (See Section 12)
│   ├── tests/            # (See Section 13)
│   └── main.py           # Entry point for the FastAPI server
│
├── requirements.txt      # Lists Python dependencies (fastapi, uvicorn, sqlalchemy, scikit-learn)
└── .env                  # Environment variables (Database URL, Secret Keys - NEVER commit this to GitHub)
```

---

## 🌐 4. API Routes
Located in `backend/app/api/`, this is where we define the endpoints (URLs) that the React frontend will call.
*   **Purpose**: Keeps the URL routing logic clean and separated from the database logic.
*   *Example files*: `auth.py` (`/login`), `students.py` (`/students/{id}`), `marks.py`, `ai_predictions.py`.

## 🗄️ 5. Database Files
Located in `backend/app/database/`, this folder manages the connection to your MySQL server.
*   **Purpose**: Centralizes the database connection engine and session management using SQLAlchemy.
*   *Example files*: `config.py` (reads the DB URL from `.env`), `session.py` (creates the database connection pool).

## 🧠 6. ML/AI Folders
Located in `backend/app/ml/`, this is where the intelligence of your system lives.
*   **Purpose**: Separates the complex Scikit-learn logic from standard web server logic.
*   *Example files*:
    *   `train_model.py`: Script to train the Scikit-learn model on historical data.
    *   `predictor.py`: Functions that load the trained model and make real-time predictions.
    *   `performance_model.pkl`: The saved/serialized trained machine learning model.

## 🔐 7. Authentication
Located in `backend/app/core/`, this handles system security.
*   **Purpose**: Manages JWT (JSON Web Tokens), password hashing (using bcrypt), and route protection.
*   *Example files*: `security.py` (hashes passwords, creates JWTs), `dependencies.py` (verifies the JWT token from incoming frontend requests to ensure the user is logged in).

## 🧩 8. Components (Frontend)
Located in `frontend/src/components/`, these are reusable building blocks of your user interface.
*   **Purpose**: Prevents code duplication. You build a button once and use it everywhere.
*   *Example folders/files*: `/Navbar`, `/Sidebar`, `/Charts/PerformanceChart.jsx`, `/Tables/StudentTable.jsx`, `Button.jsx`.

## 📄 9. Pages (Frontend)
Located in `frontend/src/pages/`, these represent the actual screens the user navigates to.
*   **Purpose**: Acts as the main containers that combine multiple *Components* together.
*   *Example files*: `Login.jsx`, `StudentDashboard.jsx`, `TeacherDashboard.jsx`, `AdminDashboard.jsx`, `Profile.jsx`.

## 📡 10. Services (Frontend)
Located in `frontend/src/services/`, this folder contains the logic to communicate with the FastAPI backend.
*   **Purpose**: Keeps API call logic (using `fetch` or `axios`) out of your UI components. If an API URL changes, you only update it here.
*   *Example files*: `api.js` (base configuration), `authService.js` (login/register API calls), `studentService.js` (fetching marks/predictions).

## 🏗️ 11. Models (Backend)
Located in `backend/app/models/`, these are your SQLAlchemy database models.
*   **Purpose**: Defines the actual MySQL database tables (Entities) as Python classes.
*   *Example files*: `user.py` (Users table), `subject.py`, `mark.py` (Marks table), `attendance.py`.

## 📋 12. Schemas (Backend)
Located in `backend/app/schemas/`, these use Pydantic to validate data.
*   **Purpose**: Defines the shape of data coming *in* from React (e.g., verifying an email is valid during registration) and the data going *out* to React. It ensures the API never crashes due to bad data.
*   *Example files*: `user_schema.py` (requires email and password string), `mark_schema.py` (requires score to be an integer).

## 🧪 13. Tests
Located in `backend/app/tests/`, this contains your automated testing scripts.
*   **Purpose**: A hallmark of a 4th-year project. It proves your system works reliably by running automated checks on your API endpoints and ML models.
*   *Example files*: `test_auth.py` (tests if login works), `test_ml_predictions.py` (tests if the AI model returns a valid prediction).

---

> [!IMPORTANT]
> **User Review Required**
> 
> Please review this professional folder structure. Notice how it strictly separates the Frontend (React), Backend (FastAPI), Database (MySQL), and AI logic (Scikit-learn).
> 
> If you understand the layout and approve this structure, please let me know! **Next, we will actually run the commands to generate this exact folder structure on your machine.**
