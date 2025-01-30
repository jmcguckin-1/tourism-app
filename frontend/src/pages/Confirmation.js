import {useEffect, useState} from "react";
import {getAuth, onAuthStateChanged} from "firebase/auth";

function Confirmation (){
    const [email, setEmail] = useState("");

     function confirmBooking(){
      if (email){
           fetch("confirmBooking?user=" + email, {
          "method": "POST",
          "headers": {
              "Content-Type": "application/json"
          },
          "body": JSON.stringify({})
      })
          .then(response => response.json())
          .then(data =>  {
                if(data["success"]){
                   document.getElementById("processed").style.display = 'block';
                }
          })
      }

  }

    useEffect(() => {
    const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    const email = user.email;
    setEmail(email);
  }
});
}, []);

    return (

        <div>
            <p id="processed">Order Processed</p>
            <button onClick={confirmBooking}>Confirm Booking</button>
            <p>Your details will be sent to {email} and you can view in current bookings</p>
        </div>
    )
}

export default Confirmation