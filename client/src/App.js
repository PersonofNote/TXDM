import React, {useState} from 'react'
import './App.css'

import Header from './components/Header'
import Footer from './components/Footer'
import TissueForm from './components/TissueForm'
import Sidebar from './components/Sidebar'
import sampleData from './data.json'

// TODO: Add React Router

// TODO: Keep track of active buttons at this level?

function App () {
  const [sidebarData, setSidebarData] = useState(sampleData.sidebar_sample[0])

  const populateSidebar = e => {
    e.preventDefault()
    setSidebarData(e.currentTarget.dataset.info)
    console.log(e.currentTarget)
    console.log(e.currentTarget.dataset.info)
  }

  return (
    <div className="App">
      <Header leftLinks={sampleData.header_links} textColor={'white'}/>
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

export default App
