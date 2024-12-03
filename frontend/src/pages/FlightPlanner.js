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
    const [destOptions, setValues] = useState([]);
    const [departOptions, setDepValues] = useState([]);

   function sendData(){
      console.log(departingAirport);
      console.log(arrivalAirport);
      console.log(value);
      fetch("/secureFlights?departureAirport=" + departingAirport + "&arrivalAirport=" + arrivalAirport + "&startDate=" + value)
      .then(response => response.json())
      .then(data => {
          console.log("success!");
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
        <Calendar className='endDate'/>
        <button onClick={sendData} id='sendData'>Send</button>
        </div>

        {/*radio buttons (direct flight, one way etc.)*/}
        </div>
    )
}

export default FlightPlanner;