import NavBar from "../components/NavBar.js";
import Calendar from 'react-calendar';
import {useState, useEffect} from 'react';
import 'react-calendar/dist/Calendar.css';

function FlightPlanner(){
    const [departingAirport, setDA] = useState("");
    const [arrivalAirport, setArrival] = useState("");
    const [numAdults, setNumAdults] = useState("");
    const [numChildren, setNumChildren] = useState("");
    const [currentData ,setData] = useState([]);

   useEffect(() =>{
    fetch("https://api.aviationstack.com/v1/airports?access_key=1b199b799a069f9f542aa7ef36149182", {
        'method': 'GET',
        'type': 'application/json'
    })

    .then(response => response.json())
    .then(data => {
        let result = data['data'];
        let newData = [];
        for (let i=0; i<50; i++){
            console.log(result[i]['country_name']);
            if (result[i]['country_name'] != null){
                newData.push(result[i]);
            }
            }
        setData(newData);

    })
   },[])

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
         <select>
         <>
    {currentData.map(function(details) {
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


<select>
         <>
    {currentData.map(function(details) {
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
        <Calendar className='startDate'/>

        <p>End Date</p>
        <Calendar className='endDate'/>
        </div>

        </div>
    )
}

export default FlightPlanner;