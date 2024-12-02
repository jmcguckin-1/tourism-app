import NavBar from "../components/NavBar.js";
import Calendar from 'react-calendar';
import {useState, useEffect} from 'react';
import 'react-calendar/dist/Calendar.css';
import myData from '../data.json';
import background from "../background.jpg";

function FlightPlanner(){
    const [departingAirport, setDA] = useState("");
    const [arrivalAirport, setArrival] = useState("");
    const [numAdults, setNumAdults] = useState("");
    const [numChildren, setNumChildren] = useState("");
    const [value, onChange] = useState("");
    const [values, setValues] = useState([]);

   function sendData(){
      fetch("/secureFlights?a1=" + departingAirport + "&a2=" + arrivalAirport + "&a3=" + value)
      .then(response => response.json())
      .then(data => {
          console.log("success!");
      })
   }

   function setChoices(x){
        let newValues = [];
       for (let i=0; i<myData.length; i++){
            if(myData[i]['country_name'].includes(x)){
                newValues.push(myData[i]);
            }
       }
       setValues(newValues);
   }

    return (
        <div>
        <img src={background} id='bg'/>
        <NavBar/>
        <div id='formEntry'>
         <p>Destination</p>
         <input type='text'/>
         <select id='option2'>
         <>
    {myData.map(function(details) {
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
        <input type='text' id='departing' onChange={e => setChoices(e.target.value)}/>
<select id='option1'>
         <>
    {values.map(function(details) {
      return (
        <option key={details.airport_id}>
             {details.country_name}
             ({details.city_iata_code}) - {details.airport_name}
        </option>
      )
    })}
    </>
</select>
        <p>Start Date</p>
        <Calendar onChange={onChange} value={value} className='startDate'/>
        <p>End Date</p>
        <Calendar className='endDate'/>
        </div>
        <button onClick={sendData}>Send</button>

        // radio buttons (direct flight, one way etc.)
        </div>
    )
}

export default FlightPlanner;