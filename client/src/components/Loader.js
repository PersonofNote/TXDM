import React from 'react'
import './loader.css'

const Loader = () => {
  return (
    <div className="flex mt-12 items-center justify-center">
    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    </div>
  )
}

export default Loader
