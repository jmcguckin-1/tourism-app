
function CartPane(){

    const [flightData, setFD] = useState([]);

    useEffect(() => {
    .fetch("/getCartItems?user=John McGuckin&type=flights")
    .then(response => response.json())
    .then(data => {
        setFD(data);
    })
    }, [])

    return (
        <div>
        <h1>Current Items</h1>
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
    )

}

export default CartPane;