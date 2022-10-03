import React, { useState } from 'react'
// Preloaded id list from airtable
import constants from '../data'
import { adjustPropertySizebyTextLength } from '../helpers'
import './forms.css'

// Components
import Accordion from './Accordion'

// Icons
import { GoBeaker } from 'react-icons/go'
import { BiDna } from 'react-icons/bi'
import { FaMicroscope } from 'react-icons/fa'

/* eslint-disable-next-line */ 
const url = `https://txdm-api.herokuapp.com/api/post_sample`

function TissueForm () {
  const [data, setData] = useState(
    {
      diagnosisType: null,
      tissueType: null,
      quantity: null
    }
  )
  const [activeMultiSelect, setActiveMultiSelect] = useState([])
  const [loadingResults, setLoadingResults] = useState(false)
  const [results, setResults] = useState([])

  const handleSelect = e => {
    // TODO: consider breaking this up into smaller pieces and offering more customization
    // BUG: Form is still one click behind
    if (e.currentTarget.name === 'quantity') {
      e.preventDefault()
      const unitsDiv = document.getElementById('units')
      setData({ ...data, [e.target.name]: `${e.currentTarget.value} ${unitsDiv.value} ` })
    } else {
      if (e.target.multiple) {
        // TODO: Consider detecting a button group specifically
        e.preventDefault()
        if (activeMultiSelect.includes(e.target.value)) {
          // Remove from list
          const updatedList = activeMultiSelect.filter(element => element !== e.target.value)
          setActiveMultiSelect(updatedList, setData({ ...data, [e.target.name]: activeMultiSelect }))
        } else {
          // Add to list
          setActiveMultiSelect([...activeMultiSelect, e.currentTarget.value], setData({ ...data, [e.target.name]: activeMultiSelect }))
        }
        setData({ ...data, [e.target.name]: activeMultiSelect })
      } else {
        setData({ ...data, [e.target.name]: e.currentTarget.value })
      }
    }
    console.log(JSON.stringify(data))
  }

  const resetForm = () => {
    setData({
      diagnosisType: null,
      tissueType: null,
      quantity: null
    })
    setActiveMultiSelect([])
    setResults([])
  }

  const handleSubmit = e => {
    e.preventDefault()
    setLoadingResults(true)
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((data) => {
        // TODO: Make a cute loader
        setLoadingResults(false)
        setResults(data.data)
        console.log(results)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }
  const selectValues = constants.tissue_sample_types
  /*
  const dropdown = Object.keys(selectValues).map((val) =>
  <option value={selectValues[val]} key={`form-${val}`}>{selectValues[val]}</option>
);
*/

  // Option for dropdown
  /*
const dropdownElement = <select required onChange={handleSelect} multiple name="tissueType" id="tissueType">
{dropdown}
</select>
*/

  // TODO: Extract into own function
  const buttonSelects = Object.keys(selectValues).map((val) => {
    const padding = adjustPropertySizebyTextLength(selectValues[val])
    return <button multiple name="tissueType" className={`m-2 button leading-tight ${activeMultiSelect.includes(selectValues[val]) ? 'active' : ''}`} style={{ margin: '2px', padding }} onClick={handleSelect} value={selectValues[val]} key={`form-${val}`}>{selectValues[val]}</button>
  }
  )

  const loader = 'Loading'

  // Consider a dropdown to learn more
  // TODO: Get linked data types]
  /*
  const resultsDisplay = results.map(r =>
  <li key={r.id}> <h3>{r.fields['Machine / Assay']}</h3>
  Diagnostic Company: {r.fields['Diagnostic Company']}. {r.fields.Description} <br/>
  Derived from: {r.tissue_sample_name.join(', ')} <br/>
  <a href={r.fields['Technical Documentation / Protocol']}>Technical Documentation / Protocol</a></li>)
    */
  return (
    <>
    {!results.length > 0 && (
      <>
      <h2>Tell us about your sample</h2>
      <form>
          <div className="form-element">
          <h3 className={`helper-text ${data.diagnosisType === null && 'visible'}`}>Are You Looking For:</h3>
          <div className="flex justify-center items-center"><BiDna /><h4> Diagnosis Type </h4></div>
          <div className="flex justify-center">
          <div className="form-check inline-block">
            <input onClick={handleSelect} className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" id="cancer" name="diagnosisType" value="cancer" />
            <label className="form-check-label inline-block text-gray-800" htmlFor="flexRadioDefault1">
              Cancer
            </label>
      </div>
      <div className="form-check inline-block">
        <input onClick={handleSelect} className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="diagnosisType" id="rareDisease" />
        <label className="form-check-label inline-block text-gray-800" htmlFor="flexRadioDefault2">
          Rare Disease
        </label>
      </div>
            </div>
          </div>
          {data.diagnosisType != null && (
          <div className="form-element">
          <h3 className={`helper-text ${data.tissueType === null && 'visible'}`}>What kind of tissue is it?</h3>
          <label className="flex justify-center items-center" htmlFor="tissueType"><FaMicroscope /> Tissue Type:</label>
          {data.tissueType && data.tissueType.length === 0 && <div>Please select at least one tissue type </div>}
          <div className="flex flex-row flex-wrap justify-center max-w-m">
            {buttonSelects}
          </div>
          </div>
          )}
          {data.tissueType != null && (
          <div className="form-element">
              <h3 className={`helper-text ${data.quantity === null && 'visible'}`}>How much do you have?</h3>
              <div className="flex flex-row justify-center">
              <label htmlFor="quantity" className="flex justify-center items-center"><GoBeaker /> Quantity (number):</label>
              <input onChange={handleSelect} type="number" id="quantity" name="quantity" min="1" max="10000" />
              <select name="units" id="units">
              <option value=" μl"> μl</option>
              <option value="ml">ml</option>
              <option value="cc">cc</option>
              <option value="tubes">tubes</option>
              </select>
              </div>
          </div>
          )}
      {data.quantity != null && data.tissueType.length > 1 && (
      <span className="m-auto"><button className='button' onClick={handleSubmit}>Submit </button></span>
      )}
      </form>
      </>
    )}
    <div>{loadingResults && loader}</div>
    {results.length > 0 && (
      <>
      <h1>Results:</h1>
      <div className="accordion p-4">
        {results.map(r => (
          <Accordion key={r.id} content={r} />
        ))}
        </div>
      <span className="flex justify-center"><button className="button" onClick={resetForm}> Start Over</button></span>
      </>
    )}
    </>
  )
}

export default TissueForm
