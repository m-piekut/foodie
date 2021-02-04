import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Join from "../Components/Join";
import useFetch from "../Components/useFetch";
import MakeDinner from "../MakeDinner";
import {db} from '../firebase'
import Dinner from "./Dinner";
const DinnersList = () => {

    const [dinners, setDinners] = useState([])
useEffect(() => {
   const test =  db.collection('diners').onSnapshot(snapshot=>{

       setDinners(snapshot.docs.map(doc => doc.data()))
   });

}, []);

    return ( 
        (dinners &&<div className="dinner-list">
            <h3 className="dinner-list__header">Lista uczt:</h3>
            {
                dinners.map(dinner => (
                    

                    <Dinner city={dinner.city} date={dinner.date} time={dinner.time} address={dinner.address} name={dinner.name} key={dinner.id}></Dinner>


                ))
            }
            {/* <MakeDinner></MakeDinner> */}
        </div>)
    );
}

export default DinnersList;