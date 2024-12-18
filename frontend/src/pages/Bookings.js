import NavBar from "../components/NavBar.js";
import Calendar from 'react-calendar';
import {useState, useEffect} from 'react';
import 'react-calendar/dist/Calendar.css';
import myData from '../data.json';
import background from "../hotels.jpg";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Alert, Rate, InputNumber } from 'antd';

function BookingPlanner(){
    const [destination, setDestination] = useState("");
    const [numChildren, setNumChildren] = useState("");
    const [numAdults, setAdults] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [destinationValues, setDValues] = useState([]);
    const [requests, setRequests] = useState([]);
    const [singleBeds, setSB] = useState(false);
    const [wifi, setWifi] = useState(false);
    const [pool, setPool] = useState(false);
    const [hotelData, setHD] = useState([]);
    const [valid, setValid] = useState(false);
    const [chosenData, setCD] = useState([]);

    const onClose = (e) => {
  console.log(e, 'I was closed.');
};

   function sendData(){
   let requests = [{
        "singleBeds": singleBeds,
        "wifi": wifi,
        "pool": pool
   }];
   setRequests(requests);

    if (endDate < startDate){
        document.getElementsByClassName('dateError2')[0].style.display='block';
        setValid(false);
    }
    if (destination === ""){
        document.getElementsByClassName('fieldError')[0].style.display='block';
        setValid(false);
    }
    if (endDate > startDate && destination !== ""){
        setValid(true);
    }

    if (valid){
        document.getElementById('loadingScreenHotels').style.display='block';
     document.getElementById('preferences').style.display='none';
    document.getElementById('formEntry').style.display='none';
    document.getElementById('sendData').style.display='none';
     fetch("/findHotels?destination=" + destination + "&startDate=" + startDate + "&endDate=" + endDate
     + "&numAdults=" + numAdults + "&numChildren=" + numChildren)
    .then(response => response.json())
    .then(data => {
         setTimeout(() => {
          if (data.length !==0){
              document.getElementById('loadingScreenHotels').style.display='none';
           setHD(data);
          document.getElementById('hotels').style.display='block';
          }
          else{
            document.getElementById('loadingScreenHotels').style.display='none';
            document.getElementById('formEntry').style.display='block';
            document.getElementById('sendData').style.display='block';
            document.getElementsByClassName('hotelError')[0].style.display='block';
          }
         }, 5000);
    })
    }
}

   function setDest(){
    var e = document.getElementById("option2");
    var textVal = e.options[e.selectedIndex].text;
    setDestination(textVal);
   }

   function basketAdd(x){
       let currentHotel = [];
       for (let i=0; i<hotelData.length; i++){
           if (hotelData[i]['id'] === x){
               currentHotel.push(hotelData[i]);
           }
       }

       fetch("/addToBasket", {
        "method": "POST",
        "body": JSON.stringify(currentHotel),
        "headers": {
        "Content-Type": "application/json"
        }

       })
       .then(response => response.json())
       .then(data => {
            console.log("success")
       });

   }

 function setChoices(x){
        let newValues = [];
       for (let i=0; i<myData.length; i++){
            if(myData[i]['country_name'].includes(x)){
                newValues.push(myData[i]);
            }
       }
       setDValues(newValues);
   }

    return (
        <div>
        <img src={background} id='bg'/>
        <NavBar/>
          <div id='hotels'>
     <>
    {hotelData.map(function(hotel) {
      return (
        <div key={hotel.id}>
           <p>{hotel.location}</p>
           <p>{hotel.accomodation_name}</p>
            <Rate disabled value={hotel.star_rating} />
            <p>{hotel.st} - {hotel.end}</p>
             <p>{hotel.adults} adults, {hotel.children} children</p>
            <p>£{hotel.price}</p>
            <button>View Info</button>
            <button onClick={e => basketAdd(hotel.id)}>Add to Basket</button>
           <br/>
        </div>
      )
    })}
    </>
    </div>
        <div id="loadingScreenHotels">
            <p>Loading your hotels...</p>
            <Spin indicator={<LoadingOutlined style={{
            fontSize: 48,
          }} spin />} className='spin' size="large" />
        </div>
        <div id='formEntry'>
          <p>Destination</p>
         <input type='text'onChange={e => setChoices(e.target.value)}/>
         <select id='option2' onChange={setDest}>
         <>
    {destinationValues.map(function(details) {
      return (
        <option key={details.airport_id}>
             {details.country_name}
        </option>
      )
    })}
    </>
</select>

        <p id='sdText'>Start Date</p>
        <Calendar onChange={setStartDate} value={startDate} className='startDate1'/>
        <p id='edText'>End Date</p>
        <Calendar onChange={setEndDate} value={endDate}  className='endDate1'/>
        <Alert
      message="Field Not Entered"
      description="Please enter a destination for your stay"
      type="error"
      className='fieldError'
      closable
      onClose={onClose}
    />

      <Alert
      message="Hotels Not Found"
      description="No hotels have been found for your query, try again."
      type="error"
      className='hotelError'
      closable
      onClose={onClose}
    />

     <Alert
      message="Dates Not Aligned"
      description="End Date should be after Start Date"
      type="error"
      className='dateError2'
      closable
      onClose={onClose}
    />
        </div>

          <div id='preferences'>
         <label>Num Adults:</label> <InputNumber min={1} max={10} defaultValue={3} onChange={setAdults}/>
        <br/>
        <label>Num Children:</label> <InputNumber min={0} max={10} defaultValue={3} onChange={setNumChildren}/>
         <br/>
        <label>Single Beds: </label> <input type='checkbox' onChange={e => setSB(e.target.checked)}/>
        <br/>
        <label>Wi-Fi: </label> <input type='checkbox' onChange={e => setWifi(e.target.checked)}/>
        <br/>
        <label>Pool: </label> <input type='checkbox' onChange={e => setPool(e.target.checked)}/>
        </div>
        <button onClick={sendData} id='sendData'>Send</button>
        </div>
    )
}

export default BookingPlanner;