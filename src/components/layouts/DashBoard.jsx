import React from 'react';
import { useTransactions, CATEGORIES_ARRAY } from '../../contexts/TransactionContext';
import MonthlyExpenseChart from '../charts/MonthlyExpenseChart';
import CategoryPieChart from '../charts/CategoryPieChart';

const Dashboard = () => {
  const { getSummaryData } = useTransactions();
  const { monthlyExpense, monthlyIncome, balance, recentTransactions } = getSummaryData();
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatAmount = (amount) => {
    const formattedAmount = Math.abs(amount).toFixed(2);
    const sign = amount < 0 ? '-' : '+';
    return `${sign} $${formattedAmount}`;
  };

  const getCategory = (categoryId) => {
    return CATEGORIES_ARRAY.find(cat => cat.id === categoryId) || { name: 'Uncategorized', color: '#9E9E9E' };
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Financial Overview - {currentMonth}</h2>
      </div>

      <div className="summary-cards">
        <div className={`summary-card ${balance >= 0 ? 'positive' : 'negative'}`}>
          <h3>Month Balance</h3>
          <p className="amount">${balance.toFixed(2)}</p>
        </div>
        <div className="summary-card income">
          <h3>Month Income</h3>
          <p className="amount">${monthlyIncome.toFixed(2)}</p>
        </div>
        <div className="summary-card expense">
          <h3>Month Expenses</h3>
          <p className="amount">${monthlyExpense.toFixed(2)}</p>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-wrapper">
          <MonthlyExpenseChart />
        </div>
        <div className="chart-wrapper">
          <CategoryPieChart />
        </div>
      </div>

      <div className="recent-transactions">
        <h3>Recent Transactions</h3>
        {recentTransactions.length === 0 ? (
          <p className="no-transactions">No recent transactions. Add your first transaction!</p>
        ) : (
          <div className="recent-transactions-list">
            {recentTransactions.map(transaction => {
              const category = getCategory(transaction.categoryId);
              return (
                <div key={transaction.id} className="recent-transaction-item">
                  <div className="transaction-icon" style={{ backgroundColor: category.color }}>
                    {category.name.charAt(0)}
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-top">
                      <span className="transaction-description">{transaction.description}</span>
                      <span className={`transaction-amount ${transaction.amount < 0 ? 'expense-amount' : 'income-amount'}`}>
                        {formatAmount(transaction.amount)}
                      </span>
                    </div>
                    <div className="transaction-bottom">
                      <span className="transaction-category">{category.name}</span>
                      <span className="transaction-date">{formatDate(transaction.date)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;