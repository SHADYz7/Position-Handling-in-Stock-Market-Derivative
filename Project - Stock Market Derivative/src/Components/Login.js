import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login(props) {
    const navigate = useNavigate()
    const [data, setData] = useState({ email: "", password: "" });

    const onChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const HandleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = "http://localhost:5001/login"
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: data.email, password: data.password }), // body data type must match "Content-Type" header
            });

            const resjson = await response.json();
            console.log(resjson);

            if (resjson.Status) {
                localStorage.setItem('token', "Login")
                navigate("/")
                props.showAlert("Logged in Successfully", "success")
            }
            else {
                props.showAlert("Fail to Loggedin.Check Your Credentials", "danger")
            }
        }
        catch (err) {
            props.showAlert("Internal Server Error.Try after Sometime", "danger")
        }
    }
    return (
        <>
            <div>
                <form onSubmit={HandleSubmit}>

                <div className="text-center">
                    <div className="form-outline mb-4">
                        <input type="email" value={data.email} id="email" name='email' placeholder='Email address' onChange={onChange} className="form-control" required />
                    </div>

                    <div className="form-outline mb-4">
                        <input type="password" value={data.password} id="password" name='password' placeholder='Password' onChange={onChange} className="form-control" minLength={5} required />
                    </div>

                    
                        <input type="submit" className="btn btn-primary" value="Login" />
                    </div>

                </form>
            </div>
        </>
    )
}
