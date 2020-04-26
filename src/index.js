import React from 'react';
import ReactDOM from 'react-dom';

import CustomGraphiQL from './components/CustomGraphiQL';

ReactDOM.render(
  <CustomGraphiQL
    endpoints={[
      {
        route: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
      },
    ]}
  />,
  document.getElementById('root')
);
