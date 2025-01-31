import NavBar from "../components/NavBar.js";
import {useEffect, useState} from "react";
import {Rate} from "antd";
import {getAuth, onAuthStateChanged} from "firebase/auth";

function Profile(){

    const [rating, setRating] = useState(2);
    const [currentUser, setCU] = useState("");
    const [bookingData, setData] = useState([]);
    const [review, setReview] = useState("");

    useEffect(() => {
           const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    const email = user.email;
    setCU(email);
  }
});
 fetch("/getBookings?user=" + currentUser)
            .then(response => response.json())
            .then(data => {
                setData(data);
            })
    },[])

    function reviewView(){
        document.getElementById("reviewForm").style.display = 'block';
        document.getElementById("leaveReview").style.display = 'none';
    }

    function sendReview(){
        fetch("/leaveReview?user=" + currentUser + "&review=" + review  + "&stars=" + rating, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        })
            .then(response => response.json())
            .then(data => {

            })
    }

    return (
        <div>
        <NavBar/>
            <div id='leaveReview' onClick={reviewView}>
                <p>Leave Review on your Holiday</p>
            </div>

            <div id='reviewForm'>
                 <select>
                     <>

    {bookingData.map(function(details) {
      return (
        <option key={details.id}>
             {details.start} -  {details.end}
        </option>
      )
    })}
    </>
           </select>
                <p>Leave review</p>
                <textarea onChange={(e) => setReview(e.target.value)}>

                </textarea>

                <Rate value={rating} onChange={setRating}/>

                <button onClick={sendReview}>Place Review</button>
            </div>
        </div>
    )
}

export default Profile;