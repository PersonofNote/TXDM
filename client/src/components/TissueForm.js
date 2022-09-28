import {useState} from 'react';
// Preloaded id list from airtable
import constants from '../data';

const url = "http://localhost:5000/api/post_sample"

function TissueForm() {
  const [data, setData] = useState(
    {
        diagnosisType: null,
        tissueType : null,
        quantity: null
    }
  )

  const [results, setResults] = useState([])

  // TODO: determine how to gracefully reveal options
  // Could keep track of if this is the first time the button has been pressed
  // E.g. if data[name] === null increment step, else do nothing
  const [step, setStep] = useState(0)

  const handleSelect = e => {
    if (e.currentTarget.name === 'quantity'){
        const unitsDiv = document.getElementById("units")
        setData({...data, [e.target.name]: `${e.currentTarget.value} ${unitsDiv.value} `})
    }else{
        setData({...data, [e.target.name]: e.currentTarget.value})
    }
    console.log(JSON.stringify(data))
  }

  const handleSubmit = e => {
    e.preventDefault()
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((data) => {
            // TODO: Make a cute loader
            setResults(data.data)
            console.log(data)
            console.log(results)
            
        })
        .catch((error) => {
            console.error('Error:', error);
        });

  }
  const selectValues = constants.tissue_sample_types
  const dropdown = Object.keys(selectValues).map((val) =>
  <option value={val} key={`form-${val}`}>{selectValues[val]}</option>
);

// TODO: preload the data type links so it displays nice.
// Consider a dropdown to learn more
const resultsDisplay = results.map(r => <li key={r.id}> {r.fields['Data Type']} Provided by: {r.fields['Diagnostic Company']}. {r.fields['Description']}</li>)
  return (
    <>
    <form>
        <div>
        <input onClick={handleSelect} type="radio" id="cancer" name="diagnosisType" value="cancer"/>
        <label htmlFor="cancer">Cancer</label>
        <input onClick={handleSelect} type="radio" id="rareDisease" name="diagnosisType" value="rareDisease" />
        <label htmlFor="rareDisease">Rare Disease</label>
        </div>
        <div>
        <label htmlFor="tissueType">Select a Tissue Type:</label>
            <select required onChange={handleSelect} multiple name="tissueType" id="tissueType">
            {dropdown}
        </select>
        </div>
        <div>
            <label htmlFor="quantity">Quantity (number):</label>
            <input required onChange={handleSelect} type="number" id="quantity" name="quantity" min="1" max="10000" />
            <label htmlFor='units'>Units</label>
            <select name="units" id="units">
            <option value=" μl"> μl</option>
            <option value="ml">ml</option>
            <option value="cc">cc</option>
            <option value="tubes">tubes</option>
            </select>
        </div>
    <button onClick={handleSubmit}>Submit </button>
    </form>

    <div>{resultsDisplay}</div>
    </>
  );
}

export default TissueForm;
