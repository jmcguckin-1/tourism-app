import {useState, useEffect} from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {useNavigate} from 'react-router-dom';

function SignIn(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordValidation, setPV] = useState("");
    const navigate = useNavigate();
    function signUp(){
        if (name !== "" && email !== "" && password !== "" && passwordValidation !== ""){
            if (password == passwordValidation){
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        navigate("/flights", {replace: true});
     })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
            }
            else{
                alert("Passwords should match!");
            }
        }
        else{
            alert("please ensure all fields have been filled");
        }
    }

    return (
        <div id='signUp'>
            <input type='text' placeholder='enter your email' onChange={e => setEmail(e.target.value)}/>
            <br/>
            <br/>
            <input type='text' placeholder='enter your name' onChange={e => setName(e.target.value)}/>
            <br/>
            <br/>
            <input type='password' placeholder='enter a password' onChange={e => setPassword(e.target.value)}/>
            <br/>
            <br/>
            <input type='password' placeholder='validate password' onChange={e => setPV(e.target.value)}/>
            <button onClick={signUp}>Sign Up</button>
        </div>
    )
}
export default SignIn;