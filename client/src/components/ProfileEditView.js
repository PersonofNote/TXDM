import React, { useState } from 'react'
import '../styles/dashboard.css';

/*
import { MdEmail } from 'react-icons/md'
import { AiFillPhone } from 'react-icons/ai'   
import { CgWebsite } from 'react-icons/cg'
import { RiContactsLine } from 'react-icons/ri'
*/

import UploadAndDisplayImage from './UploadAndDisplayImage';


/* eslint-disable-next-line */ 
const url = process.env.NODE_ENV === 'development' ? "http://localhost:8080/" : `https://txdm-api.herokuapp.com/`

const ProfileEditView = ({companyFields, companyData, user}) => {
    const [formValues, setFormValues] = useState({});

    const [message, setMessage] = useState(null)

    const handleChange = e => {
        const attName = e.currentTarget.name;
        const value = e.currentTarget.value;
        if (e.currentTarget.files){
            setFormValues({...formValues, [attName]: e.currentTarget.files[0]}, console.log(formValues))
        }else{
            setFormValues({...formValues, [attName]: value}, console.log(formValues))
        }
    }

    /*
    const normalizedFields = (fields, values) => {
        return fields.map((field, index) => (
            <div className="provider-data" key={index}>
                <span>{field}:</span>
                <span>{values[field]}</span> 
            </div>
        ))
    }
    */
   
    const normalizedFields = (fields, values) => {
        return fields.map((field, index) => {
            if (field === 'DX co Logo') { 
                return (
           <UploadAndDisplayImage key={index} id={`${field}-input`} handleChange={handleChange}/>
        )}else { return (
            <div className="w-50" key={index}>
            <div className="mb-4">
                <label>{field}</label>
                <input
                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                id={`${field}-input`}
                placeholder={values[field]}
                onChange={handleChange}
                value={formValues.password}
                label={field} 
                name={field}
                />
            </div>
        </div>
        )
        }   
    })
    }


    const handleSubmit = () => {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(formValues)
            }
            try {
            fetch(`${url}api/provider/profile/${user?.companyId}`, requestOptions)
                .then(response => response.json())
                .then(res => {
                    console.log(res)
                })
            }catch (err) {
                setMessage(err.message)
            }
        }
    
    return (
        <div>
            <span className="error">{message}</span>
            <form className="provider-data">
            {companyData?.fields && normalizedFields(companyFields, companyData.fields)}
            <div className="text-center pt-1 mb-12 pb-1 w-25">
            <button
                    onClick={handleSubmit}
                    className="bg-black text-white inline-block px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full mb-3"
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    
                >
                    Save Changes
                </button>
                </div>
                </form>
        </div>
        );
}

export default ProfileEditView;