import React from 'react';
import ReactDOM from 'react-dom';

import CustomGraphiQL from './components/CustomGraphiQL';

const root = document.createElement('div');
root.id = 'root_graphiql';
document.body.appendChild(root);

ReactDOM.render(<CustomGraphiQL endpoints={[{
    route: 'https://swapi-graphql.netlify.app/.netlify/functions/index'
}]} />, root);
