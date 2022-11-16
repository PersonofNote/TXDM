import React, {useState} from 'react'
import '../App.css'

import Footer from '../components/Footer'
import TissueForm from '../components/TissueForm'
import Sidebar from '../components/Sidebar'
import sampleData from '../data.json'

const TissueInputPage = () => {
  const [sidebarData, setSidebarData] = useState(sampleData.sidebar_sample[0])

  const populateSidebar = e => {
      // TODO: force open sidebar on populate
    e.preventDefault()
    setSidebarData(e.currentTarget.dataset.info)
    console.log(e.currentTarget)
    console.log(e.currentTarget.dataset.info)
  }

  return (
    <div className="App">
      <div className="main">
      <div className="content">
        <TissueForm populateSidebar={populateSidebar} />
      </div>
        <Sidebar content={sidebarData} visible={true}/>
      </div>
      <Footer copyrightText={"TXDM"}/>
    </div>
  )
}

export default TissueInputPage
