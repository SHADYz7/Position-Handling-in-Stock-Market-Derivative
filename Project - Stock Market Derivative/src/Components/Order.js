import React, { useState, useEffect } from 'react';
import './Order.css';
import io from 'socket.io-client';

const Order = (props) => {
  const { orders } = props;

  const [realTimeData, setRealTimeData] = useState({});

  useEffect(() => {
    const socket = io('http://localhost:5000');  // Replace with your backend URL
    socket.on('real-time-data', (data) => {
      setRealTimeData(data);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);


  return (
    <div>
      <h1 className="orders-title">Order History</h1>
      <p>Current Price: {realTimeData.current_price}</p>
      <p>Unrealized Gain: {realTimeData.unrealized_gain}</p>
      <p>Total Gain: {realTimeData.total_gain}</p>
      <table className="order-table">
        <thead>
          <tr>
            <th>Index</th>
            <th>Expiry</th>
            <th>Transaction Type</th>
            <th>Option Type</th>
            <th>Strike Price</th>
            <th>Order Time</th>
            <th>Stop Loss</th>
            <th>ReEntry</th>
            <th>Price Type</th>
            <th>Limit Price</th>
            <th>Lot Size</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{order.index}</td>
              <td>{order.expiry}</td>
              <td>{order.transactionType}</td>
              <td>{order.optionType}</td>
              <td>{order.strikePrice}</td>
              <td>{order.orderTime}</td>
              <td>{order.stopLoss}</td>
              <td>{order.reEntry}</td>
              <td>{order.priceType}</td>
              <td>{order.limitPrice}</td>
              <td>{order.lotSize}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Order;
