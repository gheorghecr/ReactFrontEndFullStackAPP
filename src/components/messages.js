import React from 'react';
import UserContext from '../contexts/user';
import { Col, Row, Alert } from 'antd';
import MessageCard from './messageCard';
import { status, json } from '../utilities/requestHandlers';
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
      messages: [],
      loading: true,
      success: false, // state to check when to show the alert
      successMessage: '', // success alert message
      successDescription: '',
      error: false, // state to check when to show the alert
      errorMessage: ' ', // error alert message
      errorDescription: '',
    }
  }

  static contextType = UserContext;

  /**
  * Fetch all the messages for the current user.
  */
  componentDidMount() {
    fetch(`https://maximum-arena-3000.codio-box.uk/api/messages/agent/${this.context.user.userID}`, {
      method: "GET",
      body: null,
      headers: {
        "Authorization": "Basic " + btoa(this.context.user.username + ":" + this.context.user.password)
      }
    })
      .then(status)
      .then(json)
      .then(data => {
        console.log(data)
        this.setState({ messages: data })
        this.setState({ loading: false })
      })
      .catch(error => {
        console.log("Error fetching messages", error);
        setTimeout(() => {
          this.componentDidMount(); // keep requesting for properties
        }, 2000);
      });
  }

  // updateWindowDimensions() {
  //   this.setState({ width: window.innerWidth, height: window.innerHeight });
  // }

  /**
  * Delete an message by it's ID. This is triggered from the child component.
  *
  * @param {integer} message_ID Message ID.
  */
  deleteMessage = (message_ID) => {
    fetch(`https://maximum-arena-3000.codio-box.uk/api/messages/${message_ID}`, {
      method: "DELETE",
      body: null,
      headers: {
        "Authorization": "Basic " + btoa(this.context.user.username + ":" + this.context.user.password)
      }
    })
      .then(status)
      .then(json)
      .then(dataFromServer => {
        this.setState({
          success: true,
        });
        console.log(dataFromServer);
        // TODO
        // delete the post from the posts state
        this.deleteMessageFromMessageList(message_ID);
      })
      .catch(error => {
        window.scrollTo(0, 0);
        this.setState({
          errorMessage: `${JSON.stringify(error.errorMessage)}`,
          error: true
        });
      });
  }

  /**
   * Deletes the deleted message from the messages list on the state.
   * And Triggers update
   * @param {integer} message_ID Message ID.
   */
  deleteMessageFromMessageList = (message_ID) => {
    const messagesCopy = [...this.state.messages]
    const indexToRemove = messagesCopy.findIndex(obj => obj.message_ID === message_ID);
    messagesCopy.splice(indexToRemove, 1);
    this.setState({
      messages: messagesCopy,
    });
  }

  /**
  * Method to popUP a error message with a custom message.
  *
  * @param {string} title Title for the error message.
  * @param {string} description Description for the error message.
  */
  errorMessage = (title, description) => {
    this.setState({
      error: true,
      errorMessage: title,
      errorDescription: description,
    });
  }

  /**
   * Method to popUP a error message with a custom message.
   *
   * @param {string} title Title for the error message.
   * @param {string} description Description for the error message.
   */
  successMessage = (title, description) => {
    this.setState({
      success: true,
      successMessage: title,
      successDescription: description,
    });
  }

  render() {

    /**
    * Error Alert from ant design.
    */
    const errorMessage = (
      <Alert
        message={this.state.errorMessage}
        description={this.state.errorDescription}
        type="error"
        showIcon
      />
    );

    /**
    * Success Alert from ant design.
    */
    const successMessage = (
      <Alert
        message={this.state.successMessage}
        description={this.state.successDescription}
        type="success"
        showIcon
      />
    );

    const cardList = this.state.messages.map(message => {
      return (
        <div style={{ padding: "10px" }} key={message.messageID}>
          <Col span={6}>
            <MessageCard {...message} history={this.props.history} deleteMessageFromMessageList={this.successMessage} errorMessage={this.errorMessage} successMessage={this.successMessage} />
          </Col>
        </div>
      )
    });

    // Show loading messages while loading the data from the server
    if (!this.state.messages.length) {
      return (
        <Row type="flex" justify="space-around">
          <div style={{ padding: "10px" }} >
            <Col span={6}>
              <MessageCard {...this.state} />
            </Col>
          </div>,
          <div style={{ padding: "10px" }} >
            <Col span={6}>
              <MessageCard {...this.state} />
            </Col>
          </div>
          <div style={{ padding: "10px" }} >
            <Col span={6}>
              <MessageCard {...this.state} />
            </Col>
          </div>
        </Row>
      )
    }

    return (
      <>

        {this.state.error ? <div>{errorMessage}</div> : ''} {/* Show error message when needed*/}
        {this.state.success ? <div>{successMessage}</div> : ''}  {/* Show success message needed*/}

        <h1 align="middle" style={{ padding: '2% 20%' }}>List Of Messages</h1>
        <Row type="flex" justify="space-around">
          {cardList}
        </Row>
      </>
    );
  }
}


export default Messages;