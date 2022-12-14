/* eslint-disable */

import React, { useState } from 'react'
// Preloaded id list from airtable
import constants from '../data'
import { adjustPropertySizebyTextLength } from '../helpers'
import './forms.css'
import './icons-animations.css'

// Components
import ResultsAccordion from './ResultsAccordion'
import Loader from './Loader'
import TissueSampleSelect from './TissueSampleData'

// Icons
import { GoBeaker } from 'react-icons/go'
import { BiDna } from 'react-icons/bi'
import { FaMicroscope, FaInfoCircle } from 'react-icons/fa'


import sampleData from '../data.json'

/* eslint-disable-next-line */ 
const url = process.env.NODE_ENV === 'development' ? "http://localhost:8080/api/post_sample" : `https://txdm-api.herokuapp.com/api/post_sample`

function TissueForm({populateSidebar}) {
  const [data, setData] = useState(
    {
      diagnosisType: null,
      tissueType: [],
      quantity: null
    }
  )
  const [loadingResults, setLoadingResults] = useState(false)
  const [results, setResults] = useState(null)
  const [hasBeenClicked, setHasBeenClicked] = useState(false);

  const handleSelect = async e => {
    // TODO: consider breaking this up into smaller pieces and offering more customization
    if (e.currentTarget.name === 'quantity') {
      e.preventDefault()
      const unitsDiv = document.getElementById('units')
      setData({ ...data, [e.target.name]: `${e.currentTarget.value} ${unitsDiv.value} ` })
    } else {
      if (e.target.name==="tissueType") {
        e.preventDefault()
        const val = e.target.value
        const propName = e.target.name
        if (!hasBeenClicked) {
          setHasBeenClicked(true);
        }
        if (data[propName].includes(val)) {
          // Remove from list
          setData({ ...data, [propName]: data[propName].filter(element => element !== val) })
        } else {
          // Add to list
          setData({...data, [propName]: [...data[propName], val]})
        }
        
      } else {
        // Check for the state where it's cancer vs rare disease and that's changed!
        setData({ ...data, [e.target.name]: e.currentTarget.value })
      }
    }
  }

  const resetForm = () => {
    setData({
      diagnosisType: null,
      tissueType: [],
      quantity: null
    })
    setHasBeenClicked(false)
    setResults(null)
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
        setLoadingResults(false)
        console.log(data)
        setResults(data.data)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }


  // MENU OPTION CREATION STEPS

  const cancerValues = constants.cancer
  const rareDiseaseValues = constants.rareDisease 
  // TODO: Extract into single, reusable component
  const cancerUnhealthyButtons = cancerValues.unhealthySample.map((val) => {
    const padding = adjustPropertySizebyTextLength(val)
    return <button multiple name="tissueType" className={`m-2 button leading-tight ${data['tissueType'].includes(val) ? 'active' : ''}`} style={{ margin: '2px', padding }} onClick={handleSelect} value={val} key={`form-unhealthy-sample-${val}`}>{val}</button>
  })
  const cancerHealthyTissueButtons = cancerValues.healthySample.map((val) => {
    const padding = adjustPropertySizebyTextLength(val)
    return <button multiple name="tissueType" className={`m-2 button leading-tight ${data['tissueType'].includes(val) ? 'active' : ''}`} style={{ margin: '2px', padding }} onClick={handleSelect} value={val} key={`form-health-sample-${val}`}>{val}</button>
  })
  const rareDiseaseButtonSelects = rareDiseaseValues.map((val) => {
    const padding = adjustPropertySizebyTextLength(val)
    return <button multiple name="tissueType" className={`m-2 button leading-tight ${data['tissueType'].includes(val) ? 'active' : ''}`} style={{ margin: '2px', padding }} onClick={handleSelect} value={val} key={`form-sample-${val}`}>{val}</button>
  })

  const cancerButtonsSection = <>
    <h4 className="p-2">Tumor or Diseased Tissue</h4>
    <div className="flex flex-row flex-wrap justify-center max-w-m">
      {cancerUnhealthyButtons} 
    </div> 
    <h4 className="w-full text-center p-2">Non-Tumor or Healthy Tissue</h4>
    <p className="text-xs font-semibold w-2/3 p-2">Diseased /Tumor Tissue must be run with a healthy control tissue, such as Whole Blood, or Healthy Adjacent Tissue</p>
    <div className="flex flex-row flex-wrap justify-center max-w-m"> 
      {cancerHealthyTissueButtons} 
    </div> 
    </>

  const unitDropdown = constants.tissue_sample_units.map(unit => 
    <option key={unit} value={unit}>{unit}</option>
  )

  // Consider a dropdown to learn more
  // TODO: Get linked data types
  /*
  const resultsDisplay = results.map(r =>
  <li key={r.id}> <h3>{r.fields['Machine / Assay']}</h3>
  Diagnostic Company: {r.fields['Diagnostic Company']}. {r.fields.Description} <br/>
  Derived from: {r.tissue_sample_name.join(', ')} <br/>
  <a href={r.fields['Technical Documentation / Protocol']}>Technical Documentation / Protocol</a></li>)
    */
  return (
    <>
    {loadingResults && <Loader />}
    
    {!results && !loadingResults && results !== undefined && (
      <>
      <div className="flex flex-row justify-center">
      <input type="checkbox" id="scales" name="scales" />
      <label className="pl-2 flex flex-row align-center" for="scales">Only show CLIA results <span className="pl-2"><FaInfoCircle className="info-button" data-info={sampleData.sidebar_sample[3]} onClick={populateSidebar} /></span></label>
    </div>
      <form>
          <div className="form-element">
          <h3 className={`helper-text ${data.diagnosisType === null && 'visible'}`}>Are You Looking For:</h3>
          <div className="flex justify-center items-center"><BiDna className="icon animate-grow" style={{fill: '#0077b6'}}/><h4 className="pl-2 font-semibold"> Diagnosis Type </h4> <span className="pl-2"> <FaInfoCircle className="info-button" data-info={sampleData.sidebar_sample[1]} onClick={populateSidebar} /></span></div>
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
      <div className="form-check inline-block">
            <input onClick={handleSelect} className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" id="cancer" name="diagnosisType" value="cancer" />
            <label className="form-check-label inline-block text-gray-800" htmlFor="flexRadioDefault1">
              General
            </label>
      </div>
            </div>
          </div>
          { data.diagnosisType != null && (
          <div className="form-element">
          <h3 className={`helper-text ${data.tissueType.length < 1 && !hasBeenClicked && 'visible'}`}>What kind of tissue is it?</h3>
          <label className="flex justify-center items-center" htmlFor="tissueType"><FaMicroscope className="icon animate-grow" style={{fill: '#0077b6'}} /> <h4 className="pl-2 font-semibold" style={{padding: '8px'}}>Tissue Type</h4> <span className="pl-2"> <FaInfoCircle className="info-button" data-info={sampleData.sidebar_sample[2]} onClick={populateSidebar} /></span></label>
          <div className="flex flex-row flex-wrap justify-center max-w-m">
            {data.diagnosisType && data.diagnosisType === 'cancer' ? cancerButtonsSection : rareDiseaseButtonSelects}
          </div>
          {hasBeenClicked && data.tissueType.length < 1 && <div className="error">Please select at least one tissue type </div>}
          </div>
          )
}
          {/*
          <div className="form-element">
          <h3 className={`helper-text`}>What kind of tissue is it?</h3>
          <label className="flex justify-center items-center" htmlFor="tissueType"><FaMicroscope className="icon animate-grow" style={{fill: '#0077b6'}} /> <h4 className="pl-2 font-semibold" style={{padding: '8px'}}>Tissue Type</h4> <span className="pl-2"> <FaInfoCircle className="info-button" data-info={sampleData.sidebar_sample[1]} onClick={populateSidebar} /></span></label>
            <div className="flex flex-row flex-wrap justify-center max-w-m"></div>
          <TissueSampleSelect explainer_data={sampleData.sidebar_sample} />
          </div>
        */}
          {data.tissueType.length > 0 && (
          <div className="form-element">
              <h3 className={`helper-text ${data.quantity === null && 'visible'}`}>How much do you have?</h3>
              <div className="flex flex-row justify-center">
              <label htmlFor="quantity" className="flex justify-center items-center"><GoBeaker className="icon animate-grow" style={{fill: '#0077b6'}} /> <span className="pl-2 font-semibold">Quantity:  </span></label>
              <input required onChange={handleSelect} style={{maxWidth: '50px', paddingLeft: '4px'}} type="number" id="quantity" name="quantity" min="1" max="10000" />
              <select name="units" id="units">
                {unitDropdown}
              </select>
              </div>
          </div>
          )}
      {data.quantity != null && data.tissueType.length > 0 && data.quantity != null && data.quantity !== "" && (
      <span className="m-auto pt-6"><button className='button' onClick={handleSubmit}>Submit </button></span>
      )}
      </form>
      </>
    )}
    {!loadingResults && results && results !== undefined && results.length > 0 && (
      <>
      <h1>Results:</h1>
      <div className="results accordion p-4">
        {results.map(r => (
          <ResultsAccordion key={r.id} content={r} />
        ))}
        </div>
        <span className="flex justify-center"><button className="button" onClick={resetForm}> Start Over</button></span>
      </>
    )}
    {
      (results && results.length < 1)  && (
        <>
        <div style={{maxWidth: `550px`, margin: 'auto', height: `250px`, display: 'flex', alignItems: 'center'}}>There are no results for the combination selected; please select a different combination and try again.</div>
        <span className="flex justify-center"><button className="button" onClick={resetForm}> Start Over</button></span>
        </>
      )
    }
    { results === undefined && (
      <>
      <div>Something went wrong, please try again</div>
      <span className="flex justify-center"><button className="button" onClick={resetForm}> Start Over</button></span>
      </>
    )
    }
    </>
  )
}

export default TissueForm
