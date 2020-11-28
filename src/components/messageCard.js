import React from 'react';
import { status, json } from '../utilities/requestHandlers';
import UserContext from '../contexts/user';
import { Card, Button, Popconfirm, message } from 'antd';

const { Meta } = Card;

class PropertyCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      messageID: this.props.messageID,
      archived: this.props.archived ? true : false, // if message is archived or not
    };
    this.toggleArchived = this.toggleArchived.bind(this);
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static contextType = UserContext;

  /**
  * This will retrieve all the messages for the current user.
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
      .then(dataFromServer => {
        this.setState({
          messages: dataFromServer
        });
      })
      .catch(error => {
      });
  }

  /**
   * Function that toggles the archived attribute for a message.
   */
  toggleArchived() {
    fetch(`https://maximum-arena-3000.codio-box.uk/api/messages/${this.props.messageID}`, {
      method: "PUT",
      body: null,
      headers: {
        "Authorization": "Basic " + btoa(this.context.user.username + ":" + this.context.user.password)
      }
    })
      .then(status)
      .then(json)
      .then(dataFromServer => {
        this.setState({
          archived: !this.state.archived,
        });
        this.props.successMessage('Message toggled successfully!', ' ');
      })
      .catch(error => {
        console.log(error)
        this.props.errorMessage('Error Occurred', 'Could not toggle archived attribute. Try Again!');
      });
  }

  // on deletion of property
  confirm(e) {
    this.props.deleteMessageFromMessageList(this.props.messageID)
    message.success('Click on Yes');
  }

  // Cancel deletion
  cancel(e) {
  }

  render() {
    // Actions on the bottom of the card.
    const cardActions =
      [
        <Button type="ghost" shape="round" size='large' onClick={() => (this.toggleArchived())}>
          {this.state.archived ? 'Unarchive Message' : 'Archive Message'} </Button>,

        <Popconfirm
          title="Are you sure to delete this message?"
          onConfirm={this.confirm}
          onCancel={this.cancel}
          okText="Yes"
          cancelText="No"
        >
          <Button style={{ color: 'red' }} type="ghost" shape="round" size='large'  >
            Delete Message</Button>
        </Popconfirm>
      ];

    return (
      <>
        <Card
          style={{ width: 400 }}
          hoverable={true}
          loading={this.props.loading}
          actions={cardActions}>
          <Meta
            style={{ marginTop: 30 }}
            title={this.props.messageID}
          />
          <br></br>
          <p>Email from: {this.props.fromEmail}</p>
          <p>From: {this.props.fromName} </p>
          <p>From Number: {this.props.fromNumber} </p>
          <p>Message: {this.props.messageText}</p>
          {this.state.archived ? <p>Message Archived</p> : ''}
        </Card>
      </>
    );
  }
}

export default PropertyCard; 