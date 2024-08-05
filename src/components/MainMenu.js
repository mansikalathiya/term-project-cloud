// components/MainMenu.js
import React, { useState } from 'react';
import UserInfo from './UserInfo';

function MainMenu() {
  const [activeItem, setActiveItem] = useState('Discover');

  const navItems = [
    { icon: 'fa fa-map', text: 'Discover' },
    { icon: 'fa fa-arrow-trend-up', text: 'Trending' },
    { icon: 'fa fa-compact-disc', text: 'Album' },
    { icon: 'fa fa-circle-play', text: 'Playlist' },
    { icon: 'fa fa-heart', text: 'Favorites' },
  ];

  const bottomNavItems = [
    { icon: 'fa fa-user', text: 'Account' },
    { icon: 'fa fa-gear', text: 'Settings' },
    { icon: 'fa fa-right-from-bracket', text: 'Logout' },
  ];

  return (
    <nav className="main-menu">
      <div>
        <UserInfo />
        <ul>
          {navItems.map((item) => (
            <li
              key={item.text}
              className={`nav-item ${activeItem === item.text ? 'active' : ''}`}
              onClick={() => setActiveItem(item.text)}
            >
              <a href="#">
                <i className={`nav-icon ${item.icon}`}></i>
                <span className="nav-text">{item.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <ul>
        {bottomNavItems.map((item) => (
          <li key={item.text} className="nav-item">
            <a href="#">
              <i className={`nav-icon ${item.icon}`}></i>
              <span className="nav-text">{item.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default MainMenu;