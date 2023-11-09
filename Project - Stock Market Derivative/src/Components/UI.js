import React, { useState } from 'react';
import './UI.css'; // Import your custom CSS for styling
import Order from './Order';


const UI = (props) => {
  const [formData, setFormData] = useState({
    index: 'BANKNIFTY',
    expiry: 'Select',
    transactionType: '',
    optionType: '',
    strikePrice: '',
    orderTime: '',
    stopLoss: '25',
    reEntry: '3',
    priceType: 'MARKET',
    limitPrice: '',
    lotSize: 1,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const indexOptions = ['BANKNIFTY', 'NIFTY'];
  const transactionTypeOptions = ['BUY', 'SELL'];
  const optionTypeOptions = ['CE', 'PE'];

  // Define expiry options based on the selected index
  const expiryOptions =
    formData.index === 'BANKNIFTY'
      ? [
        '11OCT2023',
        '18OCT2023',
        '26OCT2023',
        '01NOV2023',
        '08NOV2023',
        '30NOV2023',
        '28DEC2023'
      ]
      : formData.index === 'NIFTY'
        ? [
          
          '12OCT2023',
          '19OCT2023',
          '26OCT2023',
          '02NOV2023',
          '09NOV2023',
          '30NOV2023',
          '28DEC2023'
        ]
        : [];

  // Define strike price options based on the selected index
  const strikePriceOptions =
    formData.index === 'BANKNIFTY'
      ? Array.from({ length: 41 }, (_, i) => 42000 + i * 100)
      : formData.index === 'NIFTY'
        ? Array.from({ length: 61 }, (_, i) => 18000 + i * 50)
        : [];

  const PlaceOrder = async () => {
    props.showAlert('Processing Your order...', 'primary');
    try {
      const url = `http://127.0.0.1:5000/test`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        props.showAlert('Network response was not OK', 'danger');
        throw new Error('Network response was not OK');
      }

      const responseData = await response.json();
      console.log(responseData);

      if (!responseData.Status) {
        props.showAlert(responseData.message, 'danger');
      } else {
        props.showAlert(responseData.message, 'success');
      }
      props.addOrder(formData);
      
    } catch (err) {
      console.log(err.message);
      props.showAlert(err.message, 'danger');
    }
  };

  const lotSizeInfo =
    formData.index === 'BANKNIFTY' ? '1 Lot = 15 Qty' : '1 Lot = 50 Qty';

  return (
    <div className="option-form my-4">
      <h1 className="form-title">Options Trading </h1>
      <div className="form-row">
        <div className="input-group">
          <label className="input-label">Index</label>
          <select
            className="styled-select"
            name="index"
            value={formData.index}
            onChange={handleInputChange}
          >
            {indexOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label className="input-label">Expiry</label>
          <select
            className="styled-select"
            name="expiry"
            value={formData.expiry}
            onChange={handleInputChange}
          >
            {expiryOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label className="input-label">Option Strike</label>
          <select
            className="styled-select"
            name="strikePrice"
            value={formData.strikePrice}
            onChange={handleInputChange}
          >
            {strikePriceOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label className="input-label">
            Lot Size <span className="lot-size-info">({lotSizeInfo})</span>
          </label>
          <input
            className="number-input"
            type="number"
            name="lotSize"
            value={formData.lotSize}
            onChange={handleInputChange}
            min={1}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="input-group">
          <label className="input-label">Option Type</label>
          <select
            className="styled-select"
            name="optionType"
            value={formData.optionType}
            onChange={handleInputChange}
          >
            {optionTypeOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label className="input-label">Transaction Type</label>
          <select
            className="styled-select"
            name="transactionType"
            value={formData.transactionType}
            onChange={handleInputChange}
          >
            {transactionTypeOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label className="input-label">Order Time</label>
          <input
            className="styled-input"
            type="time"
            name="orderTime"
            value={formData.orderTime}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-group">
          <label className="input-label">ReEntry</label>
          <input
            className="number-input"
            type="number"
            name="reEntry"
            value={formData.reEntry}
            onChange={handleInputChange}
            min={1}
            max={10}
          />
        </div>
      </div>


      <div className="form-row">
        <div className="input-group">
          <label className="input-label">Price</label>
          <select
            className="styled-select"
            name="priceType"
            value={formData.priceType}
            onChange={handleInputChange}
          >
            <option value="MARKET">MARKET</option>
            <option value="LIMIT">LIMIT</option>
          </select>
        </div>

        <div className="input-group">
          {formData.priceType === 'LIMIT' ? (
            <div className="limit-input-container">
              <input
                className="limit-input"
                type="text"
                name="limitPrice"
                value={formData.limitPrice}
                onChange={handleInputChange}
                placeholder="Enter Limit Price"
              />
            </div>
          ) : null}
        </div>
      
        <div className="input-group">
          <label className="input-label">Stop Loss (%)</label>
          <input
            className="number-input"
            type="number"
            name="stopLoss"
            value={formData.stopLoss}
            onChange={handleInputChange}
            min={1}
            max={100}
          />
        </div>
      </div>

      <button className="submit-button" onClick={PlaceOrder}>
        Submit
      </button>
    </div>
  );
};

export default UI;




/*
const UI = (props) => {
  const [formData, setFormData] = useState({
    index: 'BANKNIFTY',
    expiry: '13SEP2023',
    transactionType: '',
    optionType: '',
    strikePrice: '',
    orderTime: '',
    stopLoss: '',
    reEntry: '',
    priceType: 'MARKET',
    limitPrice: '',
    lotSize: 1,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const indexOptions = ['BANKNIFTY', 'NIFTY'];
  const transactionTypeOptions = ['BUY', 'SELL'];
  const optionTypeOptions = ['CE', 'PE'];

  // Define expiry options based on the selected index
  const expiryOptions =
    formData.index === 'BANKNIFTY'
      ? [
          '13SEP2023',
          '20SEP2023',
          '28SEP2023',
          '04OCT2023',
          '11OCT2023',
          '26OCT2023',
          '30NOV2023',
          '28DEC2023',
        ]
      : formData.index === 'NIFTY'
      ? [
          '14SEP2023',
          '21SEP2023',
          '28SEP2023',
          '05OCT2023',
          '12OCT2023',
          '26OCT2023',
          '30NOV2023',
          '28DEC2023',
        ]
      : [];

  // Define strike price options based on the selected index
  const strikePriceOptions =
    formData.index === 'BANKNIFTY'
      ? Array.from({ length: 41 }, (_, i) => 42000 + i * 100)
      : formData.index === 'NIFTY'
      ? Array.from({ length: 61 }, (_, i) => 18000 + i * 50)
      : [];

  const PlaceOrder = async () => {
    props.showAlert('Processing Your order...', 'primary');
    try {
      const url = `http://127.0.0.1:5000/PlaceOrder`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        props.showAlert('Network response was not OK', 'danger');
        throw new Error('Network response was not OK');
      }

      const responseData = await response.json();
      console.log(responseData);

      if (!responseData.Status) {
        props.showAlert(responseData.message, 'danger');
      } else {
        props.showAlert(responseData.message, 'success');
      }
    } catch (err) {
      console.log(err.message);
      props.showAlert(err.message, 'danger');
    }
  };
  const lotSizeInfo =
  formData.index === 'BANKNIFTY' ? '1 Lot = 15 Qty' : '1 Lot = 50 Qty';

  return (
    <div className="option-form my-4">
      <h1 className="form-title">Options Trading Form</h1>
      <div className="form-row">
        <div className="input-group">
          <label className="input-label">Index</label>
          <select
            className="styled-select"
            name="index"
            value={formData.index}
            onChange={handleInputChange}
          >
            {indexOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label className="input-label">Expiry</label>
          <select
            className="styled-select"
            name="expiry"
            value={formData.expiry}
            onChange={handleInputChange}
          >
            {expiryOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="input-group">
          <label className="input-label">Option Strike</label>
          <select
            className="styled-select"
            name="strikePrice"
            value={formData.strikePrice}
            onChange={handleInputChange}
          >
            {strikePriceOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Order Time</label>
          <input
            className="styled-input"
            type="time"
            name="orderTime"
            value={formData.orderTime}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="input-group">
          <label className="input-label">Option Type</label>
          <select
            className="styled-select"
            name="optionType"
            value={formData.optionType}
            onChange={handleInputChange}
          >
            {optionTypeOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Transaction Type</label>
          <select
            className="styled-select"
            name="transactionType"
            value={formData.transactionType}
            onChange={handleInputChange}
          >
            {transactionTypeOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="input-group">
          <label className="input-label">ReEntry</label>
          <input
            className="number-input"
            type="number"
            name="reEntry"
            value={formData.reEntry}
            onChange={handleInputChange}
            min={1}
            max={10}
          />
        </div>
        <div className="input-group">
          <label className="input-label">
            Lot Size <span className="lot-size-info">({lotSizeInfo})</span>
          </label>
          <input
            className="number-input"
            type="number"
            name="lotSize"
            value={formData.lotSize}
            onChange={handleInputChange}
            min={1}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="input-group">
          <label className="input-label">Stop Loss (%)</label>
          <input
            className="number-input"
            type="number"
            name="stopLoss"
            value={formData.stopLoss}
            onChange={handleInputChange}
            min={1}
            max={100}
          />
        </div>
      

      
        <div className="input-group">
          <label className="input-label">Price</label>
          <select
            className="styled-select"
            name="priceType"
            value={formData.priceType}
            onChange={handleInputChange}
          >
            <option value="MARKET">MARKET</option>
            <option value="LIMIT">LIMIT</option>
          </select>
          {formData.priceType === 'LIMIT' && (
            <input
              className="styled-input"
              type="text"
              name="limitPrice"
              value={formData.limitPrice}
              onChange={handleInputChange}
              placeholder="Enter Limit Price"
            />
          )}
        </div>
      </div>

      
      <button className="submit-button" onClick={PlaceOrder}>
        Submit
      </button>
    </div>
  );
};

export default UI;
*/
