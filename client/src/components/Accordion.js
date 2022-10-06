import React, { useState } from 'react'
import { BsCaretDownFill } from 'react-icons/bs'

const Accordion = ({ content }) => {
  const [isActive, setIsActive] = useState(false)

  return (
    <div className="accordion-item">
      <div className="accordion-title flex flex-row justifty-center items-center" onClick={() => setIsActive(!isActive)}>
        <h3>{content.fields['Machine / Assay']} from {content.fields['Diagnostic Company']}</h3>
        <button className={`svg-button arrow mt-1 ${isActive ? 'active' : ''}`}> <BsCaretDownFill/> </button>
      </div>
      {isActive && (
        <div className="accordion-content">
        <div className="accordion-description">{content.fields.Description}</div>
        <div><b>Derived from:</b> {content.tissue_sample_name.join(', ')} </div>
        <a href={content.fields['Technical Documentation / Protocol']}>Technical Documentation / Protocol</a>
        </div>
      )}
    </div>
  )
}

export default Accordion
