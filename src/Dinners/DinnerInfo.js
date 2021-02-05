import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {db} from '../firebase'

const DinnerInfo = () => {

    const {id} = useParams();
    const [dinner, setDinner]  = useState([])
    const [invited, setInvited]  = useState([])
    
    useEffect(()=>{
    var docRef = db.collection("diners").doc(id);

    const test = docRef.collection("invited").onSnapshot(snapshot =>{
        setInvited(snapshot.docs.map(doc => doc.data()))
    })
    console.log(invited)
docRef.get().then((doc) => {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        setDinner(doc.data())
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }

}).catch((error) => {
    console.log("Error getting document:", error);
});
    
},[])



    return ( 
    (dinner && <div className="dinner-info">
        <div className="dinner-info__mainInfo">
            <h2 className="dinner-info__city">{dinner.city}</h2>
            <p className="dinner-info__date">{dinner.date} {dinner.time}</p>
            <p className="dinner-info__name">{dinner.name}</p>
            <p className="dinner-info__address">{dinner.address}</p>
            <p className="dinner-info__about">{dinner.about}</p>
        </div>

        <h4 className="dinner-info__header">Uczestnicy:</h4>
        {invited && <div className="dinner-info__box">
            {invited.map(user =>(
                <div className="dinner-info__user-box" key={user.id}>
                    <img src={user.avatar} alt="" className="dinner-info__avatar avatar"/>
                    <p className="dinner-info__user-name">{user.username}</p>
                </div>
            ))}
        </div>}
    </div>) );
}
 
export default DinnerInfo;