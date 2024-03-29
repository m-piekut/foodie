import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import firebase from 'firebase'

const ProfileDinners = ( {showDinners}) => {

    const {id} = useParams();
    const [dinners, setDinners] = useState(null)
    

    useEffect(()=>{
        db.collection('users').doc(id).collection('dinners').onSnapshot(snapshot =>{
            setDinners(snapshot.docs.map(doc =>({
                id: doc.id,
                dinner: doc.data()
            })))      
        })
       return(()=>{
           
       })

       
       
    },[id])
    
    
    useEffect(()=>{
        if(dinners){

            dinners.forEach((dinner)=>{
                let dinnerTime = new Date(new Date(`${dinner.dinner.date}T${dinner.dinner.time}`).getTime())
                let currentTime = new Date().getTime()
                if(dinnerTime < currentTime){
                    db.collection('users').doc(id).collection('dinners').doc(dinner.id).delete().then(
                        db.collection('users').doc(id).update({
                            dinners: firebase.firestore.FieldValue.increment(-1)
                        })
                    )
                    
                }
        })
        }
    },[dinners, showDinners, id])


    return ( 
        <div className="profileDinners">
        <h3 className="profileDinners__title">Twoje Uczty</h3>
        {dinners && <div className="profileDinners__wrapper">
            {dinners && dinners.map(({id, dinner})=>(
                <Link key={id} to={`/dinners/${id}`}><div  className="profileDinners__listItem">
                    <div className="profileDinners__upper">
                        <p className="dinnerProfile__date">{dinner.date}</p>
                        <p className="dinnerProfile__time">{dinner.time}</p>
                    </div>
                    <div className="profileDinners__down">
                        <p className="dinnerProfile__date">{dinner.city}</p>
                        <p className="dinnerProfile__time">{dinner.name}</p>
                    </div>
                    
                </div></Link>
            ))}
        </div>}
    </div>
     );
}
 
export default ProfileDinners;