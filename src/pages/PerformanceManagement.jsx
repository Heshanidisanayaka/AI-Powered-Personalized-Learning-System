import { useState } from 'react';
import { Save, UserCheck, BookOpen, PenTool, Award } from 'lucide-react';

export default function PerformanceManagement() {
  const [activeTab, setActiveTab] = useState('attendance');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSuccessMsg('Data saved successfully! AI models are updating predictions.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="heading-lg" style={{ marginBottom: '0.5rem' }}>Performance Management</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Input student marks and attendance to feed the AI prediction engine.</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
        <button 
          className={`btn-secondary ${activeTab === 'attendance' ? 'active' : ''}`}
          style={{ background: activeTab === 'attendance' ? 'var(--accent-primary)' : 'transparent', color: activeTab === 'attendance' ? 'white' : 'var(--text-muted)' }}
          onClick={() => setActiveTab('attendance')}
        >
          <UserCheck size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Attendance
        </button>
        <button 
          className={`btn-secondary ${activeTab === 'quiz' ? 'active' : ''}`}
          style={{ background: activeTab === 'quiz' ? 'var(--accent-primary)' : 'transparent', color: activeTab === 'quiz' ? 'white' : 'var(--text-muted)' }}
          onClick={() => setActiveTab('quiz')}
        >
          <PenTool size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Quiz Marks
        </button>
        <button 
          className={`btn-secondary ${activeTab === 'assignment' ? 'active' : ''}`}
          style={{ background: activeTab === 'assignment' ? 'var(--accent-primary)' : 'transparent', color: activeTab === 'assignment' ? 'white' : 'var(--text-muted)' }}
          onClick={() => setActiveTab('assignment')}
        >
          <BookOpen size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Assignments
        </button>
        <button 
          className={`btn-secondary ${activeTab === 'exam' ? 'active' : ''}`}
          style={{ background: activeTab === 'exam' ? 'var(--accent-primary)' : 'transparent', color: activeTab === 'exam' ? 'white' : 'var(--text-muted)' }}
          onClick={() => setActiveTab('exam')}
        >
          <Award size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Exam Marks
        </button>
      </div>

      <div className="glass-card">
        {successMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '12px', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="grid-cols-2">
            <div className="input-group">
              <label className="input-label">Student ID</label>
              <input type="text" className="input-field" placeholder="e.g. STU-10293" required />
            </div>
            <div className="input-group">
              <label className="input-label">Subject</label>
              <select className="input-field" required>
                <option value="">Select Subject</option>
                <option value="math">Mathematics</option>
                <option value="science">Science</option>
                <option value="history">History</option>
                <option value="english">English</option>
              </select>
            </div>
          </div>

          {activeTab === 'attendance' && (
            <div className="input-group">
              <label className="input-label">Attendance Status</label>
              <div style={{ display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="radio" name="attendance" value="present" required style={{ accentColor: 'var(--accent-primary)' }} /> Present
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="radio" name="attendance" value="absent" required style={{ accentColor: 'var(--accent-primary)' }} /> Absent
                </label>
              </div>
            </div>
          )}

          {(activeTab === 'quiz' || activeTab === 'assignment' || activeTab === 'exam') && (
            <div className="grid-cols-2">
              <div className="input-group">
                <label className="input-label">Marks Obtained</label>
                <input type="number" className="input-field" placeholder="0" min="0" required />
              </div>
              <div className="input-group">
                <label className="input-label">Total Marks</label>
                <input type="number" className="input-field" placeholder="100" min="1" required />
              </div>
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Instructor Notes (Optional)</label>
            <textarea className="input-field" rows="3" placeholder="Add any comments about the student's performance..."></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Save size={18} /> Save & Process Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
