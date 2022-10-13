import React, { useState } from 'react'
import { BsCaretDownFill } from 'react-icons/bs'

const ResultsAccordion = ({ content }) => {
    console.log("RESULTS CONTENT:")
    console.log(content)
  const [isActive, setIsActive] = useState(false)

  return (
    <div className="accordion-item">
      <div className="accordion-title flex flex-row justifty-center items-center" onClick={() => setIsActive(!isActive)}>
        <h3>{content.fields['Name']}</h3>
        <button className={`svg-button arrow mt-1 ${isActive ? 'active' : ''}`}> <BsCaretDownFill/> </button>
      </div>
      {isActive && (
        <div className="accordion-content">
        <div className="accordion-description">{content.fields.Description}</div>
        <div><b>Type: </b>{content.fields.Type}</div>
        <div><b>Benefits: </b> {content.fields['Benefits']}</div>
        <div><b>Limitations: </b>{content.fields['Limitations']}</div>
        <div><b>Gathered From: </b>{content.fields['Sample Type']}</div>
        </div>
      )}
    </div>
  )
}

export default ResultsAccordion