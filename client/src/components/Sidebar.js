import React, { useState } from 'react';
import { TbLayoutSidebarRightExpand, TbLayoutSidebarLeftExpand  } from 'react-icons/tb'

// TODO: Add resize functionality and close functionality

function Sidebar ({content}) {
    const [visible, setVisible] = useState(true)
    const handleClick = () => {
        setVisible(!visible);
    }

  return(
    <div className={`sidebar ${visible && 'visible'}`}>
        <div>{!visible && <TbLayoutSidebarRightExpand onClick={handleClick} /> }</div>
        {visible && (
        <aside className="resize">
            <TbLayoutSidebarLeftExpand onClick={handleClick} />
            <h1>Info</h1>
            <div className="sidebar-content text-left">
                {content}
            </div>
        </aside>
        )}
    </div>
  )
  }

  export default Sidebar;