import React, { useState } from "react";
import Alert from "./Components/Alert";
import UI from "./Components/UI";
import Navbar from "./Components/Navbar";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Order from "./Components/Order";


import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Home from "./Components/Home";
import ContactUs from "./Components/ContactUs";


function App() {

  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1000);
  }

  const [orders, setOrders] = useState([]);

  // Function to add a new order to the list
  const addOrder = (newOrder) => {
    setOrders([...orders, newOrder]);
  };

  return (

    <BrowserRouter>

      <Navbar showAlert={showAlert} />
      <Alert alert={alert} />

      <div className="container">
        <Routes>
          <Route exact path="/" element={<Home showAlert={showAlert} />} />
          <Route exact path="/login" element={<Login showAlert={showAlert} />} />
          <Route exact path="/signup" element={<Signup showAlert={showAlert} />} />
          <Route exact path="/Contact" element={<ContactUs showAlert={showAlert} />} />
          <Route exact path="/view" element={<UI showAlert={showAlert} addOrder={addOrder}/>} />
          <Route exact path="/Orders" element={<Order orders={orders} />} />
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;
