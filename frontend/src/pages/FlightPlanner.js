import NavBar from "../components/NavBar.js";
import Calendar from 'react-calendar';
import {useState, useEffect} from 'react';
import 'react-calendar/dist/Calendar.css';
import myData from '../data.json';

function FlightPlanner(){
    const [departingAirport, setDA] = useState("");
    const [arrivalAirport, setArrival] = useState("");
    const [numAdults, setNumAdults] = useState("");
    const [numChildren, setNumChildren] = useState("");
    const [value, onChange] = useState("");

   function sendData(){
       let option2 = document.getElementById('option2');
       setArrival(option2[this.selectedIndex].innerHTML);
       let option1 = document.getElementById('option1');
       setDA(option1[this.selectedIndex].innerHTML);
       console.log(departingAirport);
       console.log(arrivalAirport);
       console.log(value);
      fetch("/secureFlights?a1=" + departingAirport + "&a2=" + arrivalAirport + "&a3=" + value)
      .then(response => response.json())
      .then(data => {
          console.log("success!");
      })
   }

    return (
        <div>
        <NavBar/>
        {/*
            Departing airport
            Arrival Airport
            Start Date
            End Date
            Number of Passengers
        */}
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
        <input type='text'/>
<select id='option1'>
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
        <p>Start Date</p>
        <Calendar onChange={onChange} value={value} className='startDate'/>
        <p>End Date</p>
        <Calendar className='endDate'/>
        </div>
        <button onClick={sendData}>Send</button>

        </div>
    )
}

export default FlightPlanner;