import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  address: string;
  electionData: any | null;
  setAddress: (address: string) => void;
  setElectionData: (data: any) => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      address: '',
      electionData: null,
      setAddress: (address) => set({ address }),
      setElectionData: (electionData) => set({ electionData }),
      clearUserData: () => set({ address: '', electionData: null }),
    }),
    {
      name: 'voter-storage',
    }
  )
);

interface ChecklistItem {
  id: number;
  title: string;
  deadline: string;
  completed: boolean;
  link: string;
}

interface ChecklistState {
  tasks: ChecklistItem[];
  setTasks: (tasks: ChecklistItem[]) => void;
  toggleTask: (id: number) => void;
}

export const useChecklistStore = create<ChecklistState>()(
  persist(
    (set) => ({
      tasks: [],
      setTasks: (tasks) => set({ tasks }),
      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map((task) => 
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      })),
    }),
    {
      name: 'checklist-storage',
    }
  )
);
