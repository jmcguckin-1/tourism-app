import {useEffect, useState} from 'react';
import {Rate} from 'antd';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {NavLink} from 'react-router-dom';

function CartPane(){

    const [flightData, setFD] = useState([]);
    const [hotelData, setHD] = useState([]);
    const [price, setPrice] = useState();
    const [email, setEmail] = useState("");

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

    function closeCart(){
        document.getElementById("cartPane").style.display='none';
        document.getElementById("closeCart").style.display='none';
        document.getElementById("openCart").style.display='block';
    }

     function viewCart(){
          fetch("/getCartItems?user=" + email + "&type=flights")
    .then(response => response.json())
    .then(data => {
        if (!data[0]['error']){
              setFD(data);
              setPrice(data[0]['total']);
        }
        else{
            alert("No cart items to display at this time");

        }

    })

     fetch("/getCartItems?user=" + email + "&type=hotels")
    .then(response => response.json())
    .then(data => {
         if (!data[0]['error'] && flightData.length > 0){
             setHD(data);
              document.getElementById("cartPane").style.display='block';
              document.getElementById("openCart").style.display='none';
              document.getElementById("closeCart").style.display='block';
        }

    })
     }


    return (
        <div>
        <button id='openCart' onClick={viewCart}>View Cart</button>
        <div id='cartPane'>
         <NavLink to='/payment'>Payment</NavLink>
         <button id='closeCart' onClick={closeCart}>Close Cart</button>
        <h1>Current Items</h1>
          <>
    {flightData.map(function(flight) {
      return (
        <div key={flight.id}>
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
        </div>
    )

}

export default CartPane;
