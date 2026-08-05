import React from 'react';
import * as Ds from '../components/ui';
import { 
  IconAward, 
  IconUserCheck, 
  IconExternalLink,
  IconShieldCheck,
  IconUsers
} from '@tabler/icons-react';

export default function ExpertForumPage() {
  const leaders = [
    {
      name: 'M. M. Muzamil',
      image: '/team-assets/muzammil.jpg',
      badge: 'C-Suite HR & Business Leader',
      headline: 'Head of Human Resources | Doctoral Candidate-University of Colombo | C-Suite HR Professional | Lecturer | HR & Business Consultant | HR Analyst | Tech Recruiter | Edupreneur | Corporate Trainer | Mentor',
      linkedin: 'https://www.linkedin.com/in/mmmuzamil/',
      tags: ['Head of HR', 'Doctoral Candidate', 'C-Suite HR', 'Lecturer', 'Tech Recruiter', 'Edupreneur']
    }
  ];

  return (
    <div className="dashboard-body" style={{ position: 'relative', paddingBottom: '4rem' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <Ds.PageHeader
          title="Expert Forum"
          description="Honorary platform for CEOs, Managing Directors, Founders, and C-Suite Business Leaders."
        />
      </div>

      {/* Hero Banner */}
      <div className="event-hero-v3" style={{ background: 'linear-gradient(135deg, #080D24 0%, #162050 100%)', border: '1px solid rgba(201, 168, 76, 0.3)', borderRadius: '24px', padding: '2rem', color: '#ffffff', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '800px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconAward size={22} style={{ color: 'var(--brand-amber)' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--brand-amber)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>PBN EXECUTIVE LEADERSHIP</span>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', margin: '4px 0 0 0' }}>
            Thought Leadership &amp; Strategic Advisory
          </h3>
          <p style={{ color: '#7a85b0', fontSize: '0.95rem', margin: '4px 0 12px 0', lineHeight: 1.6 }}>
            The Expert Forum is an honorary, fee-free platform bringing together senior executives, doctoral scholars, and C-Suite professionals to connect, advise, and lead strategic initiatives across the network.
          </p>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '8px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 800 }}>
              Honorary Membership
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 800 }}>
              No Participation Fee
            </div>
          </div>
        </div>
      </div>

      {/* Leaders Section */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--fg-primary)', marginBottom: '1.25rem' }}>
        Distinguished Forum Leaders &amp; Consultants
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {leaders.map((leader, i) => (
          <div 
            key={i}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '24px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid #c9a84c',
              boxShadow: '0 0 20px rgba(201, 168, 76, 0.25)',
              marginBottom: '1.25rem',
              background: '#080d24'
            }}>
              <img src={leader.image} alt={leader.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }} />
            </div>

            <span style={{
              background: 'rgba(201, 168, 76, 0.1)',
              color: '#c9a84c',
              border: '1px solid rgba(201, 168, 76, 0.3)',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '3px 12px',
              borderRadius: '100px',
              marginBottom: '0.75rem',
              textTransform: 'uppercase'
            }}>
              {leader.badge}
            </span>

            <h4 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--fg-primary)', margin: '0 0 0.5rem 0' }}>
              {leader.name}
            </h4>

            <p style={{ fontSize: '0.85rem', color: 'var(--fg-secondary)', lineHeight: 1.55, marginBottom: '1.25rem' }}>
              {leader.headline}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginBottom: '1.5rem' }}>
              {leader.tags.map((tag, idx) => (
                <span key={idx} style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', color: 'var(--fg-secondary)', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                  {tag}
                </span>
              ))}
            </div>

            <a 
              href={leader.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="ds-btn ds-btn--primary"
              style={{
                width: '100%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '0.75rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 800,
                textDecoration: 'none'
              }}
            >
              <IconExternalLink size={16} />
              View LinkedIn Profile
            </a>
          </div>
        ))}
      </div>

    </div>
  );
}
