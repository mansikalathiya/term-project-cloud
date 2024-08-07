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
      accessKeyId: "ASIAUKODNLRUGXY6HSEH" ,
      secretAccessKey: "ypycQK6FleUxGjfDRo86vaIvwqMjSJcvlP30mNKP",
      sessionToken: "IQoJb3JpZ2luX2VjEBMaCXVzLXdlc3QtMiJHMEUCIQDdBeMeEn7qhqOvaGbkiJRgqcvtj+JvioC9IIQsZL97wgIgZfzLXI4o1N0drkuD5PYVXWEcit8ptEOXFJaKc4ddk3cqsgII/P//////////ARAAGgwyOTcyOTk0MzQ2MDAiDOvEX9LKtxCHLZvPpCqGAoEzrRsFuKwuLNc5IGEC1L7n/HJ2Uic1E4BNyj/KF2bKgrBg46oHn0yzIHzJWC9LVHEOVM6QsDtTXgzDrgK5RRc4sjCvfKUAfJscF83ZwsE6b07IhQixplP648BckTdzJGEbsVYKsJDWtxmrtoz1ZsaPbDggGgVHMnnmvVmMl10BpQssaBuEFAZaJngPMJj2dicf1++PryhAjdyn/MEDIwo/YBx0qBXbyPCYaqWDY/NlYoBJz7jOzgw4XNyVteaK3mTlfUcg2duiHnQnmM8q+/QJa9O35AQDPeklMcWGCI1gzy/EhuKhzubDz1MgDvwfu3V8C8l1pkClfxjJWOKPNe0bEcuSBVYwrrnLtQY6nQH9ncR7VZkgSmoW/tDX3kZaOGpOQB9wfYSesyr2Wh7ud2NDDwd4ewEamioID2plj+uYaFI8qJFbpJIjMBSZ3cm6b/TXUiEENcfZ7156lMJfRknsNO/kwlqP4sj4jyPIk54zqHvlcuqjWhgoc4hqWvmVza9sIdlq/0w2DvgrG7JxjqAyj+2GTscJ6djuGaNGun3dj+wfHoU1sluid3Si",
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