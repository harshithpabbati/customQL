import React, { Component, Fragment } from "react";
import GraphiQL from "graphiql";
import copyToClipboard from 'copy-to-clipboard';
import { pick, pickBy } from "lodash";

const defaultState = {
  editorTheme: undefined,
  query: undefined,
  variables: undefined
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
    console.log(this.ref)
    const { editorTheme, query, variables } = this.state;
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
          fetcher={this.props.fetcher}
          query={query}
          variables={variables}
          onEditQuery={this.handleEditQuery}
          onEditVariables={this.handleEditVariables}
          ref={this.ref}
        >
          <GraphiQL.Logo>CustomQL</GraphiQL.Logo>

          <GraphiQL.Toolbar>
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
