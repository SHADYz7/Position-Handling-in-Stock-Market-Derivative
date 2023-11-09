import React, { useState } from 'react';
import './ContactUs.css'; // Import the CSS file for styling

function ContactUs(props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    attachment: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAttachment = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      attachment: file,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement form submission logic here
    console.log('Form Data:', formData);
    setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        attachment: null,
      });
      props.showAlert("Thank You For Contacting Us.We Will Respond You in 2 Working Days.","success");
    // You can send the data to your server for further processing
  };

  return (
    <div className="contact-us">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <input
            type="file"
            name="attachment"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleAttachment}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ContactUs;
