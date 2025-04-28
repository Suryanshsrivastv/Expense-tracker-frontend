import React, { useState } from 'react';
import { useTransactions, CATEGORIES_ARRAY } from '../../contexts/TransactionContext';
import TransactionItem from './TransactionItem';

const TransactionList = ({ setEditTransaction }) => {
  const { transactions } = useTransactions();
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Sort transactions
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Filter transactions based on search term and category
  const filteredTransactions = sortedTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || transaction.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="transaction-list-container">
      <h3>Transaction History</h3>
      
      <div className="transaction-list-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-filter"
          >
            <option value="all">All Categories</option>
            {CATEGORIES_ARRAY.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {filteredTransactions.length === 0 ? (
        <p className="no-transactions">No transactions found. Add your first transaction using the form above!</p>
      ) : (
        <div className="transaction-table-container">
          <table className="transaction-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('date')}>
                  Date {sortConfig.key === 'date' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('description')}>
                  Description {sortConfig.key === 'description' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('categoryId')}>
                  Category {sortConfig.key === 'categoryId' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('amount')}>
                  Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
                <TransactionItem 
                  key={transaction.id} 
                  transaction={transaction}
                  setEditTransaction={setEditTransaction}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionList;