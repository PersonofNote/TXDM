import React from 'react'
import { Link } from 'react-router-dom';

function Header ({ logo, leftLinks = null, rightLinks = null, sticky = false, textColor="black", bgColor, user, setUser }) {
  console.log(user?.companyId)
  const handleLogout = () => {
    localStorage.removeItem('PMMUser')
    setUser(null);
}
  const renderLinks = (links) => links.map(link => <a style={{color: textColor}} key="" href={link.href}>{link.text}</a>)
  return (
      <header className={`header flex flex-row justify-between ${sticky && 'sticky'}`} style={{ backgroundColor: bgColor }}>
        {logo && logo}
        <div className='left text-left'>
        { leftLinks &&
          renderLinks(leftLinks)
        }
        </div>
        <div className='right'>
          {rightLinks &&
            renderLinks(rightLinks)
          }
          {user &&
            ( <>
              <Link to={`/dashboard/${user?.companyId}`} className="text-white"> Dashboard </Link>
              <button onClick={handleLogout}>Sign Out</button>
            </>
          )}
        </div>
      </header>
  )
}

export default Header
