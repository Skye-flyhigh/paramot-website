'use client';

import { createContext, useContext, ReactNode } from 'react';

import type { Customer } from '@/lib/schema';

// Create the context
const CustomerContext = createContext<Customer | null>(null);

// Provider component
export function CustomerProvider({
  customer,
  children,
}: {
  customer: Customer;
  children: ReactNode;
}) {
  return <CustomerContext.Provider value={customer}>{children}</CustomerContext.Provider>;
}

// Custom hook for easy access
export function useCustomer() {
  const context = useContext(CustomerContext);

  if (!context) {
    throw new Error('useCustomer must be used within CustomerProvider');
  }

  return context;
}
