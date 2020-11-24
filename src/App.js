import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Nav from './components/nav';
import Account from './components/account';
import Register from './components/register';
import Login from './components/login';
import Home from './components/home';
import AddPropertyForm from './components/addProperty';
import EditProperty from './components/editProperty';
import ViewPropertyDetails from './components/propertyDetailsView';

import UserContext from './contexts/user';

import { Layout } from 'antd';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const { Header, Content, Footer } = Layout;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: { loggedIn: false }
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login(user, password) {
    console.log("User is now being set on the context");
    user.loggedIn = true;
    user.password = password;
    this.setState({user:user});
  }

  logout() {
    console.log("Removing user from the app context");
    this.setState({user: {loggedIn:false}});
  }

  render() {
    const context = {
      user: this.state.user,
      login: this.login,
      logout: this.logout
    };

    return (
      <UserContext.Provider value={context}>
        <Router>
          <Layout className="layout">
            <Header>
             <Nav /> 
            </Header>

            <Content>
              <Switch>
                <Route path="/" children={<Home />} exact />
                <Route path="/account" children={<Account />} />
                <Route path="/register" children={<Register />} />
                <Route path="/login" children={<Login />} />
                <Route path="/addProperty" children={<AddPropertyForm />} />
                <Route path="/editProperty" children={<EditProperty />} />
                <Route path="/propertyDetails" children={<ViewPropertyDetails />} />
              </Switch>
            </Content>

            <Footer style={{ textAlign: 'center' }}>Created for 304CEM Assignment by Gheorghe Craciun </Footer>
          </Layout>
        </Router>
      </UserContext.Provider>
    );
  }
}

export default App;
