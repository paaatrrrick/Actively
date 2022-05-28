import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Home from './views/Home';
// import FoodSearch from "./views/FoodSearch";

import Resources from './views/Resources';
import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
import NewEvent from "./views/NewEvent";
import ViewProfile from "./views/ViewProfile";
import ViewGroup from "./views/ViewGroup";
import Friends from "./views/Friends";
import Register from "./views/Register";
import Profile from "./views/Profile";
import Error from "./views/Error";
import Groups from "./views/Groups";
import CreateGroup from "./views/CreateGroup";
// import Register from './views/Register';

class App extends Component {
  render() {
    return (
      <div className='App'>
        <Switch>
          <Route exact path='/home' component={Home} />
          <Route exact path='/' component={Register} />
          <Route exact path='/error' component={Error} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/profile' component={Profile} />
          <Route exact path='/friends' component={Friends} />
          <Route exact path='/groups' component={Groups} />
          <Route exact path='/creategroup' component={CreateGroup} />
          <Route exact path='/resources' component={Resources} />
          <Route exact path='/dashboard' component={Dashboard} />
          <Route exact path='/create' component={NewEvent} />
          <Route exact path='/profile/:id' render={routeProps => <ViewProfile {...routeProps} />} />
          <Route exact path='/group/:id' render={routeProps => <ViewGroup {...routeProps} />} />
          <Route exact path='*' component={Error} />
          <Route render={() => <h1>ERROR NOT FOUND!!!</h1>} />
        </Switch>
      </div>
    );
  }
}

export default App;



