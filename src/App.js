import React from 'react';
import './App.css';
import Nav from './components/nav';
import Account from './components/account';
import Register from './components/register';

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

  login(user) {
    console.log("User is now being set on the context");
    user.loggedIn = true;
    this.setState({ user: user });
  }

  logout() {
    console.log("Removing user from the app context");
    this.setState({ user: { loggedIn: false } });
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
                
                <Route path="/account" children={<Account />} />
                <Route path="/register" children={<Register />} />
                 {/* <Route path="/login" children={<Login />} />
                <Route path="/post/:id" children={<Post />} />
                <Route path="/" children={<Home />} exact />
                */}
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
