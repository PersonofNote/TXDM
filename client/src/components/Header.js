function Header({logo, leftLinks=null, rightLinks=null, sticky=false, bgColor }) {
    const renderLinks = (links) => links.map(link => <a href={link.href}>{link.text}</a>)
  return (
      <header className="header" style={{backgroundColor: bgColor}}>
        {logo && logo}
        { leftLinks &&
        <div className='left'>{renderLinks(leftLinks)}</div>
        }
        {rightLinks &&
        <div className='right'>{renderLinks(rightLinks)}</div>
        }
      </header>
  );
}

export default Header;
