import React,{ useState, useContext } from 'react';
import AWS from 'aws-sdk';
import { useDropzone } from 'react-dropzone';
// import './VideoUploadForm.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './UploadMusic.css';


const VideoUploadForm = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL
  const { getSession } = useContext(AuthContext);

  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const [name,setName]=useState('');

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
    accept: 'music/*',
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setThumbnail(acceptedFiles[0]);
    },
  });

  const handleUpload = async () => {
    if (!file || !thumbnail || !title) {
      console.error('Please provide all required fields');
      return;
    }

    const s3 = new AWS.S3({
      accessKeyId: "ASIAUKODNLRUEYB56ALD" ,
      secretAccessKey: "fj1NwOObAKlqLS3ZBKCOg+UKi5/BExx81QNklLKU",
      sessionToken: "IQoJb3JpZ2luX2VjEPT//////////wEaCXVzLXdlc3QtMiJIMEYCIQD7icCcZdE9hC5CZgy4ZXitpvx0vinuaGAY1ui9iNMN7gIhAPdjabiXuLmnFJYTWi154fUiUlc5Hga34dfWduwx3bbQKrICCN3//////////wEQABoMMjk3Mjk5NDM0NjAwIgyQfUDV9T+a7tvRaAkqhgLyEq4sT0og3HfiQvl9fsFiDSKrCFGEJP9ZGjTRfuMdWXDbFySSCsDHfKhIaoUk7vYZ08zBktDJHAQbKADvk59f9ghZygQN9J4A0ng18Gj/TmnTwiLiufN8ffivbs60SC9kFI895iQLYzv9OAlrI6TzDoUUXzn1iitFk4J4n9vEQKreO1hot1NbltgLdOV6+VwS6AH9gidbG/UKEo++/J7Mk1K8Fbe3CD+M7sIOwFBWT9O8zNjyOjv5+wgT3nCfwl2vTZJygGMEv1ZB7lrDp96jDTvGa51SvV/Y/u0hoAu7rCtYW0kjSzZVgxzsqWLdFwPHuRfOziVP4LyBcVSqgLQPHBs5lm5eMIbkxLUGOpwBQ0lAh0T6wWgwjeGW4zbqsBVmRdHzZNEV8ik25QzMUzpXAkqPYvrhWC3izMuTqD/GqVS1XnUkdJ4bTMlusJ8Y4wWCjQNsCG3HtiRrQjDh6g6OHEjwBWAS0d0DqiWOLfcCMwkzip6gSIc9E5hYL7cWTyA9GLumu7G7NJNfUatskM9XTr924SuORRobZFPMbx6bnVZuNxwz/Eo4N19g",
      region: 'us-east-1'
    });

    const videoParams = {
      Bucket: "b00979173-mansimusic",
      Key: file.name,
      Body: file,
    };

    const thumbnailParams = {
      Bucket: "b00979173-mansimusic",
      Key: `thumbnails/${thumbnail.name}`,
      Body: thumbnail,
    };

    Promise.all([
      s3.upload(videoParams).promise(),
      s3.upload(thumbnailParams).promise(),
    ])
      .then(async(data) => {
        const token = await getSession();
        const retrievedToken = token.getIdToken().getJwtToken(); // Adjust this based on the logged structure
        const details = await axios.post(BASE_URL+`/music/upload`, {title: title, name: name, mKey: data[0].Key, tKey: data[1].Key},
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + retrievedToken
            }
          }
        );
        console.log('Music uploaded:', details);
        navigate('/landing-page');
      })
      .catch((err) => {
        console.error('Error uploading files:', err);
      });

  };

  return (
    <> 
    <div className="upload-form">
      <div className="form-group">
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
          />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
          />
      </div>
      
      <div {...getVideoRootProps()} className="dropzone">
        <input {...getVideoInputProps()} />
        {file ? (
          <div>
            <p>{file.name}</p>
            <music src={URL.createObjectURL(file)} controls />
          </div>
        ) : (
          <p>Drag and drop music file here, or click to select</p>
        )}
      </div>
      <div {...getThumbnailRootProps()} className="dropzone">
        <input {...getThumbnailInputProps()} />
        {thumbnail ? (
          <div>
            <p>{thumbnail.name}</p>
            <img src={URL.createObjectURL(thumbnail)} alt="Thumbnail" />
          </div>
        ) : (
          <p>Drag and drop thumbnail image here, or click to select</p>
        )}
      </div>
      <button onClick={handleUpload} className="upload-button">
        Upload
      </button>
    </div>
        </>
  );
};

export default VideoUploadForm;