import React, { Fragment } from "react";
import CustomGraphiQL from "./components/CustomGraphiQL";
import "graphiql/graphiql.css"

export default () => (
  <Fragment>
    <header>
      <style>
        {`
          body {
            margin: 0;
            overflow: hidden;
          }
          #root {
            height: 100vh;
          }
      `}
      </style>
    </header>
    <CustomGraphiQL 
        fetcher={async graphQLParams => {
          const data = await fetch(
            'https://swapi.graph.cool',
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
    />
  </Fragment>
);
