import {useState, useEffect} from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {useNavigate, NavLink} from 'react-router-dom';

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
            <br/>
            <input type='text' placeholder='Enter email' onChange={(e) => setEmail(e.target.value)}/>
            <br/>
            <br/>
            <input type='password' placeholder='Enter password' onChange={(e) => setPassword(e.target.value)}/>
            <br/>
            <br/>
            <button onClick={signIn}>Sign In</button>
            <br/>
            <br/>
            <NavLink to='/'>Need to sign up? Click here!</NavLink>
        </div>
    )
}
export default Login;
