import React, { useState, useEffect } from 'react';
import './Post.css';
import { Avatar, Button } from '@mui/material';


const BASE_URL = 'http://localhost:8000/'

export default function Post({ post, authTokenType, authToken, username }) {
    const [imageUrl, setImageUrl] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        if (post.image_url_type == 'absolute') {
            setImageUrl(post.image_url)
        } else {
            setImageUrl(BASE_URL + post.image_url)
        }
    }, [])

    useEffect(() => {
        setComments(post.comments)
    }, [])

    const handlePostDelete = (event) => {
        event?.preventDefault();
        const requestOptions = {
            method: 'GET',
            headers: new Headers({
                'Authorization': authTokenType + " " + authToken,
            }),
        }
        console.log(requestOptions)
        fetch(BASE_URL + 'post/delete/' + post.id, requestOptions)
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                }
                throw response
            })
            .catch(err => {
                console.log(err);
            })
    }

    const handlePostComment = (event) => {
        event?.preventDefault();
        const json_string = JSON.stringify({
            'username': username,
            'text': newComment,
            'post_id': post.id
        })
        const requestOptions = {
            method: 'POST',
            headers: new Headers({
                'Authorization': authTokenType + " " + authToken,
                'Content-Type': 'application/json'
            }),
            body: json_string
        }

        fetch(BASE_URL + 'comment', requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json();
                }
            })
            .then(data => {
                fetchComments();
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                setNewComment('');
            })
    }

    const fetchComments = () => {
        fetch(BASE_URL + 'comment/all-comments/' + post.id)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw response
            })
            .then(data => {
                setComments(data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <div className='post'>
            <div className="post_header">
                <Avatar
                    alt="Bo"
                />
                <div className="post_headerInfo">
                    <h4>{post.user.username}</h4>
                    <Button className='post_delete' onClick={handlePostDelete}>Delete</Button>
                </div>

            </div>
            <img
                className='post_image'
                src={imageUrl}
            />
            <h4 className='post_text'>{post.caption}</h4>
            <div className="post_comment">
                {comments.map(comment => (
                    <p><strong>{comment.username}:</strong> {comment.text}</p>
                ))}
            </div>
            {   
                authToken
                && (
                    <form className='post_commentbox'>
                        <input
                            className='post_input'
                            type='text'
                            placeholder='Add comment'
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)} />
                        <button
                            className='post_button'
                            type='submit'
                            disabled={!newComment}
                            onClick={handlePostComment}>Post</button>
                    </form>
                )
}
                
        </div>
    )
}