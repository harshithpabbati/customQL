import React, { useContext } from 'react';
import { AppContext } from './CustomGraphiQL.jsx';
import '../styles/GraphiQltabsBar.sass';
import GraphiQlSettings from './GraphiQlSettings.jsx';

const GraphiQlTabsBar = () => {
  const { state, dispatch } = useContext(AppContext);
  const items = [...state.tabs];

  return (
    <div className="graphiql-tabs-bar">
      {items.map((item, index) => (
        <div key={item.id} className="graphiql-tab-item">
          <div
            className={`graphiql-tab-item-content ${item.active ? 'active' : ''}`}
            style={{ position: 'relative' }}
          >
            {item.listening && (
              <div
                style={{
                  width: 10,
                  height: 10,
                  background: 'red',
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  zIndex: 999999,
                  borderRadius: '50%',
                }}
              />
            )}
            {item.active ? (
              <input
                id={`tabName${item.id}`}
                title="Click to change tab name"
                className="graphiql-tab-item-title"
                type="text"
                onChange={(e) =>
                  dispatch({
                    type: 'CHANGE_TAB_TITLE',
                    payload: item.id,
                    title: e.target.value,
                  })
                }
                placeholder={item.title || 'New tab'}
                value={item.title || ''}
              />
            ) : (
              <div
                className="graphiql-tab-item-title"
                onClick={() => dispatch({ type: 'ACTIVATE_TAB', payload: item.id })}
              >
                {item.title || 'New tab'}
              </div>
            )}
            <div
              className="graphiql-tab-item-close"
              onClick={() => dispatch({ type: 'REMOVE_TAB', payload: item.id })}
            />
          </div>
          {items.length === index + 1 && (
            <div
              className="graphiql-tab-item-add"
              onClick={() => dispatch({ type: 'ADD_TAB' })}
            >
              +
            </div>
          )}
        </div>
      ))}
      <div className="graphiql-settings">
        <GraphiQlSettings />
      </div>
    </div>
  );
};
export default GraphiQlTabsBar;
