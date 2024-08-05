import React, { useEffect, useState, useContext } from 'react';
import { useNavigate , useLocation} from 'react-router-dom';
import UserPool from '../Utils/UserPool';
import  axios from 'axios';
import './ProfilePic.css';
import { AuthContext } from '../context/AuthContext';


const ProfilePic = () => {
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const [selectedImage, setSelectedImage] = useState(null);
    const [base64Image, setBase64Image] = useState(''); 
    const [token,setToken] = useState('');
    const location = useLocation();
    const {getSession} = useContext(AuthContext);
    const email =  location.state.email;
    const name =  location.state.name;
    const userId = location.state.userId;
    
    useEffect(() => {
        getSession().then((session) => {
            setToken(session.getIdToken().getJwtToken());
        });

    })
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setBase64Image(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
            setSelectedImage(URL.createObjectURL(file));
        }
    };
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(base64Image);
        const response = await axios.post(BASE_URL + '/music/photolink', {image: base64Image},{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        console.log(response.data.url);
        const link = response.data.url;
        console.log(link);
        console.log(response);
        try{
            const data = await axios.post(BASE_URL + '/user', {email: email, name: name, id: userId, link: link},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }
            );
            console.log(data);
            navigate('/landing-page');
        }catch(err){
            console.log(err);
        }
    }

    return (
        <div className='profile-pic-container'>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {selectedImage && <img src={selectedImage} alt="Selected" style={{width: "200px"}} />}
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default ProfilePic;