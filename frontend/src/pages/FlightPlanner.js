import NavBar from "../components/NavBar.js";
import Calendar from 'react-calendar';
import {useState, useEffect} from 'react';
import 'react-calendar/dist/Calendar.css';
import myData from '../data.json';
import background from "../background.jpg";
import {HeartOutlined, LoadingOutlined} from '@ant-design/icons';
import { Spin, Alert, InputNumber, Rate} from 'antd';
import Icon from '@ant-design/icons';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CartPane from "../components/CartPane.js";

function FlightPlanner(){
    const [departingAirport, setDA] = useState("");
    const [arrivalAirport, setArrival] = useState("");
    const [numAdults, setNumAdults] = useState("");
    const [numChildren, setNumChildren] = useState("");
    const [startDate, setSD] = useState("");
    const [endDate, setED] = useState("");
    const [destOptions, setValues] = useState([]);
    const [departOptions, setDepValues] = useState([]);
    const [flightData, setFD] = useState([]);
    const [direct, setDirect] = useState(false);
    const [oneWay, setOneWay] = useState(false);
    const [returnFlight, setReturn] = useState(false);
    const [valid, setValid] = useState(false);
    const [email, setEmail] = useState("");
    const [reviewData, setReviewData] = useState([]);

       const onClose = (e) => {
  console.log(e, 'I was closed.');
};

useEffect(() => {
    const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    const email = user.email;
    setEmail(email);
  }
});
}, []);


   function sendData(){
    if (endDate < startDate){
        document.getElementsByClassName('dateErrorF')[0].style.display='block';
        setValid(false);
    }
    if (departingAirport === "" || arrivalAirport === ""){
        document.getElementsByClassName('fieldErrorF')[0].style.display='block';
        setValid(false);
    }
    if (endDate > startDate && departingAirport !== "" && arrivalAirport !== "") {
        setValid(true);
    }

    function getReviews(){
        fetch("getReviews?holiday=" + departingAirport + " - " + arrivalAirport)
            .then(response => response.json())
            .then(data => {
                if (data){
                    setReviewData(data);
                    if (data.length > 0){
                        document.getElementById("reviewsSection").style.display='block';
                        console.log(data);
                    }
                }
            })
    }
    if (valid){
        let filters = [
            {
                "direct": direct,
                "return": returnFlight
            }
        ];
     document.getElementById('formEntry').style.display='none';
    document.getElementById('addOptions').style.display='none';
    document.getElementById('loadingScreen').style.display='block';
    document.getElementById('sendData').style.display='none';
    fetch("/findFlights?departureAirport=" + departingAirport + "&arrivalAirport=" + arrivalAirport + "&startDate=" + startDate + "&endDate=" + endDate, {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(filters)
    })
      .then(response => response.json())
      .then(data => {
         setTimeout(() => {
          if (data.length !== 0){
           setFD(data);
          document.getElementById('flightTimes').style.display='block';
          document.getElementById('loadingScreen').style.display='none';
          getReviews();
          }
          else{
            document.getElementById('loadingScreen').style.display='none';
            document.getElementById('formEntry').style.display='block';
            document.getElementById('sendData').style.display='block';
            document.getElementsByClassName('flightErrorF')[0].style.display='block';
          }
         }, 5000);

      })
    }

   }

   function addToBasket(x){
       let currentFlight = [];
       for (let i=0; i<flightData.length; i++){
           if (flightData[i]['id'] === x){
               currentFlight.push(flightData[i]);
           }
       }

       fetch("/addToBasket?user=" + email, {
        "method": "POST",
        "body": JSON.stringify(currentFlight),
        "headers": {
        "Content-Type": "application/json"
        }

       })
       .then(response => response.json())
       .then(data => {
             if(data[0]["basket_full"]){
                alert("a flight and hotel have already been added!");
            }
            else if (data[0]["success"]){
                alert("a flight has been added!");
            }
       });

   }

   function save(x){
       let currentSave = [];
       for (let i=0; i<flightData.length; i++){
           if (flightData[i]['id'] === x){
               currentSave.push(flightData[i]);
           }
       }
       console.log(currentSave.length);

       fetch("/saveForLater?user=" + email, {
        "method": "POST",
        "body": JSON.stringify(currentSave),
        "headers": {
        "Content-Type": "application/json"
        }

       })
       .then(response => response.json())
       .then(data => {

       });

   }

   function setA(){
    var e = document.getElementById("option2");
    var textVal = e.options[e.selectedIndex].text;
    setArrival(textVal);
   }
   function setD(){
     var e = document.getElementById("option1");
    var textVal = e.options[e.selectedIndex].text;
    setDA(textVal);
   }

   function returnFl(x){
       if (x){
           return "Return";
       }
       return "One Way";
   }

   function directFl(x){
       if (x){
           return "Direct Flight";
       }
       return "Stops Included";
   }

    function setChoices(x, y){
        let newValues = [];
       for (let i=0; i<myData.length; i++){
            if(myData[i]['country_name'].includes(x)){
                newValues.push(myData[i]);
            }
       }
       if (y === "dest"){
         setValues(newValues);
       }
       else{
           setDepValues(newValues);
       }
   }

    return (
        <div id='container'>
            <img src={background} id='bg'/>
            <NavBar/>
            <CartPane/>
            <div id="loadingScreen">
                <p>Loading your flights...</p>
                <Spin indicator={<LoadingOutlined style={{
                    fontSize: 48,
                }} spin/>} className='spin' size="large"/>
            </div>
            <div id='flightTimes'>
                <>
                    {flightData.map(function (flight) {
                        return (
                            <div key={flight.id}>
                                <HeartOutlined onClick={(e) => save(flight.id)}/>
                                <p>{flight.ft1} - {flight.ft2}</p>
                                <p>{flight.airline}</p>
                                <p>{flight.start} to {flight.end}</p>
                                <br/>
                                <p>Return Flight</p>
                                <p>{flight.rt1} - {flight.rt2}</p>
                                <p>{flight.end} to {flight.start}</p>
                                <p>£{flight.price}</p>
                                <p>{directFl(flight.direct)}</p>
                                <p>{returnFl(flight.return_flight)}</p>
                                <button onClick={(e) => addToBasket(flight.id)}>Add to Basket</button>
                                <br/>
                            </div>
                        )
                    })}
                </>
            </div>

            <div id='reviewsSection'>
                <>
                    {reviewData.map(function (reviews) {
                        return (
                            <div key={reviews.id}>
                                <p>{reviewData.length} reviews on {departingAirport} - {arrivalAirport}</p>
                                <p>{reviews.review}</p>
                                <p>{reviews.user}</p>
                                <Rate disabled value={reviews.stars}/>
                            </div>
                        )
                    })}
                </>
            </div>
            <div id='formEntry'>
                <p>Destination</p>
                <input type='text' onChange={e => setChoices(e.target.value, "dest")}/>
                <select id='option2' onChange={setA}>
                    <>
                        {destOptions.map(function (details) {
                            return (
                                <option key={details.airport_id}>
                                    {details.country_name}
                                    ({details.city_iata_code}) - {details.airport_name}
                                </option>
                            )
                        })}
                    </>
                </select>

                <p>Departing:</p>
                <input type='text' id='departing' onChange={e => setChoices(e.target.value, "depart")}/>
                <select id='option1' onChange={setD}>
                    <>
                        {departOptions.map(function (details) {
                            return (
                                <option key={details.airport_id}>
                                    {details.country_name}
                                    ({details.city_iata_code}) - {details.airport_name}
                                </option>
                            )
                        })}
                    </>
                </select>

                <Alert
                    message="Field Not Entered"
                    description="Please enter a destination for your stay"
                    type="error"
                    className='fieldErrorF'
                    closable
                    onClose={onClose}
                />

                <Alert
                    message="Flights Not Found"
                    description="No flights were found for your query. please try again"
                    type="error"
                    className='flightErrorF'
                    closable
                    onClose={onClose}
                />

                <Alert
                    message="Dates Not Aligned"
                    description="End Date should be after Start Date"
                    type="error"
                    className='dateErrorF'
                    closable
                    onClose={onClose}
                />

                <p id='sdText'>Start Date</p>
                <Calendar onChange={setSD} value={startDate} className='startDate'/>
                <p id='edText'>End Date</p>
                <Calendar onChange={setED} value={endDate} className='endDate'/>
            </div>
            <button onClick={sendData} id='sendData'>Send</button>

            <div id='addOptions'>
                <label>Num Adults:</label> <InputNumber min={1} max={10} defaultValue={3} onChange={setNumAdults}/>
                <br/>
                <label>Num Children:</label> <InputNumber min={1} max={10} defaultValue={3} onChange={setNumChildren}/>
                <br/>
                <label>Direct Flight: </label> <input type='checkbox' onChange={e => setDirect(e.target.checked)}
                                                      name='flightType'/>
                <br/>
                <label>Return: </label> <input type='checkbox' onChange={e => setReturn(e.target.checked)}
                                               name='flightType'/>
            </div>
        </div>
    )
}

export default FlightPlanner;