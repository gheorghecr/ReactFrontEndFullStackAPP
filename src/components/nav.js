import React from 'react';
import UserContext from '../contexts/user';
import { Menu } from 'antd';
import { Link } from "react-router-dom";

function Nav(props) {
  return (
    <UserContext.Consumer>
      {({logout}) => (
        <>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/register">Register</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/login">Login</Link>
          </Menu.Item>
          <Menu.Item key="4" onClick={logout}>
            <Link to="/">Logout</Link>
          </Menu.Item>
        </Menu>
        </>
      )}
    </UserContext.Consumer>
  );
}

export default Nav;