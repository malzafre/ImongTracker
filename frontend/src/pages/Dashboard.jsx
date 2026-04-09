import React, { useMemo } from 'react';
import { useApplications } from '../context/useApplications';
import { Briefcase, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { applications, loading } = useApplications();

  const stats = useMemo(() => {
    const total = applications.length;
    const interviews = applications.filter(a => a.status === 'Interview').length;
    const offers = applications.filter(a => a.status === 'Offer').length;
    const rejections = applications.filter(a => a.status === 'Rejected').length;
    
    // Calculate response rate (interviews + offers + rejections) / total
    const responded = interviews + offers + rejections;
    const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;

    return { total, interviews, offers, rejections, responseRate };
  }, [applications]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading dashboard...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      <h2>Dashboard & Analytics</h2>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <StatCard title="Total Applications" value={stats.total} icon={<Briefcase size={24} color="#3b82f6" />} color="rgba(59, 130, 246, 0.1)" />
        <StatCard title="Interviews" value={stats.interviews} icon={<Clock size={24} color="#f59e0b" />} color="rgba(245, 158, 11, 0.1)" />
        <StatCard title="Offers" value={stats.offers} icon={<CheckCircle size={24} color="#10b981" />} color="rgba(16, 185, 129, 0.1)" />
        <StatCard title="Rejections" value={stats.rejections} icon={<XCircle size={24} color="#ef4444" />} color="rgba(239, 68, 68, 0.1)" />
      </div>

      {/* Analytics Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            <TrendingUp size={20} color="var(--color-primary)" /> Behavioral Insights
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Response Rate</span>
                <span style={{ fontWeight: 'bold' }}>{stats.responseRate}%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-base)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--color-primary)', width: `${stats.responseRate}%`, transition: 'width 0.5s ease-out' }}></div>
              </div>
            </div>
            
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-base)', borderRadius: 'var(--border-radius)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {stats.total === 0 ? "You haven't added any applications yet. Start tracking to see insights here!" :
               stats.responseRate < 20 ? "Keep applying! A typical response rate is around 10-20%. Tailoring your resume might help boost this metric." :
               stats.responseRate > 50 ? "Excellent response rate! Your resume is clearly resonating with employers." :
               "You're seeing a healthy amount of responses. Focus on interview preparation for those positive replies."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div style={{ 
    background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--border-radius)', 
    boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '1rem',
    border: '1px solid var(--border-color)'
  }}>
    <div style={{ background: color, padding: '1rem', borderRadius: '50%' }}>
      {icon}
    </div>
    <div>
      <h3 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-primary)' }}>{value}</h3>
      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>{title}</p>
    </div>
  </div>
);

export default Dashboard;
