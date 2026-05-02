import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Info, CalendarPlus } from 'lucide-react';
import { generateGoogleCalendarLink } from '../../utils/calendar';

const phases = [
  {
    title: 'Voter List Revision',
    date: 'Dec 2025 - Jan 2026',
    desc: 'The Election Commission updates the electoral rolls. Ensure your name is on the list or apply for corrections.',
    status: 'completed',
  },
  {
    title: 'Election Notification',
    date: 'March 2026',
    desc: 'The President/Governor issues the notification calling for elections. The Model Code of Conduct comes into force.',
    status: 'upcoming',
  },
  {
    title: 'Nomination Filing',
    date: 'March - April 2026',
    desc: 'Candidates file their nominations with the Returning Officer. Affidavits are made public for voter scrutiny.',
    status: 'upcoming',
  },
  {
    title: 'Scrutiny & Withdrawal',
    date: 'April 2026',
    desc: 'Nominations are scrutinized for validity. Candidates have a window to withdraw their names from the contest.',
    status: 'upcoming',
  },
  {
    title: 'Campaign Period',
    date: 'April - May 2026',
    desc: 'Parties and candidates share their manifestos and reach out to voters across the country.',
    status: 'upcoming',
  },
  {
    title: 'Multi-Phase Polling',
    date: 'May 2026',
    desc: 'Voting takes place in multiple phases across different states and constituencies.',
    status: 'upcoming',
  },
  {
    title: 'Counting of Votes',
    date: 'June 4, 2026',
    desc: 'Votes cast across the country are counted simultaneously, and results are declared.',
    status: 'upcoming',
  },
];

const TimelineExplorer: React.FC = () => {
  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
          Election <span className="gradient-text">Timeline</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
          Explore every phase of the electoral cycle. Stay informed about key dates and your responsibilities as a voter.
        </p>
      </div>

      <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
        {/* Vertical Line */}
        <div style={{ 
          position: 'absolute', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: '2px', 
          height: '100%', 
          background: 'linear-gradient(to bottom, var(--primary), var(--secondary), transparent)',
          opacity: 0.3
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          {phases.map((phase, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ 
                display: 'flex', 
                justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              {/* Dot on line */}
              <div style={{ 
                position: 'absolute', 
                left: '50%', 
                transform: 'translateX(-50%)', 
                width: '16px', 
                height: '16px', 
                borderRadius: '50%', 
                background: phase.status === 'completed' ? 'var(--secondary)' : 'var(--bg-dark)',
                border: `3px solid ${phase.status === 'completed' ? 'var(--secondary)' : 'var(--primary)'}`,
                boxShadow: phase.status === 'completed' ? '0 0 15px var(--secondary)' : 'none',
                zIndex: 1
              }} />

              <div className="glass" style={{ 
                width: '45%', 
                padding: '2rem', 
                position: 'relative',
                textAlign: i % 2 === 0 ? 'right' : 'left'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start',
                  marginBottom: '1rem' 
                }}>
                  {phase.status === 'completed' && <CheckCircle2 size={20} color="var(--secondary)" />}
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)' }}>{phase.date}</span>
                </div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{phase.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>{phase.desc}</p>
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem',
                  justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start'
                }}>
                  <button style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                  }}>
                    <Info size={16} /> Details
                  </button>
                  <a 
                    href={generateGoogleCalendarLink(phase.title, phase.date, phase.desc)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass"
                    style={{ 
                      padding: '0.5rem 1rem', 
                      borderRadius: '8px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      fontSize: '0.9rem',
                      color: 'var(--secondary)'
                    }}
                  >
                    <CalendarPlus size={16} /> Remind Me
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineExplorer;
