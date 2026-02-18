'use client';

import { Dashboard } from '@/lib/types/dashboard';
import { createContext, ReactNode, useContext } from 'react';

// Create the context
const CustomerContext = createContext<Dashboard | null>(null);

// Provider component
export function CustomerProvider({
  dashboardData,
  children,
}: {
  dashboardData: Dashboard;
  children: ReactNode;
}) {
  return (
    <CustomerContext.Provider value={dashboardData}>{children}</CustomerContext.Provider>
  );
}

// Custom hook for easy access
export function useCustomer() {
  const context = useContext(CustomerContext);

  if (!context) {
    throw new Error('useCustomer must be used within CustomerProvider');
  }

  return context;
}
