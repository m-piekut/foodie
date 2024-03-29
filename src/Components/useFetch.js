import {useState, useEffect} from 'react'

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() =>{

        const aboartCont = new AbortController()

        fetch(url, { signal: aboartCont.signal})
            .then(res => {
                if(!res.ok){
                    throw Error("nie można wczytać danych z tego źródła");
                    
                }
                return res.json()
            })
            .then((data)=>{
                setData(data)
                setIsPending(false)
            })
            .catch(err=>{
                if(err.name === 'AboartError') {
                }else{
                    setError(err.message);
                }
            })
            return () => aboartCont.abort();
    },[url]);
    return { data, isPending, error }
}
export default useFetch;