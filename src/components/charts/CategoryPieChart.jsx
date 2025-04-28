import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { useTransactions } from '../../contexts/TransactionContext';

const CategoryPieChart = () => {
  const { getSummaryData } = useTransactions();
  const { categoryData } = getSummaryData();

  // Format the amount in the tooltip
  const formatTooltip = (value) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="chart-container">
      <h3>Expenses by Category</h3>
      
      {categoryData.length === 0 ? (
        <p className="no-data">No expense data available. Add transactions to see category breakdown.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={formatTooltip} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CategoryPieChart;