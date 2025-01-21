import {useState, useEffect} from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {Rate} from 'antd';

function Payment(){
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
    })
    return (
    <div>
         <div>
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
         <form action="/create-checkout-session" method="POST">
      <button type="submit">
        Payment
      </button>
    </form>
    </div>

    )
}

export default Payment;
