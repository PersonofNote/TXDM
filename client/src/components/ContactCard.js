import React from 'react'

    const normalizedFields = (fields, values) => {
        return fields.map((field, index) => {
            const val = values[field]
            // If image, 
            return (
            typeof(val) === 'object' ? 
            <div className="provider-data" key={index}>
            <span>{field}:</span>
            <span>{val[0].filename}</span> 
             </div>
            : 
            (
            <div className="provider-data" key={index}>
                <span>{field}:</span>
                <span>{values[field]}</span> 
            </div>
        ))}
        )
    }

const ContactCard = ({fields, data}) => {
    return (
      <div className="max-w-sm w-50-lg">
        <h2> Contact</h2>
        {normalizedFields(fields, data)}
      </div>
    );
  }

export default ContactCard;


