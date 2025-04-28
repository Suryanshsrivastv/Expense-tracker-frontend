import React, { useState } from 'react';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionList from '../components/transactions/TransactionList';
import MonthlyExpenseChart from '../components/charts/MonthlyExpenseChart';
import { useTransactions } from '../contexts/TransactionContext';

const TransactionsPage = () => {
  const { transactions } = useTransactions();
  const [editTransaction, setEditTransaction] = useState(null);
  
  const totals = transactions.reduce((acc, transaction) => {
    if (transaction.amount < 0) {
      acc.expenses += Math.abs(transaction.amount);
    } else {
      acc.income += transaction.amount;
    }
    return acc;
  }, { income: 0, expenses: 0 });
  
  const balance = totals.income - totals.expenses;
  
  return (
    <div className="transactions-page">
      <div className="summary-cards">
        <div className={`summary-card ${balance >= 0 ? 'positive' : 'negative'}`}>
          <h3>Current Balance</h3>
          <p className="amount">${balance.toFixed(2)}</p>
        </div>
        <div className="summary-card income">
          <h3>Total Income</h3>
          <p className="amount">${totals.income.toFixed(2)}</p>
        </div>
        <div className="summary-card expense">
          <h3>Total Expenses</h3>
          <p className="amount">${totals.expenses.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="main-content">
        <div className="left-panel">
          <TransactionForm 
            editTransaction={editTransaction} 
            setEditTransaction={setEditTransaction} 
          />
          <MonthlyExpenseChart />
        </div>
        
        <div className="right-panel">
          <TransactionList setEditTransaction={setEditTransaction} />
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;