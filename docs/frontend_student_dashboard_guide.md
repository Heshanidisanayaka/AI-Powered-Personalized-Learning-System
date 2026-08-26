# Frontend Setup Step 2: The Student Dashboard

The Student Dashboard is the heart of your application. It aggregates all academic data and displays the AI predictions. 

Because this is a complex page, we will build it step by step. We will start by defining how React talks to FastAPI, create the API service, and then build the beautiful UI components.

---

### Step 2.1: The API Connection Strategy
Before writing UI code, we must define exactly how the frontend will request this massive amount of data from the backend. 

To keep things efficient, we won't make 10 different API calls. Instead, we will make **one single call** to a dashboard endpoint that returns everything.

#### API Contract Explanation
*   **Endpoint:** `GET /api/dashboard/student/{student_id}`
*   **Request:** A simple GET request with the Authorization header (JWT token).
*   **Response:** A large JSON object containing nested data:
    ```json
    {
      "metrics": {
        "overall_performance": 82.5,
        "attendance": 94,
        "avg_quiz": 78,
        "study_hours_this_week": 14
      },
      "progress_trend": [
        {"week": "W1", "score": 70}, 
        {"week": "W2", "score": 75}
      ],
      "subject_performance": [
        {"subject": "Math", "marks": 85}, 
        {"subject": "Science", "marks": 72}
      ],
      "ai_insights": {
        "predicted_exam_score": 88,
        "status": "Good",
        "weak_subjects": ["Science"],
        "weak_topics": ["Thermodynamics"],
        "recommendations": ["Review Lesson 4 and retake the Thermodynamics practice quiz."]
      },
      "upcoming": [
        {"title": "Math Midterm", "date": "2026-09-01"}
      ],
      "notifications": [
        {"id": 1, "message": "Your Science assignment is due tomorrow!"}
      ]
    }
    ```

---

### Step 2.2: The React Service
We will create a centralized file for our API calls. This keeps our UI code clean.

**1. File to create:** `dashboardService.js`
**2. Where to save it:** `frontend/src/services/dashboardService.js`
**3. Complete code:**
```javascript
// In a real app, you would use 'axios' and a real base URL.
// For now, we simulate the API call with a delay to show loading states.

export const fetchStudentDashboard = async (studentId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        metrics: {
          overall_performance: 82.5,
          attendance: 94,
          avg_quiz: 78,
          study_hours_this_week: 14
        },
        progress_trend: [
          { name: 'Week 1', score: 70 },
          { name: 'Week 2', score: 75 },
          { name: 'Week 3', score: 82 },
          { name: 'Week 4', score: 80 },
          { name: 'Week 5', score: 86 }
        ],
        subject_performance: [
          { subject: 'Math', marks: 85 },
          { subject: 'Science', marks: 72 },
          { subject: 'English', marks: 90 },
          { subject: 'History', marks: 65 }
        ],
        ai_insights: {
          predicted_exam_score: 88,
          status: "Good",
          weak_subjects: ["History", "Science"],
          weak_topics: ["World War II", "Thermodynamics"],
          recommendations: [
            "Review History Lesson 4 (WWII) and take the practice quiz.",
            "Increase Science study time by 2 hours this week."
          ]
        },
        upcoming: [
          { title: "Math Midterm", date: "2026-09-01" },
          { title: "Science Quiz", date: "2026-08-30" }
        ],
        notifications: [
          { id: 1, message: "Your Science assignment is due tomorrow!" },
          { id: 2, message: "AI detected a drop in your History scores." }
        ]
      });
    }, 1500); // 1.5 second delay to simulate network request
  });
};
```

---

### Step 2.3: The Dashboard Component
Now we build the massive, responsive UI using the data from our service.

