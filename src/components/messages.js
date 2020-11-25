import React from 'react';
import UserContext from '../contexts/user';
import { Col, Row, Button, Avatar, } from 'antd';
// import { status, json } from '../utilities/requestHandlers';
import { MessageOutlined } from '@ant-design/icons';


/**
 * Component that manages the messages. It has the list of messages.
 * And then as well the opened conversation.
 * 
 */
class Messages extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  componentDidMount() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  static contextType = UserContext;
  

  render() {

   

    return (
      <>
      </>
    );
  }
}


export default Messages;