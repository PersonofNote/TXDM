import {useState, useEffect} from 'react';

function TestList({url}) {
   const [data, setData] = useState([])

   useEffect(() =>{
    const fetchData = async () => {
      const result =  await fetch(url)
      .then((response) => response.json())
      .then((data) => console.log(data));
    };
  
    fetchData();

   })

   // Map list to attributes; consider making this a less-opinionated component that
   // can render an arbitrary table like the endpoint can

    
    return (
      <div className="">
        
      </div>
    );
  }
  
  export default TestList;