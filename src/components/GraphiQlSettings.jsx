import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from './CustomGraphiQL.jsx';

import '../styles/GraphiQlSettings.sass';
import settings from '../images/settings.png';

const GraphiQlSettings = () => {
  const { state, dispatch } = useContext(AppContext);
  let [dropdownOpen, openDropdown] = useState(false);
  useEffect(() => {
    const onClickOutsideDropdown = () => {
      if (dropdownOpen) openDropdown(false);
    };
    window.addEventListener('click', onClickOutsideDropdown);
    return () => {
      window.removeEventListener('click', onClickOutsideDropdown);
    };
  });
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        openDropdown(!dropdownOpen);
      }}
      className="graphiql-settings"
    >
      <img src={settings} alt="settings icon" />
      {dropdownOpen && (
        <div className="dropdown-container">
          <div
            className="item"
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: 'STOP_SYNC_WITH_LOCALSTORAGE' });
            }}
            title="If is checked this options all tabs will synchronized with localstorage to persist state on page reload"
          >
            Store state in localstorage{' '}
            <input
              onChange={() => {}}
              type="checkbox"
              checked={state.settings.syncWithLocalstorage}
            />
          </div>
          <div
            className="item"
            onClick={(e) => {
              e.stopPropagation();
            }}
            title="Max number of items in history"
          >
            Save maximum items in history{' '}
            <input
              onChange={(e) => {
                dispatch({
                  type: 'CHANGE_HISTORY_MAX_ITEMS',
                  payload: e.target.value,
                });
              }}
              type="number"
              value={state.settings.maxItemsInHistory}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default GraphiQlSettings;
