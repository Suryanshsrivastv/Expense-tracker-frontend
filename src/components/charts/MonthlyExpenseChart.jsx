import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useTransactions } from '../../contexts/TransactionContext';

const MonthlyExpenseChart = () => {
  const { transactions } = useTransactions();

  // Prepare data for the chart
  const chartData = useMemo(() => {
    // Group transactions by month and calculate totals
    const monthlyData = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = date.toLocaleString('default', { month: 'short' });
      const label = `${monthName} ${date.getFullYear()}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          name: label,
          expenses: 0,
          income: 0
        };
      }
      
      if (transaction.amount < 0) {
        monthlyData[monthYear].expenses += Math.abs(transaction.amount);
      } else {
        monthlyData[monthYear].income += transaction.amount;
      }
    });
    
    // Convert to array and sort by date
    return Object.values(monthlyData)
      .sort((a, b) => {
        const [aYear, aMonth] = a.name.split(' ');
        const [bYear, bMonth] = b.name.split(' ');
        return new Date(`${aMonth} 1, ${aYear}`) - new Date(`${bMonth} 1, ${bYear}`);
      })
      .slice(-6); // Only show last 6 months
  }, [transactions]);

  return (
    <div className="chart-container">
      <h3>Monthly Summary</h3>
      
      {chartData.length === 0 ? (
        <p className="no-data">No data available. Add transactions to see your monthly summary.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="expenses" name="Expenses" fill="#FF6B6B" />
            <Bar dataKey="income" name="Income" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MonthlyExpenseChart;