import {useState} from 'react';
// Preloaded id list from airtable
import constants from '../data';
import { adjustPropertySizebyTextLength } from '../helpers'
import './forms.css'

const url = "http://localhost:5000/api/post_sample"

function TissueForm() {
  const [data, setData] = useState(
    {
        diagnosisType: null,
        tissueType : null,
        quantity: null
    }
  )
  const [activeMultiSelect, setActiveMultiSelect] = useState([])
  const [loadingResults, setLoadingResults] = useState(false)
  const [results, setResults] = useState([])

  const handleSelect = e => {
    e.preventDefault();
    if (e.currentTarget.name === 'quantity'){
        const unitsDiv = document.getElementById("units")
        setData({...data, [e.target.name]: `${e.currentTarget.value} ${unitsDiv.value} `})
    }else{
      if (e.target.multiple){
        if(activeMultiSelect.includes(e.target.value)){
          // Remove from list
          const updatedList = activeMultiSelect.filter(element => element !== e.target.value)
          console.log("UPDATED")
          console.log(updatedList)
        
          setActiveMultiSelect(updatedList, setData({...data, [e.target.name]: activeMultiSelect}))
          
        }else{
          // Add to list
          setActiveMultiSelect([...activeMultiSelect, e.currentTarget.value])
          console.log(activeMultiSelect)
          setData({...data, [e.target.name]: activeMultiSelect})
        }
      }else{
        setData({...data, [e.target.name]: e.currentTarget.value})
      }
    }
    console.log(JSON.stringify(data))
  }

  const handleSubmit = e => {
    e.preventDefault()
    setLoadingResults(true)
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
            setLoadingResults(false)
            console.log(data)
        })
        .catch((error) => {
            console.error('Error:', error);
        });

  }
  const selectValues = constants.tissue_sample_types
  const dropdown = Object.keys(selectValues).map((val) =>
  <option value={selectValues[val]} key={`form-${val}`}>{selectValues[val]}</option>
);
  // Option for dropdown
const dropdownElement = <select required onChange={handleSelect} multiple name="tissueType" id="tissueType">
{dropdown}
</select>

// TODO: Extract into own function
const buttonSelects = Object.keys(selectValues).map((val) => {
  const padding = adjustPropertySizebyTextLength(selectValues[val])
  return <button multiple name="tissueType" className={`m-2 button leading-tight ${activeMultiSelect.includes(selectValues[val]) ? 'active' : ""}`} style={{margin: '2px', padding: padding}} onClick={handleSelect} value={selectValues[val]} key={`form-${val}`}>{selectValues[val]}</button>
}
);

const loader = "Loading"

// TODO: preload the data type links so it displays nice.
// Consider a dropdown to learn more
const resultsDisplay = results.map(r => <li key={r.id}> {r.fields['Data Type']} Provided by: {r.fields['Diagnostic Company']}. {r.fields['Description']}</li>)
  return (
    <>
    <h2>Tell us about your sample</h2>
    <form>
        <div className="form-element">
        <h3 className={`helper-text ${data.diagnosisType === null && 'visible'}`}>Is it...</h3>
        <div>Diagnosis Type</div>
        <div className="flex flex-row justify-center">
        <div class="form-check">
            <input className="radio form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" onClick={handleSelect} type="radio" id="cancer" name="diagnosisType" value="cancer"/>
            <label htmlFor="cancer">Cancer</label>
            </div>
            <span className="p-2">
            <input className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" onClick={handleSelect} type="radio" id="rareDisease" name="diagnosisType" value="rareDisease" />
            <label htmlFor="rareDisease">Rare Disease</label>
            </span>
        </div>
        </div>
        <div className="flex justify-center">
  <div>
    <div className="form-check inline-block">
      <input className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" id="cancer" name="diagnosisType" value="cancer" />
      <label className="form-check-label inline-block text-gray-800" htmlFor="flexRadioDefault1">
        Cancer
      </label>
    </div>
    <div className="form-check inline-block">
      <input className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="diagnosisType" id="rareDisease" />
      <label className="form-check-label inline-block text-gray-800" htmlFor="flexRadioDefault2">
        Rare Disease
      </label>
    </div>
  </div>
</div>
        {data.diagnosisType != null &&(
        <div className="form-element">
        <h3 className={`helper-text ${data.tissueType === null && 'visible'}`}>What kind of tissue is it?</h3>
        <label htmlFor="tissueType">Tissue Type:</label>
        <div className="flex flex-row flex-wrap justify-center max-w-m">
          {buttonSelects}
        </div>
        </div>
        )}
        {data.tissueType != null &&(
        <div className="form-element">
            <h3 className={`helper-text ${data.quantity === null && 'visible'}`}>How much do you have?</h3>
            <label htmlFor="quantity">Quantity (number):</label>
            <input onChange={handleSelect} type="number" id="quantity" name="quantity" min="1" max="10000" />
            <label htmlFor='units'>Units</label>
            <select name="units" id="units">
            <option value=" μl"> μl</option>
            <option value="ml">ml</option>
            <option value="cc">cc</option>
            <option value="tubes">tubes</option>
            </select>
        </div>
        )}
    {data.quantity != null &&(
    <button className='button p-2' onClick={handleSubmit}>Submit </button>
    )}
    </form>
    <div>{loadingResults ? loader : resultsDisplay}</div>
    </>
  );
}

export default TissueForm;
