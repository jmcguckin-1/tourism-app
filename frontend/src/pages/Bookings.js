import NavBar from "../components/NavBar.js";
import Calendar from 'react-calendar';
import {useState, useEffect} from 'react';
import 'react-calendar/dist/Calendar.css';
import myData from '../data.json';
import background from "../hotels.jpg";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

function BookingPlanner(){
    const [hotel, setHotel] = useState("");
    const [destination, setDestination] = useState("");
    const [numChildren, setNumChildren] = useState("");
    const [numAdults, setAdults] = useState("");
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [destinationValues, setDValues] = useState([]);
    const [requests, setRequests] = useState([]);

   function sendData(){
   let requests = ["single bed", "2 rooms", "wi-fi", "pool"];
   setRequests(requests);
   fetch("/findHotels?destination=" + destination + "&startDate=" + startDate + "&endDate=" + endDate
    + "&requests=" + requests)
    .then(response => response.json())
    .then(data => {
        console.log("success!");
    })

   }


   function setDest(){
    var e = document.getElementById("option2");
    var textVal = e.options[e.selectedIndex].text;
    setDestination(textVal);
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
             ({details.city_iata_code}) - {details.airport_name}
        </option>
      )
    })}
    </>
</select>

        <p id='sdText'>Start Date</p>
        <Calendar onChange={setStartDate} value={startDate} className='startDate1'/>
        <p id='edText'>End Date</p>
        <Calendar onChange={setEndDate} value={endDate}  className='endDate1'/>
        </div>
        <button onClick={sendData} id='sendData'>Send</button>
        </div>

    )
}

export default BookingPlanner;