import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Post from './Post';
import { Button, Modal, Input } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ImageUpload from './ImageUpload';


const BASE_URL = 'http://localhost:8000/';
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

const useStyles = makeStyles({
  paper: {
    background: '#fff',
    position: 'absolute',
    width: 400,
    border: '2px solid #000',
    padding: '0 30px',
  }
})

function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [modalStyle, setModalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [authTokenType, setAuthTokenType] = useState(localStorage.getItem('authTokenType') || null);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');

  // useEffect(() => {
  //   setAuthToken(localStorage.getItem('authToken'));
  //   setAuthTokenType(localStorage.getItem('authTokenType'));
  //   setUsername(localStorage.getItem('username'));
  //   setUserId(localStorage.getItem('userId'));
  // }, [])


  useEffect(() => {
    authToken
      ? localStorage.setItem('authToken', authToken)
      : localStorage.removeItem('authToken')
    authTokenType
      ? localStorage.setItem('authTokenType', authTokenType)
      : localStorage.removeItem('authTokenType')
    username
      ? localStorage.setItem('username', username)
      : localStorage.removeItem('username')
    userId
      ? localStorage.setItem('userId', userId)
      : localStorage.removeItem('userId')
  }, [authToken, authTokenType, userId])

  useEffect(() => {
    fetch(BASE_URL + 'post/posts')
      .then(response => {
        const data = response.json()
        console.log(data);
        if (response.ok) {
          return data
        }
        throw response
      })
      .then(data => {
        const result = data.sort((a, b) => {
          const t_a = a.timestamp.split(/[-T:]/);
          const t_b = a.timestamp.split(/[-T:]/);
          const d_a = new Date(Date.UTC(t_a[0], t_a[1] - 1, t_a[2], t_a[3], t_a[4], t_a[5]));
          const d_b = new Date(Date.UTC(t_b[0], t_b[1] - 1, t_b[2], t_b[3], t_b[4], t_b[5]));
          return d_b - d_a
        })
        return result
      })
      .then(data => {
        setPosts(data)
      })
      .catch(error => {
        console.log(error);
      })
  }, [])

  const singIn = (event) => {
    event?.preventDefault();

    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    const requestOptions = {
      method: 'POST',
      body: formData
    }
    fetch(BASE_URL + 'login', requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(data => {
        console.log(data);
        setAuthToken(data.access_token)
        setAuthTokenType(data.token_type)
        setUserId(data.user_id)
        setUsername(data.username)
      })
      .catch(error => {
        console.log(error);
      })

    setOpenSignIn(false);
  }

  const signOut = (event) => {
    setAuthToken(null)
    setAuthTokenType(null)
    setUserId('')
    setUsername('')
  }

  const singUp = (event) => {
    event.preventDefault();

    const json_string = JSON.stringify({
      username: username,
      email: email,
      password: password
    })
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json_string
    }
    fetch(BASE_URL + 'user/', requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response
      })
      .then(data => {
        singIn();
      })
      .catch(err => {
        console.log(err)
      })
    setOpenSignUp(false);
  }

  return (
    <>
      <div className="app">
        <Modal
          open={openSignIn}
          onClose={() => setOpenSignIn(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form action="" className='app_signin'>
              <center>
                <img src="https://qph.cf2.quoracdn.net/main-qimg-eacf53df9228c901832a8fa98e84f10c.webp" alt="" className="app_headerImage" />
              </center>
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)} />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} />
              <Button
                type="submit"
                onClick={singIn}>Login</Button>
            </form>
          </div>
        </Modal>
        <Modal
          open={openSignUp}
          onClose={() => setOpenSignUp(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form action="" className='app_signin'>
              <center>
                <img src="https://qph.cf2.quoracdn.net/main-qimg-eacf53df9228c901832a8fa98e84f10c.webp" alt="" className="app_headerImage" />
              </center>
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)} />
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)} />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} />
              <Button
                type="submit"
                onClick={singUp}>SingUp</Button>
            </form>
          </div>
        </Modal>

        <div className="app_header">
          <img src="https://qph.cf2.quoracdn.net/main-qimg-eacf53df9228c901832a8fa98e84f10c.webp" alt="inst" className="app_headerImage" />
          {
            authToken
              ? (<Button onClick={() => signOut()}>LogOut</Button>)
              : (<div>
                <Button onClick={() => setOpenSignIn(true)}>SignIn</Button>
                <Button onClick={() => setOpenSignUp(true)}>SignUp</Button>
              </div>)
          }

        </div>
      </div>
      <div className="app_posts">
        {
          posts.map(post => (
            <Post
              post={post}
              authTokenType={authTokenType}
              authToken={authToken}
              username={username}
            />
          ))
        }
      </div>
      {
        authToken
          ? (<ImageUpload 
              authToken={authToken} 
              authTokenType={authTokenType} 
              userId={userId} />)
          : (<h3>Login to upload!</h3>)
      }
    </>
  )
}

export default App
