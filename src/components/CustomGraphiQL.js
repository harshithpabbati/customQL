import React, { Component, Fragment } from "react";
import GraphiQL from "graphiql";
import copyToClipboard from 'copy-to-clipboard';
import { pick, pickBy } from "lodash";
import { buildClientSchema, introspectionQuery, printSchema } from "graphql";

const defaultState = {
  editorTheme: undefined,
  query: undefined,
  variables: undefined,
  graphQLEndpoint: '',
  response: ''
};

const stateFromURL = Array.from(
  new URLSearchParams(window.location.search)
).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [key]: value
  }),
  {}
);

export default class CustomGraphiQL extends Component {
  ref = React.createRef();

  state = {
    ...defaultState,
    // Restrict state to only known keys
    ...pick(stateFromURL, Object.keys(defaultState))
  };

  handleEditQuery = query => {
    if (!query) {
      query = undefined;
    }

    this.setState({ query });
  };

  handleEditVariables = variables => {
    if (!variables) {
      variables = undefined;
    }

    this.setState({ variables });
  };

  handlePrettifyQuery = () => {
    this.graphiQL = this.ref.current;
    if (this.graphiQL) {
      this.graphiQL.handlePrettifyQuery();
    }
    this.handlePrettifyVariables();
  };

  handlePrettifyVariables = () => {
    if (!this.state.variables) {
      return;
    }
    const variables = this.state.variables || '{}';
    try {
      const formattedVariables = JSON.stringify(JSON.parse(variables), null, 2);
      this.setState({
        variables: formattedVariables
      });
    } catch (error) {
      this.setState({
        response: `Query Variables: Not a valid JSON\n${error}`
      });
    }
  };

  handleToggleHistory = () => {
    this.graphiQL = this.ref.current;
    if (this.graphiQL) {
      this.graphiQL.handleToggleHistory();
    }
  };

  handleCopyQuery = () => {
    this.graphiQL = this.ref.current;
    const editor = this.graphiQL.getQueryEditor();
    const query = editor && editor.getValue();

    if (!query) {
      return;
    }

    copyToClipboard(query);
  };

  handleInputKeyPress = event => {
    if (event.which === 13) {
      if (this.urlInputRef) {
        this.urlInputRef.blur();
      }
      this.handleFetchSchema();
      event.preventDefault();
      return false;
    }

    return true;
  };

  setURLInputRef = ref => {
    this.urlInputRef = ref;
  };

