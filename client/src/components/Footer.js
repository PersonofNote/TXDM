import React from 'react'

function Footer ({ logo = null, links = null, socialIcons = null, copyrightText = null, bgColor }) {
  const renderLinks = (links) => links.map(link => <a key={''} href={link.href}>{link.text}</a>)
  const year = new Date().getFullYear()
  return (
      <footer className="footer" style={{ backgroundColor: bgColor }}>
        {logo && logo}
        { links &&
        <div className='left'>{renderLinks(links)}</div>
        }
        {
          socialIcons && socialIcons
        }
        Copyright {year} {copyrightText}
      </footer>
  )
}

export default Footer
