import {useEffect, useState} from 'react';
import {Rate} from 'antd';
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
//    useEffect(() => {
//     fetch("/getCartItems?user=" + email + "&type=flights")
//    .then(response => response.json())
//    .then(data => {
//        setFD(data);
//        setPrice(data[0]['total']);
//    })
//    }, [email])
//
//     useEffect(() => {
//     fetch("/getCartItems?user=" + email + "&type=hotels")
//    .then(response => response.json())
//    .then(data => {
//        setHD(data);
//    })
//    }, [email])


    return (
        <div id='cartPane'>
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
    )

}

export default CartPane;