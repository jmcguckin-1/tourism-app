import {useState, useEffect} from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {useNavigate, NavLink} from 'react-router-dom';
import bg from "../bgSignIn.jpg";

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    function signIn(){
        const auth = getAuth();
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    navigate("/flights", {replace: true});
  })
  .catch((error) => {
    alert(error.message);
  });
    }
    return (
        <div>
            <img src={bg} className='signInImage'/>
            <div id='signIn'>
                <br/>
                <input type='text' placeholder='Enter email' onChange={(e) => setEmail(e.target.value)}/>
                <br/>
                <br/>
                <input type='password' placeholder='Enter password' onChange={(e) => setPassword(e.target.value)}/>
                <br/>
                <br/>
                <button onClick={signIn} className='button-19'>Sign In</button>
                <br/>
                <br/>
                <NavLink to='/' className='navlink'>Need to sign up? Click here!</NavLink>
            </div>
        </div>

    )
}

export default Login;
