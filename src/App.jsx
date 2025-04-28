import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TransactionProvider } from './contexts/TransactionContext';
import TransactionsPage from './pages/TransactionsPage';
import HomePage from './pages/HomePage';
import Header from './components/layouts/Header';
import './App.css';

function App() {
  return (
    <TransactionProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </TransactionProvider>
  );
}

export default App;