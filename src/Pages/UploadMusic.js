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
      accessKeyId: "ASIAUKODNLRUCHVD66NZ" ,
      secretAccessKey: "9fikza6+hifUDjVzdRe7kCQmqprR5Bw0bZ89Xb4v",
      sessionToken: "IQoJb3JpZ2luX2VjEAwaCXVzLXdlc3QtMiJHMEUCICENCv3oSD023P1uxibHR5Jb88BWPCmvnZXjsD2mo4qJAiEA04yVMyMKfrzWT0jsGRCu2z6oRNSu2RV3aKSF81qUXwcqqQIIFRAAGgwyOTcyOTk0MzQ2MDAiDDkdoYjtBlAeC46zryqGAkvemzLxZq+sRFlf+nT25w5ACXP1J3ys3Efwfvds4jfYrf/MuJnKJSAbz11b+we1yJBZ+qRWyYvhSp0R+mkrJMqMOub56QihoN+zEZmO812rhotGURgiF87vMczS6ctril+GBXNQl8KlSh0HbWuKOZxSLIV4OjfKpZjyp5Eh6bn8P6OJ1vwgnreTXgJ9TJL5Zl+KKH2ha8cWxEHnry1Gm1T/LP/ICTnVjMG0L0lAmIkL9jlUzkNSyNwJ3oDuRW4OOdXiP3UeGGCqoxB/OD02i15BnVeGLlfscrwAM63yoYYUoKNGbnVW1SDiCWo9RbLZ+tvqFJH1tST2BWcstg2CHuIAlOZWcVUw1pmCtgY6nQG2Y76Pp6oQ8+12urGgjgkLv8DbYrtOTHezwX95GEH3abY08wmt6ezLMEOls6VkqcsNE/NVht+CBRKz6RmjHMifNRsXH/xRuNr2SvI5W7Ajhp+41bf7VM+sq1MpFBlmvBQhCYbaaSQwMackAz/g3y3hKxDSqJdvGG5D0Rs4P3ZxLOUiAdMileB5pWaMEufrizGZ57eHwldPfMRfq44O",
      region: 'us-east-1'
    });

    const videoParams = {
      Bucket: "b00979173-mansimusic",
      Key: file.name,
      Body: file,
    };

    const thumbnailParams = {
      Bucket: process.env.REACT_APP_S3_BUCKET,
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