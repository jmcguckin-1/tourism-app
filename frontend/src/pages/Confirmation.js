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
      // need to add to saved bookings
      // new endpoint
      fetch("confirmBooking?user=" + email)
          .then(response => response.json())
          .then(data =>  {

          })
  }
});
}, []);



    return (

        <div>
            <p>Order Processed</p>
        </div>
    )
}

export default Confirmation