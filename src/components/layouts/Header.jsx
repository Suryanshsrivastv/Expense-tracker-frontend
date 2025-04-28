import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="app-header">
      <div className="logo">
        <h1>Finance Tracker</h1>
      </div>
      <nav className="main-nav">
        <ul>
          <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/">Dashboard</Link>
          </li>
          <li className={location.pathname === '/transactions' ? 'active' : ''}>
            <Link to="/transactions">Transactions</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;