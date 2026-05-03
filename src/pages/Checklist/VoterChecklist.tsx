import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, ExternalLink, Download, Share2, Loader2, Sparkles } from 'lucide-react';
import { auth, db } from '../../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useChecklistStore } from '../../store/useStore';

const initialTasks = [
  { id: 1, title: 'Check Name in Electoral Roll', deadline: 'Jan 15, 2026', completed: false, link: 'https://electoralsearch.eci.gov.in/' },
  { id: 2, title: 'Apply for New Voter ID (Form 6)', deadline: 'Feb 28, 2026', completed: false, link: 'https://voters.eci.gov.in/' },
  { id: 3, title: 'Link Aadhaar with Voter ID', deadline: 'March 15, 2026', completed: false, link: 'https://voters.eci.gov.in/' },
  { id: 4, title: 'Download e-EPIC Card', deadline: 'April 30, 2026', completed: false, link: 'https://voters.eci.gov.in/' },
  { id: 5, title: 'Find Your Polling Booth', deadline: 'May 10, 2026', completed: false, link: '/map' },
];

const VoterChecklist: React.FC = () => {
  const { tasks, setTasks, toggleTask } = useChecklistStore();
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Load tasks from Firestore or use initial
  useEffect(() => {
    const loadTasks = async (user: any) => {
      setLoading(true);
      try {
        const docRef = doc(db, 'userChecklists', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setTasks(docSnap.data().tasks);
        } else {
          // Initialize Firestore with default tasks if new user
          await setDoc(docRef, { tasks: initialTasks });
          setTasks(initialTasks);
        }
      } catch (error) {
        console.error("Error loading checklist:", error);
        setTasks(initialTasks);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        loadTasks(u);
      } else {
        // For non-logged in users, we can use local store (persisted by zustand)
        if (tasks.length === 0) setTasks(initialTasks);
      }
    });

    return unsubscribe;
  }, [setTasks]);

  // Sync to Firestore whenever tasks change
  useEffect(() => {
    const syncTasks = async () => {
      const user = auth.currentUser;
      if (user && tasks.length > 0) {
        setSyncing(true);
        try {
          const docRef = doc(db, 'userChecklists', user.uid);
          await setDoc(docRef, { tasks }, { merge: true });
        } catch (error) {
          console.error("Error syncing checklist:", error);
        } finally {
          setSyncing(false);
        }
      }
    };

    const timeout = setTimeout(syncTasks, 2000); // Debounce sync
    return () => clearTimeout(timeout);
  }, [tasks]);

  const progress = tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '4rem' }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', padding: '0.5rem 1rem', borderRadius: '20px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          <Sparkles size={16} /> Personalized for you
        </div>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
          Voter <span className="gradient-text">Journey</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Your step-by-step roadmap to the ballot box. We'll track your progress and notify you of upcoming deadlines.
        </p>
      </motion.div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Progress Header */}
        <div className="glass" style={{ padding: '2.5rem', marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.4) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Overall Progress</p>
              <h2 style={{ fontSize: '2.5rem' }}>{progress}%</h2>
            </div>
            {syncing && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
              <Loader2 size={12} className="animate-spin" /> Syncing with cloud...
            </div>}
          </div>
          <div style={{ height: '12px', background: 'var(--bg-input)', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', damping: 20 }}
              style={{ height: '100%', background: 'linear-gradient(to right, var(--primary), var(--secondary))', boxShadow: '0 0 20px var(--primary-glow)' }}
            />
          </div>
        </div>

        {/* Tasks List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <Loader2 className="animate-spin" size={48} color="var(--primary)" />
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading your journey...</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {tasks.map((task, index) => (
                <motion.div 
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                  className="glass" 
                  style={{ 
                    padding: '1.5rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1.5rem',
                    background: task.completed ? 'rgba(15, 23, 42, 0.4)' : 'var(--glass-bg)',
                    borderColor: task.completed ? 'var(--glass-border)' : 'rgba(99, 102, 241, 0.2)'
                  }}
                >
                  <button 
                    onClick={() => toggleTask(task.id)}
                    style={{ 
                      background: 'transparent', 
                      color: task.completed ? 'var(--secondary)' : 'var(--text-dim)',
                      transform: task.completed ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                  >
                    {task.completed ? <CheckCircle2 size={32} /> : <Circle size={32} />}
                  </button>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: '1.2rem', 
                      marginBottom: '0.25rem',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? 'var(--text-dim)' : 'white',
                      transition: 'var(--transition)'
                    }}>
                      {task.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.85rem', color: task.completed ? 'var(--text-dim)' : 'var(--primary)', fontWeight: 600 }}>
                        Deadline: {task.deadline}
                      </span>
                    </div>
                  </div>

                  <a 
                    href={task.link} 
                    target={task.link.startsWith('http') ? "_blank" : "_self"} 
                    rel="noopener noreferrer"
                    className="glass"
                    style={{ 
                      padding: '0.6rem', 
                      background: 'rgba(255,255,255,0.03)', 
                      borderRadius: '10px', 
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ExternalLink size={18} />
                  </a>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Actions */}
        {!loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}
          >
            <button className="glass" style={{ padding: '0.8rem 1.8rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
              <Download size={20} /> Export Guide
            </button>
            <button className="glass" style={{ padding: '0.8rem 1.8rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
              <Share2 size={20} /> Share Progress
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VoterChecklist;
