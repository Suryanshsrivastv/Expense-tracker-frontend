import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Predefined categories with colors
export const CATEGORIES = {
  FOOD: { id: 'food', name: 'Food & Dining', color: '#FF6384' },
  SHOPPING: { id: 'shopping', name: 'Shopping', color: '#36A2EB' },
  HOUSING: { id: 'housing', name: 'Housing', color: '#FFCE56' },
  TRANSPORTATION: { id: 'transportation', name: 'Transportation', color: '#4BC0C0' },
  ENTERTAINMENT: { id: 'entertainment', name: 'Entertainment', color: '#9966FF' },
  HEALTHCARE: { id: 'healthcare', name: 'Healthcare', color: '#FF9F40' },
  EDUCATION: { id: 'education', name: 'Education', color: '#8AC249' },
  PERSONAL: { id: 'personal', name: 'Personal', color: '#EA80FC' },
  UTILITIES: { id: 'utilities', name: 'Utilities', color: '#607D8B' },
  OTHER: { id: 'other', name: 'Other', color: '#9E9E9E' },
  INCOME: { id: 'income', name: 'Income', color: '#4CAF50' }
};

// Convert object to array for easier use in forms, etc.
export const CATEGORIES_ARRAY = Object.values(CATEGORIES);

// Define initial state
const initialState = {
  transactions: [],
  loading: false,
  error: null
};

// Create context
const TransactionContext = createContext(initialState);

// Transaction reducer
const transactionReducer = (state, action) => {
  switch (action.type) {
    case 'GET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
        loading: false
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions]
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id !== action.payload)
      };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction => 
          transaction.id === action.payload.id ? action.payload : transaction
        )
      };
    case 'TRANSACTION_ERROR':
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};

// Provider component
export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Load transactions from localStorage on initial load
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    
    if (savedTransactions) {
      dispatch({
        type: 'GET_TRANSACTIONS',
        payload: JSON.parse(savedTransactions)
      });
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(state.transactions));
  }, [state.transactions]);

  // Get summary data for dashboard
  const getSummaryData = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Filter transactions for current month
    const currentMonthTransactions = state.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
    // Calculate totals
    const monthlyExpense = currentMonthTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    const monthlyIncome = currentMonthTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Get category breakdown for expenses
    const categoryBreakdown = {};
    currentMonthTransactions
      .filter(t => t.amount < 0)
      .forEach(transaction => {
        const categoryId = transaction.categoryId || 'other';
        if (!categoryBreakdown[categoryId]) {
          categoryBreakdown[categoryId] = 0;
        }
        categoryBreakdown[categoryId] += Math.abs(transaction.amount);
      });
    
    // Format for pie chart
    const categoryData = Object.entries(categoryBreakdown).map(([categoryId, amount]) => {
      const category = CATEGORIES_ARRAY.find(cat => cat.id === categoryId) || CATEGORIES.OTHER;
      return {
        name: category.name,
        value: amount,
        color: category.color
      };
    });
    
    // Get recent transactions
    const recentTransactions = [...state.transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    
    return {
      monthlyExpense,
      monthlyIncome,
      balance: monthlyIncome - monthlyExpense,
      categoryData,
      recentTransactions
    };
  };

  // Actions
  const addTransaction = (transaction) => {
    // Default category for income
    if (transaction.amount > 0 && !transaction.categoryId) {
      transaction.categoryId = 'income';
    }
    
    // Default category for expense if not provided
    if (transaction.amount < 0 && !transaction.categoryId) {
      transaction.categoryId = 'other';
    }
    
    const newTransaction = {
      id: uuidv4(),
      ...transaction,
      timestamp: new Date().toISOString()
    };

    dispatch({
      type: 'ADD_TRANSACTION',
      payload: newTransaction
    });
  };

  const deleteTransaction = (id) => {
    dispatch({
      type: 'DELETE_TRANSACTION',
      payload: id
    });
  };

  const updateTransaction = (transaction) => {
    dispatch({
      type: 'UPDATE_TRANSACTION',
      payload: transaction
    });
  };

  return (
    <TransactionContext.Provider value={{
      transactions: state.transactions,
      loading: state.loading,
      error: state.error,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      getSummaryData,
      categories: CATEGORIES_ARRAY
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

// Custom hook for using transaction context
export const useTransactions = () => useContext(TransactionContext);

export default TransactionContext;