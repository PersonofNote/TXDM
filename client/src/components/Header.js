import React from 'react'

function Header ({ logo, leftLinks = null, rightLinks = null, sticky = false, textColor="black", bgColor }) {
  const renderLinks = (links) => links.map(link => <a style={{color: textColor}} key="" href={link.href}>{link.text}</a>)
  return (
      <header className={`header ${sticky && 'sticky'}`} style={{ backgroundColor: bgColor }}>
        {logo && logo}
        { leftLinks &&
        <div className='left text-left'>{renderLinks(leftLinks)}</div>
        }
        {rightLinks &&
        <div className='right'>{renderLinks(rightLinks)}</div>
        }
      </header>
  )
}

export default Header
