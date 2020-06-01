import React, { useState, useContext } from 'react';
import { AppContext } from '../index';

import '../styles/GraphiQlSearch.sass';

const GraphiQlSearch = ({ activeTab, endpoints }) => {
  const { dispatch } = useContext(AppContext);
  let [dropdownOpen, openDropdown] = useState(false);

  const closeDropdown = () => {
    setTimeout(() => openDropdown(false), 300);
  };
  return (
    <div className="graphiql-search">
      <input
        className={`${dropdownOpen ? 'active' : ''}`}
        onFocus={() => openDropdown(true)}
        onBlur={() => closeDropdown()}
        type="text"
        placeholder="URL for request..."
        onChange={(e) => {
          dispatch({
            type: 'CHANGE_TAB_ROUTE',
            payload: activeTab.id,
            value: e.target.value,
          });
        }}
        value={activeTab.route}
      />
      {dropdownOpen && (
        <div className="search-dropdown-container">
          <div className="search-dropdown">
            {endpoints.map((item, index) => (
              <div
                onClick={() =>
                  dispatch({
                    type: 'CHANGE_TAB_ROUTE',
                    payload: activeTab.id,
                    value: item.route,
                  })
                }
                key={index}
                className={`search-dropdown-item ${
                  item.route === activeTab.route ? 'active' : ''
                }`}
              >
                {`${item.route}`}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default GraphiQlSearch;
