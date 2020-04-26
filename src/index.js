import React from 'react';
import ReactDOM from 'react-dom';
import CustomQL from './components/CustomGraphiQL';

const config = [
    {
        "route": "https://swapi-graphql.netlify.app/.netlify/functions/index",
    },
    {
        "route": "https://pokeapi-graphiql.herokuapp.com"
    }
];

ReactDOM.render(
  <CustomQL endpoints={this ? this.props.config: config} />,
  document.getElementById('root')
);
