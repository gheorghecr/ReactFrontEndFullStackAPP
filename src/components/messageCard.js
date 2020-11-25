import React from 'react';
import { status, json } from '../utilities/requestHandlers';
import UserContext from '../contexts/user';
import { Card, Button } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const { Meta } = Card;

class PropertyCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            messageID: this.props.messageID,
            archived: this.props.archived,
        };
        this.toggleArchived = this.toggleArchived.bind(this);
    }

    static contextType = UserContext;

    /**
    * This will retrieve all the messages for the current user.
    */
    componentDidMount() {
        console.log(this.props, 'test')
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
                console.log(dataFromServer, 'messages')
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
        fetch(`https://maximum-arena-3000.codio-box.uk/api/messages/${this.props.prop_ID}`, {
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
                this.props.successMessage('Message archived successfully!', ' ');
                console.log(dataFromServer);
            })
            .catch(error => {
                this.props.errorMessage('Error Occurred', 'Could not toggle archived attribute. Try Again!');
            });
    }

    render() {
        // Actions on the bottom of the card.
        const cardActions =
            [
                <Button type="ghost" shape="round" size='large' onClick={() => (this.toggleArchived())}>
                    Archive Message </Button>,
                <Button style={{ color: 'red' }} type="ghost" shape="round" size='large' onClick={() => (this.props.deleteMessageFromMessageList(this.props.messageID))}  >
                    Delete Message</Button>
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
                    <p>Message: {this.props.messageText}</p>
                </Card>
            </>
        );
    }
}

export default PropertyCard; 