import {useEffect, useState} from "react";
import {getAuth, onAuthStateChanged} from "firebase/auth";

function Confirmation (){
    const [email, setEmail] = useState("");

    useEffect(() => {
    const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    const email = user.email;
    setEmail(email);
  }

  if (email){
      fetch("confirmBooking?user=" + email)
          .then(response => response.json())
          .then(data =>  {
                if(data[0]["success"]){
                   document.getElementById("processed").style.display = 'block';
                }
          })
  }
});
}, []);



    return (

        <div>
            <p id="processed">Order Processed</p>
            <p>Your details will be sent to {email} and you can view in current bookings</p>
        </div>
    )
}

export default Confirmation