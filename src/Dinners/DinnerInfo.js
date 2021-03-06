import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {auth, db} from '../firebase'
import LeaveDinner from "./LeveDinner";
import Timer from "../Timer";
import firebase from 'firebase'
import Site404 from "../Site404";
import Loader from "../Loader";
import { useSelector } from "react-redux";

const DinnerInfo = () => {

    const {id} = useParams();
    const [dinner, setDinner]  = useState(null)
    const [invited, setInvited]  = useState([])
    const [dinnerMaker, setDinnerMaker]  = useState(null)
    const [currentUser, setCurrentUser] =useState(null);
    const [currentUserId, setCurrentUserId] =useState(null);
    const [alreadyJoined, setAlreadyJoined] = useState(false)
    const [isMaker, setIsMaker] = useState(true)
    const [avatar, setAvatar] = useState(false)
    const [loading, setLoading] = useState(true)
    const { loggedUserId} = useSelector(state => state.takeData)
    const addInvited = ()=>{
            db.collection('diners').doc(id).collection("invited").add({
            avatar: avatar,
            username: currentUser,
            id: currentUserId
            
        })
        db.collection('users').doc(auth.X).collection('dinners').doc(id).set({
            date: dinner.date,
            name: dinner.name,
            time: dinner.time,
            city: dinner.city,
            id: id
        })
        db.collection('users').doc(auth.X).update({
            dinners: firebase.firestore.FieldValue.increment(1)
        })
    }



    useEffect(()=>{
        auth.onAuthStateChanged(user => {
        if (user) {
            setCurrentUser(user.displayName)
            setCurrentUserId(user.X.X)
            db.collection('users').doc(user.X.X).onSnapshot((doc)=>{
                setAvatar(doc.data().avatar)
            })
            
            } else {
        setCurrentUser(null)
        setCurrentUserId(null)
            }
        });
    var docRef = db.collection("diners").doc(id);
    var docRefToDinnerMaker = db.collection('diners').doc(id).collection("dinnerMaker")
        docRefToDinnerMaker.onSnapshot(snapshot =>{
            setDinnerMaker(snapshot.docs.map(doc=> ({
                maker: doc.data(),
                id: doc.id})))
        })
    docRef.collection("invited").onSnapshot(snapshot =>{
        setInvited(snapshot.docs.map(doc =>({ 
            id: doc.id,
            invitedUser: doc.data()})))
    })
    // console.log(invited)
docRef.get().then((doc) => {
    if (doc.exists) {
        // console.log("Document data:", doc.data());
        setDinner(doc.data())
        setLoading(false)
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        setLoading(false)
    }

}).catch((error) => {
    console.log("Error getting document:", error);
});
    return()=>{
        setCurrentUser(null)
        setCurrentUserId(null)
        setDinner(null)
        setLoading(null)
        setInvited(null)
        setDinnerMaker(null)
    }
},[id])

useEffect(()=>{
    if(dinnerMaker){

        if(dinnerMaker[0].maker.id === loggedUserId ){
            setIsMaker(true)
        }else{
            setIsMaker(false)
        }
    }
    return()=>{
        setIsMaker(null)
    }
},[dinnerMaker, loggedUserId])

useEffect(()=>{
    
    if(invited){
        
        for (let i = 0; i < invited.length; i++) {
            if(invited[i].invitedUser.id === auth.X){
                setAlreadyJoined(true)
                break;
            }
            else{
                setAlreadyJoined(false)
            }
            
        }
    }
    return()=>{
        setAlreadyJoined(null)
    }

},[invited])


    return ( 
    (!loading ? (dinner ? <div className="dinner-info">
        <Timer date={dinner.date} time={dinner.time} id={id}/>
        <div className="dinner-info__mainInfo">
            <h2 className="dinner-info__city">{dinner.city}</h2>
            <p className="dinner-info__date">{dinner.date} {dinner.time}</p>
            <p className="dinner-info__name">{dinner.name}</p>
            <p className="dinner-info__address">{dinner.address}</p>
            <p className="dinner-info__about">{dinner.about}</p>
        </div>

        <h4 className="dinner-info__header">Uczestnicy:</h4>
        {invited && <div className="dinner-info__box">
            
            {dinnerMaker.map(({maker, id}) =>(
                <div className="dinner-info__user-box dinner-info__user-box--maker" key={id}>
                    <img src={maker.avatar} alt="" className="dinner-info__avatar avatar"/>
                    <p className="dinner-info__user-name"> <Link to={`/users/${maker.id}`}>{maker.username} </Link></p>
                    
                </div>
            ))}
            {invited.map(({id, invitedUser}) =>(
                <div className="dinner-info__user-box" key={id}>
                    <img src={invitedUser.avatar} alt="" className="dinner-info__avatar avatar"/>
                   
                        <p className="dinner-info__user-name"> <Link to={`/users/${invitedUser.id}`}>{invitedUser.username} </Link></p>
                       
                    {(currentUser === invitedUser.username ? <LeaveDinner  id={id}  /> : false)}
                </div>
            ))}
        </div>}
        {
            !currentUser ? <p>Aby dołączyć do uczty musisz się zalogować</p> :
                (alreadyJoined || isMaker ? <p>Już dołączyłeś do tej uczty</p> :
                <button className="primary-btn" onClick={()=> addInvited()}>Dołącz</button>)

        
        }
    </div>: <Site404/> ) : <Loader/>));
}

export default DinnerInfo;