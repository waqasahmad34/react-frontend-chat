import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Join from './components/Join';
import Chat from './components/Chat';

const App = () => {
    return (
        <>
          <Router>
              <Switch>
                <Route exact path="/" component={Join} />
                <Route exact path="/chat" component={Chat} />
              </Switch>
          </Router>
        </>
    )
}

export default App;