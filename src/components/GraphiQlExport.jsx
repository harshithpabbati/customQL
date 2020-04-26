import React, { useState, useEffect } from 'react';

import '../styles/GraphiQlExport.sass';
import toast from '../helpers/toast';
import exportImage from '../images/export.png';

const GraphiQlExport = ({ activeTab }) => {
  let [dropdownOpen, openDropdown] = useState(false);
  console.log(dropdownOpen);
  useEffect(() => {
    const onClickOutsideDropdown = () => {
      if (dropdownOpen) openDropdown(false);
    };
    window.addEventListener('click', onClickOutsideDropdown);
    return () => {
      window.removeEventListener('click', onClickOutsideDropdown);
    };
  });

  const exportFile = () => {
    if (activeTab.response) {
      let parseJSON = JSON.parse(activeTab.response);
      let jsonStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(parseJSON, null, 4));
      let a = document.createElement('a');
      a.href = 'data:' + jsonStr;
      a.download = activeTab.title + '.json';
      a.innerHTML = 'download JSON';
      a.click();
    } else {
      toast.info('Response tab is empty');
    }
  };

  const copyJSON = () => {
    if (activeTab.response) {
      let response = JSON.stringify(JSON.parse(activeTab.response), null, 4);
      if (!navigator.clipboard) {
        toast.info('Could not copy to clipboard!');
      } else {
        navigator.clipboard.writeText(response).then(
          function () {
            toast.info('Successfully copied to clipboard!');
          },
          function (err) {
            toast.info('Could not copy to clipboard!: ', err);
          }
        );
      }
    } else {
      toast.info('Response tab is empty');
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        openDropdown(!dropdownOpen);
      }}
      className="graphiql-export"
    >
      <img src={exportImage} alt="Export Icon" />
      {dropdownOpen && (
        <div className="dropdown-container">
          <div
            className="item"
            onClick={(e) => {
              e.stopPropagation();
              exportFile();
            }}
            title="Export JSON Response to file"
          >
            Export to file
          </div>
          <div
            className="item"
            onClick={(e) => {
              e.stopPropagation();
              copyJSON();
            }}
            title="Copy JSON Response to clipboard"
          >
            Copy to clipboard
          </div>
        </div>
      )}
    </div>
  );
};
export default GraphiQlExport;
