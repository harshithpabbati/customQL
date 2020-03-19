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
    <CustomGraphiQL />
  </Fragment>
);
