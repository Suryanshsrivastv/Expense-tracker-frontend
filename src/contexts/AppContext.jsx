import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { transactionAPI, categoryAPI } from '../services/api';

const initialState = {
  transactions: [],
  categories: [],
  loading: false,
  error: null
};

const AppContext = createContext(initialState);

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload, loading: false };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'DELETE_TRANSACTION':
      return { 
        ...state, 
        transactions: state.transactions.filter(transaction => transaction._id !== action.payload) 
      };
    case 'UPDATE_TRANSACTION':
      return { 
        ...state, 
        transactions: state.transactions.map(transaction => 
          transaction._id === action.payload._id ? action.payload : transaction
        )
      };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload, loading: false };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'DELETE_CATEGORY':
      return { 
        ...state, 
        categories: state.categories.filter(category => category._id !== action.payload) 
      };
    case 'UPDATE_CATEGORY':
      return { 
        ...state, 
        categories: state.categories.map(category => 
          category._id === action.payload._id ? action.payload : category
        )
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'SET_LOADING' });
      try {
        const categoryRes = await categoryAPI.getAll();
        dispatch({ 
          type: 'SET_CATEGORIES', 
          payload: categoryRes.data.data 
        });
        
        const transactionRes = await transactionAPI.getAll();
        dispatch({ 
          type: 'SET_TRANSACTIONS', 
          payload: transactionRes.data.data 
        });
      } catch (err) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: err.response?.data?.error || 'Failed to fetch data'
        });
      }
    };
    
    fetchData();
  }, []);

  // Action creators
  const addTransaction = async (transaction) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await transactionAPI.create(transaction);
      dispatch({ 
        type: 'ADD_TRANSACTION', 
        payload: res.data.data 
      });
      return res.data.data;
    } catch (err) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: err.response?.data?.error || 'Failed to add transaction'
      });
      throw err;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await transactionAPI.delete(id);
      dispatch({ 
        type: 'DELETE_TRANSACTION', 
        payload: id 
      });
    } catch (err) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: err.response?.data?.error || 'Failed to delete transaction'
      });
      throw err;
    }
  };

  const updateTransaction = async (id, transaction) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await transactionAPI.update(id, transaction);
      dispatch({ 
        type: 'UPDATE_TRANSACTION', 
        payload: res.data.data 
      });
      return res.data.data;
    } catch (err) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: err.response?.data?.error || 'Failed to update transaction'
      });
      throw err;
    }
  };

  const addCategory = async (category) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await categoryAPI.create(category);
      dispatch({ 
        type: 'ADD_CATEGORY', 
        payload: res.data.data 
      });
      return res.data.data;
    } catch (err) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: err.response?.data?.error || 'Failed to add category'
      });
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await categoryAPI.delete(id);
      dispatch({ 
        type: 'DELETE_CATEGORY', 
        payload: id 
      });
    } catch (err) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: err.response?.data?.error || 'Failed to delete category'
      });
      throw err;
    }
  };

  const updateCategory = async (id, category) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await categoryAPI.update(id, category);
      dispatch({ 
        type: 'UPDATE_CATEGORY', 
        payload: res.data.data 
      });
      return res.data.data;
    } catch (err) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: err.response?.data?.error || 'Failed to update category'
      });
      throw err;
    }
  };

  return (
    <AppContext.Provider value={{
      ...state,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      addCategory,
      deleteCategory,
      updateCategory
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);