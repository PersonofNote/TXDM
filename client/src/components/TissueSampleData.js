/* eslint-disable */

/* TODO: Finish the button loop for adding tissue */

import { useState } from 'react'
import constants from '../data'
import { adjustPropertySizebyTextLength } from '../helpers'

// Icons
import { GoBeaker } from 'react-icons/go'
import { BiDna } from 'react-icons/bi'
import { FaMicroscope, FaInfoCircle } from 'react-icons/fa'


function TissueSampleSelect({addTissueSample, tissueType, explainer_data}) {
    const [state, setState] = useState({
        exercise: "jog",
        minutes: 15,
        interval: "day",
      })
        
    const handleClick = e => {
        const value = e.target.value;
        console.log(value)
        setState({
          ...state,
          [e.target.name]: value,
        });
    };

    const cancerValues = constants.cancer
    const rareDiseaseValues = constants.rareDisease 
    // TODO: Extract into single, reusable component
    const cancerUnhealthyButtons = cancerValues.unhealthySample.map((val) => {
      const padding = adjustPropertySizebyTextLength(val)
      return <button multiple name="tissueType" className={`m-2 button leading-tight`} style={{ margin: '2px', padding }} onClick={handleClick} value={val} key={`form-unhealthy-sample-${val}`}>{val}</button>
    })

    const unitDropdown = constants.tissue_sample_units.map(unit => 
        <option key={unit} value={unit}>{unit}</option>
      )
    
    return(
        <div>
            <div className="flex flex-row flex-wrap justify-center">
            {cancerUnhealthyButtons }
            </div>
            <div className="form-element">
              <h3 className="helper-text visible">How much do you have?</h3>
              <div className="flex flex-row justify-center">
              <label htmlFor="quantity" className="flex justify-center items-center"><GoBeaker className="icon animate-grow" style={{fill: '#0077b6'}} /> <span className="pl-2 font-semibold">Quantity:  </span></label>
              <input required  style={{maxWidth: '50px', paddingLeft: '4px'}} type="number" id="quantity" name="quantity" min="1" max="10000" />
              <select name="units" id="units">
                {unitDropdown}
              </select>
              </div>
          </div>
            <button onClick={() => addTissueSample(state)}>Add</button>
        </div>
            )
}


export default TissueSampleSelect;