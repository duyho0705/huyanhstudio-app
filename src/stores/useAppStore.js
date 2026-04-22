import { create } from 'zustand';

const useAppStore = create((set) => ({
  // App Config
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  
  // UI State
  isSidebarOpen: false,
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  
  // Modals (Migrated from AuthContext)
  showLoginModal: false,
  modalMode: 'login',
  setShowLoginModal: (isOpen, mode = 'login') => set({ showLoginModal: isOpen, modalMode: mode }),
}));

export default useAppStore;
