import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ExternalLink, Download, Share2 } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  deadline: string;
  completed: boolean;
  link: string;
}

const initialTasks: Task[] = [
  { id: 1, title: 'Check Voter Registration Status', deadline: 'Oct 19, 2026', completed: false, link: 'https://vote.gov' },
  { id: 2, title: 'Request Mail-in Ballot', deadline: 'Oct 27, 2026', completed: false, link: 'https://vote.gov' },
  { id: 3, title: 'Research Local Candidates', deadline: 'Nov 2, 2026', completed: false, link: 'https://ballotpedia.org' },
  { id: 4, title: 'Locate Polling Station', deadline: 'Nov 2, 2026', completed: false, link: '/map' },
  { id: 5, title: 'Cast Your Vote', deadline: 'Nov 3, 2026', completed: false, link: '/map' },
];

const VoterChecklist: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const progress = Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
          Personalized <span className="gradient-text">Checklist</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Your personalized roadmap to the ballot box. Complete each step to ensure you're ready for Election Day.
        </p>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Progress Bar */}
        <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontWeight: 600 }}>
            <span>Progress</span>
            <span className="gradient-text">{progress}%</span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              style={{ height: '100%', background: 'linear-gradient(to right, var(--primary), var(--secondary))' }}
            />
          </div>
        </div>

        {/* Tasks List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tasks.map((task) => (
            <motion.div 
              key={task.id}
              whileHover={{ scale: 1.01 }}
              className="glass" 
              style={{ 
                padding: '1.5rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1.5rem',
                opacity: task.completed ? 0.7 : 1,
                transition: 'opacity 0.3s ease'
              }}
            >
              <button 
                onClick={() => toggleTask(task.id)}
                style={{ background: 'transparent', color: task.completed ? 'var(--secondary)' : 'var(--text-muted)' }}
              >
                {task.completed ? <CheckCircle2 size={32} /> : <Circle size={32} />}
              </button>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  marginBottom: '0.25rem',
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? 'var(--text-muted)' : 'white'
                }}>
                  {task.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                  Deadline: {task.deadline}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a 
                  href={task.link} 
                  target={task.link.startsWith('http') ? "_blank" : "_self"} 
                  rel="noopener noreferrer"
                  style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: 'var(--text-muted)' }}
                >
                  <ExternalLink size={18} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="glass" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <Download size={18} /> Export as PDF
          </button>
          <button className="glass" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <Share2 size={18} /> Share Checklist
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoterChecklist;
