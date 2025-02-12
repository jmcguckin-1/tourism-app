import {useState, useEffect} from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {Rate} from 'antd';
import NavBar from "../components/NavBar";

function Payment(){
    const [flightData, setFD] = useState([]);
    const [hotelData, setHD] = useState([]);
    const [price, setPrice] = useState();
    const [email, setEmail] = useState("");

    function payment(){
        fetch("/payment?value="+ price + "&user=" + email, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({})
        })
            .then(response => response.json())
            .then(data =>{
                    window.open(data["session"]);
            });
    }

    function discountCheck(){
        fetch("/getDiscount?amount=" + price + "&email=" + email)
            .then(response => response.json())
            .then(data => {
                if (data['discounted_price'] < price){
                    alert("Discount applied! (" + data['discounted_price'] + ")");
                    setPrice(data['discounted_price']);
                }
                else{
                     alert("You are not eligible for discount yet - check your profile to see how close you are");
                }
            })
    }

    useEffect(() => {
           const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    const email = user.email;
    setEmail(email);
  }
});
    if (email){
        fetch("/getCartItems?user=" + email + "&type=flights")
    .then(response => response.json())
    .then(data => {
        setFD(data);
        setPrice(data[0]['total']);
    })

     fetch("/getCartItems?user=" + email + "&type=hotels")
    .then(response => response.json())
    .then(data => {
        setHD(data);
    })
    }
    },)
    return (
    <div>
        <NavBar/>
        <div>
        <>
              {flightData.map(function(flight) {
      return (
          <div key={flight.id}>
              <h1>Your Order</h1>
              <p>Flight:</p>
              <p>{flight.ft1} - {flight.rt2}</p>
              <p>{flight.airline}</p>
              <p>{flight.start} to {flight.end}</p>
              <br/>
          </div>
      )
              })}
         </>
         <>
    {hotelData.map(function(hotel) {
      return (
        <div key={hotel.id}>
          <p>Hotel:</p>
           <p>{hotel.location}</p>
           <p>{hotel.accomodation_name}</p>
            <Rate disabled value={hotel.star_rating} />
             <p>{hotel.adults} adults, {hotel.children} children</p>
             <p>Flight + Hotel = £{price}</p>
        </div>
      )
    })}
    </>
        </div>
       <button id='payment' onClick={payment}>Payment using Stripe</button>
        <button onClick={discountCheck}>Eligible for discount?</button>
    </div>

    )
}

export default Payment;
