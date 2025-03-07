import NavBar from "../components/NavBar.js";
import {useEffect, useState} from "react";
import {Rate} from "antd";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import profileBg from "../profile.png";

function Profile(){

    const [rating, setRating] = useState(2);
    const [currentUser, setCU] = useState("");
    const [bookingData, setData] = useState([]);
    const [review, setReview] = useState("");
    const [currentHoliday, setCurrentHoliday] = useState("");
    const [savedBookings, setSavedBookings] = useState([]);

    useEffect(() => {
           const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    const email = user.email;
    setCU(email);
  }
});
    },[])

    function reviewView(){
        document.getElementById("reviewForm").style.display = 'block';
        document.getElementById("leaveReview").style.display = 'none';
        fetch("/getBookings?user=" + currentUser)
            .then(response => response.json())
            .then(data => {
                setData(data);
            })
    }

     function setHoliday(){
    var e = document.getElementById("holidays");
    var textVal = e.options[e.selectedIndex].text;
    setCurrentHoliday(textVal);
   }

    function sendReview(){
        fetch("/leaveReview?user=" + currentUser + "&review=" + review  + "&stars=" + rating + "&holiday=" + currentHoliday, {
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

    function viewSaved(){
        document.getElementById("savedBookings").style.display = 'none';
        document.getElementById("bookingDisplay").style.display = 'block';
        fetch("/getSavedBookings?user=" + currentUser)
            .then(response => response.json())
            .then(data => {
                    if (data){
                        console.log(data);
                        setSavedBookings(data);
                    }
            })
    }

    return (
        <div>
            <img src={profileBg} id='profileBg' alt='bg'/>
            <NavBar/>
            <div id='leaveReview' onClick={reviewView}>
                <p id='leaveR'>Leave Review on your Holiday</p>
            </div>

            <div id='savedBookings' onClick={viewSaved}>
                <p id='sBookings'>View Your Saved Bookings</p>
            </div>

            <div id='viewSaved' onClick={viewSaved}>
                <p id='vSaved'>View Saved Holidays</p>
            </div>

            <div id='bookingDisplay'>
                 <>
                {savedBookings.map(function (saved) {
                            return (
                                <div key={saved.id}>
                                    {saved.start} - {saved.end}
                                    <br/>
                                    {saved.airline}
                                    <br/>
                                    £{saved.price}
                                </div>
                            )
                        })}
            </>
            </div>



            <div id='reviewForm'>
            <select id='holidays' onChange={setHoliday}>
                    <>
                        {bookingData.map(function (details) {
                            return (
                                <option key={details.id}>
                                    {details.start} - {details.end}
                                </option>
                            )
                        })}
                    </>
                </select>


                <p>Leave review</p>
                <br/>
                <textarea onChange={(e) => setReview(e.target.value)}>

                </textarea>
                <br/>
                <br/>
                <Rate value={rating} onChange={setRating}/>
                <br/>
                <br/>
                <button onClick={sendReview}>Place Review</button>
            </div>
        </div>
    )
}

export default Profile;