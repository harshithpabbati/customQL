import React, { useContext } from 'react';
import { AppContext } from './CustomGraphiQL.jsx';

import '../styles/GraphiQlFooter.sass';

const GraphiQlFooter = ({ activeTab }) => {
  const { dispatch } = useContext(AppContext);

  return (
    <>
      <div className="graphiql-footer">
        <div className="graphiql-footer-tabs">
          <div className="item">HEADERS</div>
        </div>
        <div className="graphiql-footer-tabs-content">
          {(!activeTab.footerTabActive || activeTab.footerTabActive === 1) && (
            <div className="graphiql-footer-tab-headers">
              {activeTab.headers &&
                activeTab.headers.map((item) => (
                  <div className="header-item-wrapper" key={item.id}>
                    <span
                      className="close-item"
                      onClick={() => {
                        dispatch({
                          type: 'REMOVE_ITEM_FROM_TAB_HEADERS',
                          payload: activeTab.id,
                          headerId: item.id,
                        });
                      }}
                    />
                    <div className="header-item-input-wrapper">
                      <input
                        type="text"
                        placeholder="Header Name"
                        onChange={(e) =>
                          dispatch({
                            type: 'CHANGE_TAB_HEADER_VALUES',
                            payload: activeTab.id,
                            headerId: item.id,
                            keyName: 'name',
                            value: e.target.value,
                          })
                        }
                        value={item.name}
                      />
                    </div>
                    <div className="header-item-input-wrapper">
                      <input
                        type="text"
                        placeholder="Header Value"
                        onChange={(e) =>
                          dispatch({
                            type: 'CHANGE_TAB_HEADER_VALUES',
                            payload: activeTab.id,
                            headerId: item.id,
                            keyName: 'value',
                            value: e.target.value,
                          })
                        }
                        value={item.value}
                      />
                    </div>
                  </div>
                ))}
              {(!activeTab.headers || activeTab.headers.length === 0) && (
                <div className="empty">No Headers!</div>
              )}
            </div>
          )}
        </div>
      </div>
      {(!activeTab.footerTabActive || activeTab.footerTabActive === 1) && (
        <div
          className="add-tab-header"
          onClick={() => dispatch({ type: 'ADD_TAB_HEADER', payload: activeTab.id })}
        >
          +
        </div>
      )}
    </>
  );
};
export default GraphiQlFooter;
