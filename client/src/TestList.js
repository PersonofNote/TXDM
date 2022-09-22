import {useState, useEffect} from 'react';

function TestList({url}) {
  console.log(url)
   const [users, setUsers] = useState([])

   useEffect(() =>{
    // TODO: Check syntax here
    fetch(url)
    .then((response) => {
        console.log(response)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((response) => {
      console.log(response)
      setUsers(response)
    });
   })

   // Map list to attributes; consider making this a less-opinionated component that
   // can render an arbitrary table like the endpoint can

    
    return (
      <div className="">
        
      </div>
    );
  }
  
  export default TestList;