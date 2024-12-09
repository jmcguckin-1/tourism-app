import NavBar from "../components/NavBar.js";
import Calendar from 'react-calendar';
import {useState, useEffect} from 'react';
import 'react-calendar/dist/Calendar.css';
import myData from '../data.json';
import background from "../background.jpg";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

function FlightPlanner(){
    const [departingAirport, setDA] = useState("");
    const [arrivalAirport, setArrival] = useState("");
    const [numAdults, setNumAdults] = useState("");
    const [numChildren, setNumChildren] = useState("");
    const [value, onChange] = useState("");
    const [endDate, setED] = useState("");
    const [destOptions, setValues] = useState([]);
    const [departOptions, setDepValues] = useState([]);
    const [flightData, setFD] = useState([]);
    const [direct, setDirect] = useState(false);
    const [oneWay, setOneWay] = useState(false);
    const [returnFlight, setReturn] = useState(false);

   function sendData(){
      fetch("/findFlights?departureAirport=" + departingAirport + "&arrivalAirport=" + arrivalAirport + "&startDate=" + value + "&endDate=" + endDate
      + "&direct=" + direct + "&oneWay=" + oneWay + "&returnFlight=" + returnFlight)
      .then(response => response.json())
      .then(data => {
         document.getElementById('formEntry').style.display='none';
         document.getElementById('loadingScreen').style.display='block';
         setTimeout(() => {
          document.getElementById('loadingScreen').style.display='block';
          document.getElementById('addOptions').style.display='none';
          setFD(data);
          document.getElementById('flightTimes').style.display='block';
         }, 5000);

      })
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
        <div>
        <img src={background} id='bg'/>
        <NavBar/>
        <div id="loadingScreen">
            <p>Loading your flights...</p>
            <Spin indicator={<LoadingOutlined style={{
            fontSize: 48,
          }} spin />} className='spin' size="large" />
        </div>
        <div id='flightTimes'>
     <>
    {flightData.map(function(flight) {
      return (
        <div key={flight.id}>
           <p>{flight.ft1} - {flight.ft2}</p>
           <p>{flight.airline}</p>
           <p>{flight.start} to {flight.end}</p>
           <br/>
           <p>Return Flight</p>
           <p>{flight.rt1} - {flight.rt2}</p>
            <p>{flight.end} to {flight.start}</p>
            <p>£{flight.price}</p>
             <br/>
        </div>
      )
    })}
    </>
        </div>
        <div id='formEntry'>
         <p>Destination</p>
         <input type='text'onChange={e => setChoices(e.target.value, "dest")}/>
         <select id='option2' onChange={setA}>
         <>
    {destOptions.map(function(details) {
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
    {departOptions.map(function(details) {
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
        <Calendar onChange={onChange} value={value} className='startDate'/>
        <p id='edText'>End Date</p>
        <Calendar onChange={setED} value={endDate}  className='endDate'/>
        </div>
        <button onClick={sendData} id='sendData'>Send</button>

        <div id='addOptions'>
         <br/>
        <label>Direct Flight: </label> <input type='checkbox' onChange={e => setDirect(e.target.checked)} name='flightType'/>
        <br/>
        <label>One Way: </label> <input type='checkbox' onChange={e => setOneWay(e.target.checked)} name='flightType'/>
        <br/>
        <label>Return: </label> <input type='checkbox' onChange={e => setReturn(e.target.checked)}name='flightType'/>
        </div>
        </div>
    )
}

export default FlightPlanner;