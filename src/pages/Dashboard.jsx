import { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend 
} from 'recharts';
import { TrendingUp, Book, Clock, AlertTriangle, CheckCircle, Target } from 'lucide-react';

const performanceData = [
  { name: 'Week 1', score: 75, attendance: 90 },
  { name: 'Week 2', score: 78, attendance: 95 },
  { name: 'Week 3', score: 82, attendance: 100 },
  { name: 'Week 4', score: 76, attendance: 85 },
  { name: 'Week 5', score: 85, attendance: 95 },
  { name: 'Week 6', score: 88, attendance: 100 },
];

const subjectData = [
  { subject: 'Math', marks: 85 },
  { subject: 'Science', marks: 78 },
  { subject: 'English', marks: 92 },
  { subject: 'History', marks: 65 },
];

export default function Dashboard() {
  const [classification, setClassification] = useState('Good');
  
  // AI Simulation (Mock logic for demonstration)
  const predictedScore = 89;
  const weakAreas = ['History - Essay Writing', 'Science - Thermodynamics'];
  
  const getBadgeClass = (status) => {
    switch(status) {
      case 'Excellent': return 'badge-excellent';
      case 'Good': return 'badge-good';
      case 'Average': return 'badge-average';
      case 'At Risk': return 'badge-at-risk';
      default: return 'badge-average';
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 className="heading-lg" style={{ marginBottom: '0.2rem' }}>Student Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, John! Here is your AI-powered performance analysis.</p>
        </div>
        <div className={`badge ${getBadgeClass(classification)}`} style={{ fontSize: '1rem', padding: '8px 16px' }}>
          Current Status: {classification}
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid-cols-3" style={{ marginBottom: '2rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '10px', borderRadius: '12px' }}>
              <TrendingUp color="#3b82f6" />
            </div>
            <h3 className="heading-md" style={{ margin: 0, fontSize: '1.2rem' }}>Overall Average</h3>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px' }}>82%</div>
          <div style={{ color: 'var(--success)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={16} /> +4% from last month
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '10px', borderRadius: '12px' }}>
              <CheckCircle color="#10b981" />
            </div>
            <h3 className="heading-md" style={{ margin: 0, fontSize: '1.2rem' }}>Attendance</h3>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px' }}>94%</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            28/30 classes attended
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '10px', borderRadius: '12px' }}>
              <Clock color="#8b5cf6" />
            </div>
            <h3 className="heading-md" style={{ margin: 0, fontSize: '1.2rem' }}>Study Time</h3>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px' }}>24h</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Logged this week
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="glass-card" style={{ marginBottom: '2rem', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
        <h3 className="heading-md" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Target color="#8b5cf6" /> AI Performance Prediction
        </h3>
        <div className="grid-cols-2">
          <div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Based on your recent quiz scores and attendance, our AI model predicts your final exam performance.
            </p>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--accent-primary)', lineHeight: '1' }}>{predictedScore}%</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '8px' }}>Predicted Score</div>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.95rem', margin: 0 }}>You are on track! Keep up the current study hours to maintain or improve this score.</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="var(--warning)" /> Weak Areas Detected
            </h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {weakAreas.map((area, idx) => (
                <li key={idx} style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '12px 16px', borderRadius: '8px', marginBottom: '8px', fontSize: '0.95rem', color: '#fcd34d' }}>
                  {area}
                </li>
              ))}
            </ul>
            <button className="btn-secondary" style={{ marginTop: '10px', fontSize: '0.85rem', padding: '8px 16px' }}>View AI Recommendations</button>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid-cols-2">
        <div className="glass-card">
          <h3 className="heading-md">Performance Trend</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <h3 className="heading-md">Subject-wise Marks</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="subject" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="marks" fill="url(#colorMarks)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorMarks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-secondary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--accent-secondary)" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
