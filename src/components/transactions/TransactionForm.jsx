import React, { useState, useEffect } from 'react';
import { useTransactions, CATEGORIES } from '../../contexts/TransactionContext';

const TransactionForm = ({ editTransaction, setEditTransaction }) => {
  const { addTransaction, updateTransaction, categories } = useTransactions();
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().substr(0, 10),
    description: '',
    type: 'expense',
    categoryId: 'other'
  });
  const [errors, setErrors] = useState({});

  // If in edit mode, populate form with transaction data
  useEffect(() => {
    if (editTransaction) {
      setFormData({
        amount: Math.abs(editTransaction.amount).toString(),
        date: editTransaction.date,
        description: editTransaction.description,
        type: editTransaction.amount < 0 ? 'expense' : 'income',
        categoryId: editTransaction.categoryId || (editTransaction.amount < 0 ? 'other' : 'income')
      });
    }
  }, [editTransaction]);

  const filteredCategories = categories.filter(category => {
    if (formData.type === 'income') {
      return category.id === 'income';
    } else {
      return category.id !== 'income';
    }
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      categoryId: formData.type === 'income' ? 'income' : (prev.categoryId === 'income' ? 'other' : prev.categoryId)
    }));
  }, [formData.type]);

  const validateForm = () => {
    let tempErrors = {};
    let formIsValid = true;

    if (!formData.amount) {
      tempErrors.amount = "Amount is required";
      formIsValid = false;
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      tempErrors.amount = "Please enter a valid positive number";
      formIsValid = false;
    }

    if (!formData.date) {
      tempErrors.date = "Date is required";
      formIsValid = false;
    }

    if (!formData.description.trim()) {
      tempErrors.description = "Description is required";
      formIsValid = false;
    }

    if (!formData.categoryId) {
      tempErrors.categoryId = "Category is required";
      formIsValid = false;
    }

    setErrors(tempErrors);
    return formIsValid;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const transactionData = {
        amount: formData.type === 'expense' 
          ? -Math.abs(parseFloat(formData.amount)) 
          : Math.abs(parseFloat(formData.amount)),
        date: formData.date,
        description: formData.description,
        categoryId: formData.categoryId
      };

      if (editTransaction) {
        updateTransaction({
          ...transactionData,
          id: editTransaction.id
        });
        setEditTransaction(null);
      } else {
        addTransaction(transactionData);
      }

      // Reset form
      setFormData({
        amount: '',
        date: new Date().toISOString().substr(0, 10),
        description: '',
        type: 'expense',
        categoryId: 'other'
      });
    }
  };

  const cancelEdit = () => {
    setEditTransaction(null);
    setFormData({
      amount: '',
      date: new Date().toISOString().substr(0, 10),
      description: '',
      type: 'expense',
      categoryId: 'other'
    });
  };

  return (
    <div className="transaction-form-container">
      <h3>{editTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="type"
                value="expense"
                checked={formData.type === 'expense'}
                onChange={handleChange}
              />
              Expense
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="income"
                checked={formData.type === 'income'}
                onChange={handleChange}
              />
              Income
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Amount</label>
          <input
            type="text"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
          />
          {errors.amount && <span className="error">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
          {errors.date && <span className="error">{errors.date}</span>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
          />
          {errors.description && <span className="error">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="category-select"
          >
            {filteredCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <span className="error">{errors.categoryId}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editTransaction ? 'Update' : 'Add'} Transaction
          </button>
          {editTransaction && (
            <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;