import React, { useEffect, useState } from 'react';
import UserPool from '../Utils/UserPool';
import { useLocation, useNavigate } from 'react-router-dom';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import './Otp.css';

const Otp = () => {
    const [otp, setOtp] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state.email;
    const name = location.state.name;
    const userId = location.state.userId;
    const password = location.state.password;
    useEffect(() => {
        console.log(email);
    }, [email]);
    const handleChange = (e) => {
        const { value } = e.target;
        setOtp(value);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const user = new CognitoUser({
            Username: email,
            Pool: UserPool,
        });
        user.confirmRegistration(otp, true, (err, result) => {
            if (err) console.error(err);
            console.log(result);
        })
            const authDetails = new AuthenticationDetails({
                Username:email,
                Password:password
            });
            user.authenticateUser(authDetails,{
                onSuccess:(data)=>{
                    console.log('onSuccess:',data);
                    navigate('/profile-pic', {state: {name: name, userId: userId, email: email}});
                },
                onFailure:(err)=>{
                    console.error('onFailure:',err);
                },
                newPasswordRequired:(data)=>{
                    console.log('newPasswordRequired:',data);
                }
            });

       

    };

    return (
        <div className='otp-container'>
            <h1>Enter 6-digit OTP</h1>
            <input
                type="text"
                value={otp}
                onChange={handleChange}
                maxLength={6}
            />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default Otp;