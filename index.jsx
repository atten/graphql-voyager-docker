import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Voyager} from 'graphql-voyager';
import fetch from 'isomorphic-fetch';

const GRAPHQL_SCHEMA_URL = process.env.GRAPHQL_SCHEMA_URL;

function getQueryValue(param, u) {
  var i, j, len, pair, part, query, vars;
  if (u == null) {
    u = document.location.href;
  }
  i = u.indexOf('?');
  if (i < 0) {
    return;
  }
  query = u.substr(i + 1);
  vars = query.split('&');
  for (j = 0, len = vars.length; j < len; j++) {
    part = vars[j];
    pair = part.split('=');
    if (decodeURIComponent(pair[0]) === param) {
      return decodeURIComponent(pair[1]);
    }
  }
}

class Test extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Voyager introspection={this.introspectionProvider} displayOptions={{
        skipRelay: +getQueryValue('skipRelay') || false,
        rootType: getQueryValue('rootType'),
      }}/>
    )
  }

  introspectionProvider(query) {
    let req;
    const isJSON = GRAPHQL_SCHEMA_URL.endsWith('.json');
    if (isJSON) {
      req = fetch(GRAPHQL_SCHEMA_URL, {
        method: 'get',
      });
    } else {
      req = fetch(GRAPHQL_SCHEMA_URL, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({query: query}),
      })
    }

    return req.then(response => response.json());
  }
}

ReactDOM.render(<Test/>, document.getElementById('voyager'));
