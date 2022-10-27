
// import { getSpaceUntilMaxLength } from '@testing-library/user-event/dist/utils';
import './App.css';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import app from './firebase.init';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';


const auth = getAuth(app);
function App() {
  const [registered, setRegistered] = useState(false);
  const [name, setName] = useState('');
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleNameBlur = event =>{
    setName(event.target.value);
  }

  const handleEmailBlur = event => {
    setEmail(event.target.value);
  }

  const handlePasswordBlur = event => {
    setPass(event.target.value);
  }

  const handleRegisteredChange = event => {
    setRegistered(event.target.checked);
  }

  const handleFormSubmit = event => {
    // console.log(email, pass)
    // event.preventDefault();
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {

      event.stopPropagation();
      return;
    }
    if (!/((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,})/.test(pass)) {
      // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
      setError('Must contain at least one number, one uppercase letter, one lowercase letter and at least 8 or more characters')
      return;
    }
    setValidated(true);
    setError('')

    if (registered) {
      signInWithEmailAndPassword(auth, email, pass)
        .then(result => {
          const user = result.user;
          console.log(user);
        })
        .catch(error => {
          console.error(error);
          setError(error.message);
        })

    }
    else {
      createUserWithEmailAndPassword(auth, email, pass)
        .then(result => {
          const user = result.user;
          console.log(user);
          setEmail('');
          setPass('');
          verifyEmail();
          setUserName();
        })
        .catch(error => {
          console.error(error);
          setError(error.message);
        })
    }

    event.preventDefault();
 }

 const handlePasswordReset = () =>{
    sendPasswordResetEmail(auth, email)
    .then( () =>{
      console.log('email sent')
    })
 }

 const setUserName = () =>{
  updateProfile(auth.currentUser, {
    displayName: name
  })
  .then( () =>{
    console.log('updating name')
  })
  .catch( error =>{
    setError(error.message)
  })
 }

  const verifyEmail = () =>{
    sendEmailVerification( auth.currentUser)
    .then( () =>{
      console.log('Email verification sent');
    })
  }

  return (
    <div className="form-div w-50 mx-auto mt-5">
      <h2 className='text-secondary'>PLEASE {registered ? 'LOGIN' : 'REGISTER'}!!</h2>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        { !registered && <Form.Group className="mb-3" >
          <Form.Label>Your Name</Form.Label>
          <Form.Control onBlur={handleNameBlur} type="text" placeholder="Enter Your Name" required />
          <Form.Control.Feedback type="invalid">
            Please provide your name.
          </Form.Control.Feedback>
        </Form.Group>}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required />
          {/* <Form.Control.Feedback type="invalid">
            Please provide a valid password.
          </Form.Control.Feedback> */}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check onChange={handleRegisteredChange} type="checkbox" label="Already Registered?" />
        </Form.Group>
        <p className='text-danger'>{error}</p>
        <Button onClick={handlePasswordReset} variant="link" >Forget Password ?</Button>
        <Button className='button w-100' variant="outline-secondary" size="lg" type="submit">
          {registered ? 'LOGIN' : 'REGISTER'}
        </Button>
      </Form>
    </div>

  );

  // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"

}

export default App;


