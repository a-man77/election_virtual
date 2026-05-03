import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Info, CalendarPlus, Clock, Sparkles } from 'lucide-react';
import { generateGoogleCalendarLink } from '../../utils/calendar';

const phases = [
  {
    title: 'Voter List Revision',
    date: 'Dec 2025 - Jan 2026',
    desc: 'The Election Commission updates the electoral rolls. Ensure your name is on the list or apply for corrections.',
    status: 'completed',
    color: 'var(--secondary)'
  },
  {
    title: 'Election Notification',
    date: 'March 2026',
    desc: 'The President/Governor issues the notification calling for elections. The Model Code of Conduct comes into force.',
    status: 'upcoming',
    color: 'var(--primary)'
  },
  {
    title: 'Nomination Filing',
    date: 'March - April 2026',
    desc: 'Candidates file their nominations with the Returning Officer. Affidavits are made public for voter scrutiny.',
    status: 'upcoming',
    color: 'var(--primary)'
  },
  {
    title: 'Scrutiny & Withdrawal',
    date: 'April 2026',
    desc: 'Nominations are scrutinized for validity. Candidates have a window to withdraw their names from the contest.',
    status: 'upcoming',
    color: 'var(--primary)'
  },
  {
    title: 'Campaign Period',
    date: 'April - May 2026',
    desc: 'Parties and candidates share their manifestos and reach out to voters across the country.',
    status: 'upcoming',
    color: 'var(--primary)'
  },
  {
    title: 'Multi-Phase Polling',
    date: 'May 2026',
    desc: 'Voting takes place in multiple phases across different states and constituencies.',
    status: 'upcoming',
    color: 'var(--primary)'
  },
  {
    title: 'Counting of Votes',
    date: 'June 4, 2026',
    desc: 'Votes cast across the country are counted simultaneously, and results are declared.',
    status: 'upcoming',
    color: 'var(--accent)'
  },
];

const TimelineExplorer: React.FC = () => {
  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '6rem' }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', padding: '0.5rem 1rem', borderRadius: '20px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          <Clock size={16} /> Updated for 2026 Cycle
        </div>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>
          Election <span className="gradient-text">Roadmap</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
          Navigate through the critical phases of the democratic process. Stay ahead of deadlines and be an informed participant.
        </p>
      </motion.div>

      <div style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Vertical Line with Gradient */}
        <div style={{ 
          position: 'absolute', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: '4px', 
          height: '100%', 
          background: 'linear-gradient(to bottom, var(--secondary), var(--primary), var(--accent), transparent)',
          opacity: 0.2,
          borderRadius: '2px'
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
          {phases.map((phase, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ 
                display: 'flex', 
                justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              {/* Dot on line */}
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                style={{ 
                  position: 'absolute', 
                  left: '50%', 
                  transform: 'translateX(-50%)', 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: 'var(--bg-dark)',
                  border: `4px solid ${phase.color}`,
                  boxShadow: `0 0 20px ${phase.color}80`,
                  zIndex: 2
                }} 
              />

              <div className="glass" style={{ 
                width: '44%', 
                padding: '2.5rem', 
                position: 'relative',
                textAlign: i % 2 === 0 ? 'right' : 'left',
                background: 'rgba(15, 23, 42, 0.8)',
                borderLeft: i % 2 !== 0 ? `4px solid ${phase.color}` : '1px solid var(--glass-border)',
                borderRight: i % 2 === 0 ? `4px solid ${phase.color}` : '1px solid var(--glass-border)',
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start',
                  marginBottom: '1.25rem' 
                }}>
                  {phase.status === 'completed' ? (
                    <CheckCircle2 size={20} color="var(--secondary)" />
                  ) : (
                    <Sparkles size={18} color={phase.color} />
                  )}
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: phase.color }}>{phase.date}</span>
                </div>
                
                <h3 style={{ marginBottom: '1.25rem', fontSize: '1.8rem', fontWeight: 800 }}>{phase.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2rem', lineHeight: 1.6 }}>{phase.desc}</p>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '1rem',
                  justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start'
                }}>
                  <a 
                    href={generateGoogleCalendarLink(phase.title, phase.date, phase.desc)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ 
                      padding: '0.6rem 1.25rem', 
                      borderRadius: '10px', 
                      fontSize: '0.85rem',
                      background: phase.status === 'completed' ? 'rgba(255,255,255,0.05)' : undefined,
                      boxShadow: phase.status === 'completed' ? 'none' : undefined,
                      color: phase.status === 'completed' ? 'var(--text-dim)' : 'white'
                    }}
                  >
                    <CalendarPlus size={16} /> {phase.status === 'completed' ? 'Event Passed' : 'Add to Calendar'}
                  </a>
                  <button className="glass" style={{ 
                    padding: '0.6rem 1.25rem', 
                    borderRadius: '10px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)'
                  }}>
                    <Info size={16} /> Details
                  </button>
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
