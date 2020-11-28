import React from 'react';
import UserContext from '../contexts/user';
import { Col, Row, message } from 'antd';
import MessageCard from './messageCard';
import { status, json } from '../utilities/requestHandlers';


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
        message.error(`Error fetching messages`, 10);
      });
  }

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
        message.success('Message deleted successfully', 4);
        // delete the post from the posts state
        this.deleteMessageFromMessageList(message_ID);
      })
      .catch(error => {
        window.scrollTo(0, 0);
        message.error(`${JSON.stringify(error.errorMessage)}`, 10);
      });
  }

  /**
   * Deletes the deleted message from the messages list on the state.
   * And Triggers update
   * @param {integer} message_ID Message ID.
   */
  deleteMessageFromMessageList = (message_ID) => {
    const messagesCopy = [...this.state.messages]
    const indexToRemove = messagesCopy.findIndex(obj => obj.messageID === message_ID);
    messagesCopy.splice(indexToRemove, 1);
    this.setState({
      messages: messagesCopy,
    });
  }

  render() {

    const cardList = this.state.messages.map(messageObject => {
      return (
        <div style={{ padding: "10px" }} key={messageObject.messageID}>
          <Col span={6}>
            <MessageCard {...messageObject} history={this.props.history} deleteMessageFromMessageList={this.deleteMessage} />
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
        <h1 align="middle" style={{ padding: '2% 20%' }}>List Of Messages</h1>
        <Row type="flex" justify="space-around">
          {cardList}
        </Row>
      </>
    );
  }
}


export default Messages;