import './ImageUpload.css';
import { useState } from 'react';
import { Button } from '@mui/material';


const BASE_URL = 'http://localhost:8000/';

export default function ImageUpload({ authToken, authTokenType, userId }) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleUpload = (e) => {
        e?.preventDefault();
        const formData = new FormData();
        formData.append('image', image);
        const requestOptions = {
            method: 'POST',
            headers: new Headers({
                'Authorization': authTokenType + " " + authToken
            }),
            body: formData
        }
        fetch(BASE_URL + 'post/image', requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw response
            })
            .then(data => {
                createPost(data.filename);
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setCaption('');
                setImage(null);
                document.getElementById('fileInput').value = null
            })
    }

    const createPost = (imageUrl) => {
        const json_string = JSON.stringify({
            'image_url': imageUrl,
            'image_url_type': 'relative',
            'caption': caption,
            'creator_id': userId
        })
        const requestOptions = {
            method: 'POST',
            headers: new Headers({
                'Authorization': authTokenType + " " + authToken,
                'Content-Type': 'application/json'
            }),
            body: json_string
        }
        fetch(BASE_URL + 'post', requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw response
            })
            .then(data => {
                window.location.reload();
                window.scrollTo(0, 0);
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div className='image_upload'>
            <input
                type="text"
                placeholder='Enter a caption'
                onChange={(event) => setCaption(event.target.value)}
                value={caption}
            />
            <input
                type="file"
                id="fileInput"
                onChange={handleChange}
            />
            <Button className='image_upload_button' onClick={handleUpload}>Upload</Button>
        </div>
    )
}