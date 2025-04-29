import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/AdminDashboard.css";

const FinancialTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3030/api/admin/transactions")
      .then(response => setTransactions(response.data))
      .catch(error => console.error("Error fetching transactions:", error));
  }, []);

  return (
    <div className="management-section">
      <h2>Financial Transactions</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.orderId}</td>
                <td>${transaction.amount.toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${transaction.status === 'completed' ? 'active' : 'inactive'}`}>
                    {transaction.status}
                  </span>
                </td>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialTransactions;
