import NavBar from "../components/NavBar.js";
import {useEffect, useState} from "react";
import {Rate, Progress} from "antd";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import profileBg from "../profile.png";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function Profile(){

    const [rating, setRating] = useState(2);
    const [currentUser, setCU] = useState("");
    const [bookingData, setData] = useState([]);
    const [review, setReview] = useState("");
    const [currentHoliday, setCurrentHoliday] = useState("");
    const [savedBookings, setSavedBookings] = useState([]);
    const [loyalty, setLoyalty] = useState(0);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [reviewsGiven, setRG] = useState(0);
    useEffect(() => {
           const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    const email = user.email;
    setCU(email);
  }
});
    },[]);

    useEffect(() => {
        fetch("/getUserDetails?user=jmcguckin308@gmail.com")
            .then(response => response.json())
            .then(data => {
                if (data['loyalty'] >= 0){
                      setLoyalty(data['loyalty']);
                      setName(data['name']);
                      setEmail(data['email']);
                      setRG(data['review_count']);
                }

            })
    })

    function reviewView(){
        document.getElementById("reviewForm").style.display = 'block';
        document.getElementById("leaveReview").style.display = 'none';
        document.getElementById("savedBookings").style.display = 'none';
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

   function backToPage(){
          document.getElementById("reviewForm").style.display = 'none';
          document.getElementById("bookingDisplay").style.display = 'none';
          document.getElementById("leaveReview").style.display = 'block';
          document.getElementById("savedBookings").style.display = 'block';
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
                  alert("review created!");
            })
    }

    function viewSaved(){
        document.getElementById("savedBookings").style.display = 'none';
        document.getElementById("bookingDisplay").style.display = 'block';
        document.getElementById("leaveReview").style.display = 'none';
        fetch("/getSavedBookings?user=" + currentUser)
            .then(response => response.json())
            .then(data => {
                    if (data){
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

            <div id='level'>
                <p>{name}</p>
                <p>{email}</p>
                <p>{reviewsGiven} reviews given</p>
                <p>Loyalty Level</p>
                <Progress type="circle" percent={(loyalty / 10) * 100}/>
            </div>


            <div id='bookingDisplay'>
                <p>Back</p>
                <FontAwesomeIcon icon={faArrowRight}  className='backArrow' onClick={backToPage}/>
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
                <p>Back</p>
                <FontAwesomeIcon icon={faArrowRight} className='backArrow' onClick={backToPage}/>
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
                <button className='button-19' onClick={sendReview}>Place Review</button>
            </div>
        </div>
    )
}

export default Profile;