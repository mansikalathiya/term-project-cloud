import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Pool from '../Utils/UserPool';
import { AuthContext } from '../context/AuthContext';

const UserInfo = () => {
  const URL = process.env.REACT_APP_API_BASE_URL;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 const [userId, setUserId] = useState(null);
  const { getSession } = useContext(AuthContext);
  const [token, setToken] = useState('');

  // console.log("mansi",userId); 

  
  useEffect(() => {
    getSession().then((session) => {
      setUserId(session.idToken.payload.sub);
      
    })
    
    const fetchUserData = async () => {
      console.log("mansi",userId);
      try {
        const data = await getSession();
        const retrievedToken = data.getIdToken().getJwtToken();
        setToken(retrievedToken);
        const response = await axios.post(URL+`/user/photo`, {userId: userId},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + retrievedToken
          }
        }

        );
        console.log("mansi",userId);
        console.log(response.data.body);
        setUserData(response.data.body);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!userData) return <div>No user data found</div>;

  return (
    // <div>
    //   hii
    // </div>
    <div className="user-profile" style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem"
    }}>
      <img 
        src={userData.link || 'https://via.placeholder.com/150'} 
        alt={`${userData.name}'s profile`}
        className="profile-picture"
        style={{width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover"}}
      />
      <h4 style={{color: "white"}}>{userData.name}</h4>
      <p style={{fontSize: "0.5rem", color: "white"}}>{userData.email}</p>
    </div>
  );
};

export default UserInfo;
