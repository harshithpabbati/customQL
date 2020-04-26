import React, { useRef, useContext } from 'react';
import GraphiQL from 'graphiql';
import { parse, print } from 'graphql';
import graphQLFetcher from './../helpers/graphiQLFetcher.jsx';
import GraphiQlSearch from './GraphiQlSearch.jsx';
import { AppContext } from './CustomGraphiQL.jsx';
import GraphiQlHistory from './GraphiQlHistory.jsx';
import GraphiQlFooter from './GraphiQlFooter.jsx';
import GraphiQlExport from './GraphiQlExport';
import toast from './../helpers/toast.jsx';

import 'graphiql/graphiql.css';
import '../styles/GraphiQlTab.sass';

const GraphiQlTab = ({ activeTab, endpoints }) => {
  const { dispatch } = useContext(AppContext);
  let graphiqlEditorRef = useRef(null);

  const prettifySchema = () => {
    const editor = graphiqlEditorRef.getQueryEditor();
    const currentText = editor.getValue();
    const prettyText = print(parse(currentText));
    editor.setValue(prettyText);
  };

  const beforeFetch = () => {
    toast.info('Fetching...');
  };

  const afterFetch = (response) => {
    if (response.data && !response.data.__schema) {
      dispatch({
        type: 'CHANGE_TAB_RESPONSE',
        payload: activeTab.id,
        value: JSON.stringify(response, null, 4),
      });
      dispatch({
        type: 'ADD_TO_HISTORY',
        payload: { ...activeTab, id: new Date().getTime() },
      });
    }
    if (response.errors) {
      dispatch({
        type: 'CHANGE_TAB_RESPONSE',
        payload: activeTab.id,
        value: JSON.stringify(response, null, 4),
      });
    }
  };

  const onErrorFetch = (error) => {
    console.log(error);
  };

  const copyCURL = () => {
    if (activeTab.query) {
      let curl = `curl '${
        activeTab.route || window.location.origin
      }' -H 'Content-Type: application/json' -H 'Accept: application/json'`;
      if (activeTab.headers.length > 0) {
        activeTab.headers.forEach((header) => {
          curl = curl + `' -H ' + '${header.name}: ${header.value}'`;
        });
      }
      curl =
        curl +
        `-H 'Origin: ${
          activeTab.route || window.location.origin
        }' --data-binary '{"query":${JSON.stringify(
          activeTab.query
        )}}' --compressed`;

      if (!navigator.clipboard) {
        toast.info('Could not copy curl!');
      } else {
        navigator.clipboard.writeText(curl).then(
          function () {
            toast.info('Successfully copied to clipboard!');
          },
          function (err) {
            toast.info('Could not copy cURL: ', err);
          }
        );
      }
    } else {
      toast.info('You need a query to copy cURL command');
    }
  };

  const clearTabs = () => {
    dispatch({
      type: 'CHANGE_TAB_RESPONSE',
      payload: activeTab.id,
      value: null,
    });
    dispatch({
      type: 'CHANGE_TAB_QUERY',
      payload: activeTab.id,
      value: null,
    });
    dispatch({
      type: 'CHANGE_TAB_VARIABLES',
      payload: activeTab.id,
      value: null,
    });
  };

  const copyQuery = () => {
    navigator.clipboard.writeText(activeTab.query).then(
      function () {
        toast.info('Successfully copied query to clipboard!');
      },
      function (err) {
        toast.info('Could not copy query: ', err);
      }
    );
  };

  return (
    <div className="graphiql graphiql-tab">
      <GraphiQL
        fetcher={graphQLFetcher(
          activeTab.route || window.location.href,
          activeTab.headers || [],
          beforeFetch,
          afterFetch,
          onErrorFetch
        )}
        onEditQuery={(e) =>
          dispatch({
            type: 'CHANGE_TAB_QUERY',
            payload: activeTab.id,
            value: e,
          })
        }
        onEditVariables={(e) =>
          dispatch({
            type: 'CHANGE_TAB_VARIABLES',
            payload: activeTab.id,
            value: e,
          })
        }
        editorTheme={activeTab.theme || 'dracula'}
        ref={(ref) => (graphiqlEditorRef = ref)}
        defaultQuery={activeTab.query || ''}
        query={activeTab.query || ''}
        response={activeTab.response || ''}
        variables={activeTab.variables || ''}
      >
        <GraphiQL.Logo> </GraphiQL.Logo>
        <GraphiQL.Toolbar>
          <GraphiQL.Button onClick={prettifySchema} label="Prettify" />
          <GraphiQL.Button onClick={copyQuery} label="Copy" />
          <GraphiQL.Button onClick={clearTabs} label="Clear" />
          <GraphiQlHistory activeTab={activeTab} />
          <GraphiQlSearch activeTab={activeTab} endpoints={endpoints || []} />
          <GraphiQL.Button onClick={copyCURL} label="Copy cURL" />
          <GraphiQlExport activeTab={activeTab} />
        </GraphiQL.Toolbar>
        <GraphiQL.Footer>
          <GraphiQlFooter activeTab={activeTab} />
        </GraphiQL.Footer>
      </GraphiQL>
    </div>
  );
};
export default GraphiQlTab;