  handleURLChange = url => {
    const graphQLParams = { query: introspectionQuery };
    return fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphQLParams)
    })
        .then(response => response.json())
        .then(result => {
          if (result.errors) {
            throw new Error(JSON.stringify(result.errors));
          }
          const schema = buildClientSchema(result.data);
          this.setState({
            schema,
            schemaSDL: printSchema(schema),
            graphQLEndpoint: url,
            schemaFetchError: '',
            response: 'Schema fetched'
          });
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error('Error in fetching GraphQL schema', error);
          this.setState({
            schemaFetchError: error.toString(),
            graphQLEndpoint: url,
            response: error.toString()
          });
        });
  };

  handleFetchSchema = () => {
    this.handleURLChange(this.urlInputRef.value);
  };
  handleSchemaSDL = () => {
    this.state.schemaSDL ? alert(this.state.schemaSDL): alert('Enter valid URL')
  }

  componentDidUpdate(prevProps, prevState) {
    const { editorTheme = "graphiql" } = this.state;
    const queryString = new URLSearchParams(pickBy(this.state)).toString();

    this.graphiQL = this.ref.current;
    this.graphiQL.queryEditorComponent.editor.setOption("theme", editorTheme);
    this.graphiQL.resultComponent.viewer.setOption("theme", editorTheme);
    this.graphiQL.variableEditorComponent.editor.setOption("theme", editorTheme);

    window.history.replaceState(
      null,
      null,
      queryString ? `?${queryString}` : window.location.pathname
    );
  }

  render() {
    const { editorTheme, query, variables, schema, response, graphQLEndpoint } = this.state;
    return (
      <Fragment>
        <header>
          <link
            href={`https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.0/theme/solarized.css`}
            rel="stylesheet"
          />
          <link
            href={`https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.0/theme/paraiso-dark.css`}
            rel="stylesheet"
          />
          <link
            href={`https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.0/theme/dracula.css`}
            rel="stylesheet"
          />
          <link
            href={`https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.0/theme/oceanic-next.css`}
            rel="stylesheet"
          />
          <link
            href={`https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.0/theme/3024-night.css`}
            rel="stylesheet"
          />
          <link
            href={`https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.0/theme/3024-day.css`}
            rel="stylesheet"
          />
          <link
            href={`https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.0/theme/abcdef.css`}
            rel="stylesheet"
          />
          <link
            href={`https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.0/theme/ambiance.css`}
            rel="stylesheet"
          />
          <link
            href={`https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.0/theme/material-ocean.css`}
            rel="stylesheet"
          />
        </header>
        <GraphiQL
          editorTheme={editorTheme}
          schema={schema}
          fetcher={async graphQLParams => {
            const data = await fetch(
                this.state.graphQLEndpoint,
                {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(graphQLParams),
                  credentials: 'same-origin',
                },
            );
            return data.json().catch(() => data.text());
          }}
          query={query}
          variables={variables}
          onEditQuery={this.handleEditQuery}
          onEditVariables={this.handleEditVariables}
          ref={this.ref}
          response={response}
        >
          <GraphiQL.Logo>CustomQL</GraphiQL.Logo>

          <GraphiQL.Toolbar>
            <form onSubmit={this.handleFetchSchema}>
              <div>
                <input
                    ref={this.setURLInputRef}
                    className="url-input"
                    type={'text'}
                    placeholder={'GraphQL Endpoint'}
                    defaultValue={graphQLEndpoint || ''}
                    onKeyPress={this.handleInputKeyPress}
                />
              </div>
            </form>
            <GraphiQL.Button
              onClick={this.handlePrettifyQuery}
              label="Prettify"
              title="Prettify Query (Shift-Ctrl-P)"
            />
            <GraphiQL.Button
              onClick={this.handleCopyQuery}
              title="Copy Query (Shift-Ctrl-C)"
              label="Copy"
            />
            <GraphiQL.Button
              onClick={this.handleToggleHistory}
              label="History"
              title="Query History"
            />

            <GraphiQL.Button
              onClick={this.handleSchemaSDL}
              label="Schema SDL"
              title="Schema SDL"
            />

            <GraphiQL.Select onSelect={editorTheme => this.setState({ editorTheme })}>
              <GraphiQL.SelectOption
                label="Default Theme"
                selected={!editorTheme}
                value={undefined}
              />
              <GraphiQL.SelectOption
                label="Dracula"
                selected={editorTheme === "dracula"}
                value="dracula"
              />
              <GraphiQL.SelectOption
                label="Oceanic Next"
                selected={editorTheme === "oceanic-next"}
                value="oceanic-next"
              />
              <GraphiQL.SelectOption
                label="Paraiso Dark"
                selected={editorTheme === "paraiso-dark"}
                value="paraiso-dark"
              />
              <GraphiQL.SelectOption
                label="Solarized Dark"
                selected={editorTheme === "solarized dark"}
                value="solarized dark"
              />
              <GraphiQL.SelectOption
                label="Solarized Light"
                selected={editorTheme === "solarized light"}
                value="solarized light"
              />
              <GraphiQL.SelectOption
                label="3024 Day"
                selected={editorTheme === "3024-day"}
                value="3024-day"
              />
              <GraphiQL.SelectOption
                label="3024 Night"
                selected={editorTheme === "3024-night"}
                value="3024-night"
              />
              <GraphiQL.SelectOption
                label="abcdef"
                selected={editorTheme === "abcdef"}
                value="abcdef"
              />
              <GraphiQL.SelectOption
                label="ambiance"
                selected={editorTheme === "ambiance"}
                value="ambiance"
              />
              <GraphiQL.SelectOption
                label="Material Ocean"
                selected={editorTheme === "material-ocean"}
                value="material-ocean"
              />
            </GraphiQL.Select>
          </GraphiQL.Toolbar>
        </GraphiQL>
      </Fragment>
    );
  }
}
