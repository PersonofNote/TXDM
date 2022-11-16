import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import '../styles/dashboard.css';
import data from '../data.json'

/*
import { MdEmail } from 'react-icons/md'
import { AiFillPhone } from 'react-icons/ai'   
import { CgWebsite } from 'react-icons/cg'
import { RiContactsLine } from 'react-icons/ri'
*/

import Loader from '../components/Loader';
import ProfileEditView from '../components/ProfileEditView'
import ContactCard from '../components/ContactCard'

const CompanyDashboard = ({user}) => {
        // TODO: check for user id matches url param and add edit buttons only if that is true. This will allow other people to look at the page.
    if (!user) {
        return <Navigate to="/signup" replace />;
    }
    const companyFields = data.company_fields; 

    const [companyData, setCompanyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        fetch(`${url}?` + new URLSearchParams({
            id: user?.companyId,
        })).then(response => response.json())
        .then(res => {
            setCompanyData(res.msg, setLoading(false))
        })
        .catch(error => {
            console.log(error)
            // handle the error
        });
      },[user])
    


    const filterContactFields = (fields) => {
        const contactFields = ['email', 'phone', 'website', 'contact name' ];
        console.log(fields.filter(field => contactFields.includes(field.toLowerCase())))
        return fields.filter(field => contactFields.includes(field.toLowerCase()))
    }
    
    console.log(filterContactFields(companyFields, companyData));

    /* eslint-disable-next-line */ 
    const url = process.env.NODE_ENV === 'development' ? "http://localhost:8080/api/provider/profile/" : `https://txdm-api.herokuapp.com/api/post_sample`
    
    if (loading) return <Loader />
    
    return (
        <div className="App">
            <div className="main">
                <div className="title-logo flex-large flex-row items-center justify-center pb-12">
                    {companyData.fields['DX co Logo'] && (
                        <img className='pr-2-lg m-auto' alt={companyData.fields['DX co Logo'][0].filename} src={companyData.fields['DX co Logo'][0].url} width='96px'></img>
                    )}
                    <h1 className="text-center pr-12-lg mr-12-lg">
                    {companyData.fields['Name']}
                    </h1>
                </div>
                {editMode ? <ProfileEditView companyData={companyData} companyFields={companyFields} user={user}/>: (
                    <ContactCard fields={filterContactFields(companyFields)} data={companyData.fields} />
                )
                }
                <button onClick={() => setEditMode(!editMode)} className="button m-auto mt-4">{editMode ? "Exit Editing" : "Edit Mode"}</button> 
            </div>  
        </div>
        );
}

export default CompanyDashboard;