**1. File to create:** `StudentDashboard.jsx`
**2. Where to save it:** `frontend/src/pages/StudentDashboard.jsx`
**3. Complete code:**
```jsx
import { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Target, AlertTriangle, Book, Bell, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { fetchStudentDashboard } from '../services/dashboardService';

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchStudentDashboard(1); // Simulating student ID 1
        setData(response);
      } catch (err) {
        setError('Failed to load dashboard data. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#3b82f6' }}>
        <h2>Loading AI Analytics...</h2>
      </div>
    );
  }

  if (error) return <div style={{ color: '#ef4444' }}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Top Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <MetricCard title="Overall Score" value={`${data.metrics.overall_performance}%`} icon={<TrendingUp color="#3b82f6" />} />
        <MetricCard title="Attendance" value={`${data.metrics.attendance}%`} icon={<CheckCircle color="#10b981" />} />
        <MetricCard title="Avg Quiz" value={`${data.metrics.avg_quiz}%`} icon={<Target color="#f59e0b" />} />
        <MetricCard title="Study Hours" value={`${data.metrics.study_hours_this_week}h`} icon={<Clock color="#8b5cf6" />} />
      </div>

      {/* 2. Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Left Column: Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Progress Chart */}
          <div className="card" style={cardStyle}>
            <h3>Performance Progress</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer>
                <LineChart data={data.progress_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155' }} />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subject Performance Chart */}
          <div className="card" style={cardStyle}>
            <h3>Subject-wise Marks</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer>
                <BarChart data={data.subject_performance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="subject" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155' }} />
                  <Bar dataKey="marks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: AI Insights & Sidebars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* AI Predictor Box */}
          <div className="card" style={{ ...cardStyle, border: '1px solid #8b5cf6', background: 'rgba(139, 92, 246, 0.1)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#c4b5fd' }}>
              <Target size={20} /> AI Predicted Final Score
            </h3>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', textAlign: 'center', margin: '20px 0' }}>
              {data.ai_insights.predicted_exam_score}%
            </div>
            <p style={{ textAlign: 'center', color: '#a78bfa' }}>Status: {data.ai_insights.status}</p>
          </div>

          {/* Weak Areas & Recommendations */}
          <div className="card" style={cardStyle}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f87171' }}>
              <AlertTriangle size={20} /> AI Recommendations
            </h3>
            
            <h4 style={{ color: '#94a3b8', marginTop: '15px', fontSize: '0.9rem' }}>Weak Topics Detected:</h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
              {data.ai_insights.weak_topics.map((topic, i) => (
                <span key={i} style={{ background: '#7f1d1d', color: '#fca5a5', padding: '5px 10px', borderRadius: '4px', fontSize: '0.85rem' }}>
                  {topic}
                </span>
              ))}
            </div>

            <h4 style={{ color: '#94a3b8', marginTop: '20px', fontSize: '0.9rem' }}>Action Plan:</h4>
            <ul style={{ paddingLeft: '20px', color: '#e2e8f0', marginTop: '10px', fontSize: '0.9rem' }}>
              {data.ai_insights.recommendations.map((rec, i) => <li key={i} style={{ marginBottom: '8px' }}>{rec}</li>)}
            </ul>
          </div>

          {/* Notifications */}
          <div className="card" style={cardStyle}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bell size={20} color="#f59e0b" /> Recent Alerts
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '15px' }}>
              {data.notifications.map(n => (
                <li key={n.id} style={{ background: '#334155', padding: '10px', borderRadius: '6px', marginBottom: '10px', fontSize: '0.9rem' }}>
                  {n.message}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}

// Reusable Metric Card Sub-component
function MetricCard({ title, value, icon }) {
  return (
    <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>{title}</p>
        <h2 style={{ margin: '5px 0 0 0', fontSize: '1.8rem' }}>{value}</h2>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
        {icon}
      </div>
    </div>
  );
}

const cardStyle = {
  background: '#1e293b',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid #334155'
};
```

---

### Step 2.4: Update App Routing
To see the new dashboard, we just need to update `App.jsx` to render this new component instead of the placeholder.

**1. Update file:** `frontend/src/App.jsx`
**2. Modify the file:**
Change `import Dashboard from './pages/StudentDashboard'` and replace the placeholder `<Dashboard />` in your `<Route path="/">` block with the real `StudentDashboard` component.

---

> [!IMPORTANT]
> **Awaiting Your Confirmation**
> 
> Review the Dashboard code above. Notice how the `useEffect` hook triggers the `fetchStudentDashboard` service on page load, displaying a loading screen, and then populates the Recharts and AI Insight cards flawlessly.
> 
> Once you have created these files and updated your routing, run your frontend and see the magic! Let me know when you approve this setup!
