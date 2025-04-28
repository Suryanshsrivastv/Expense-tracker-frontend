import React from 'react';
import { useTransactions, CATEGORIES_ARRAY } from '../../contexts/TransactionContext';

const TransactionItem = ({ transaction, setEditTransaction }) => {
  const { deleteTransaction } = useTransactions();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
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

  const category = getCategory(transaction.categoryId);

  const handleEdit = () => {
    setEditTransaction(transaction);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(transaction.id);
    }
  };

  return (
    <tr className={`transaction-item ${transaction.amount < 0 ? 'expense' : 'income'}`}>
      <td>{formatDate(transaction.date)}</td>
      <td>{transaction.description}</td>
      <td>
        <span 
          className="category-badge" 
          style={{ backgroundColor: category.color }}
        >
          {category.name}
        </span>
      </td>
      <td className={transaction.amount < 0 ? 'expense-amount' : 'income-amount'}>
        {formatAmount(transaction.amount)}
      </td>
      <td className="action-buttons">
        <button onClick={handleEdit} className="edit-btn">Edit</button>
        <button onClick={handleDelete} className="delete-btn">Delete</button>
      </td>
    </tr>
  );
};

export default TransactionItem;