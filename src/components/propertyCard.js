import React from 'react';
import UserContext from '../contexts/user';
import { Card, Carousel } from 'antd';
import { withRouter } from 'react-router-dom';
import {  EditOutlined, MessageOutlined, DeleteOutlined, ExclamationCircleOutlined, ExclamationCircleFilled  } from '@ant-design/icons';

const { Meta } = Card;

class PropertyCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  static contextType = UserContext;

  render() {
    const postID = this.props.prop_ID

    const contentStyle = {
      height: '160px',
      color: '#fff',
      lineHeight: '160px',
      textAlign: 'center',
      background: '#364d79',
    };

    let cardActions;
    // Render different card actions depending if who is logged in is normal user 
    // or an admin.
    if (this.context.user.role === 'admin') {
    cardActions = 
      [
        <MessageOutlined key="messages"  style={{ color: 'steelblue' }} onClick={() => (alert('test'))} />,
        <EditOutlined key="edit"  style={{ color: 'steelblue' }}/>,
        <ExclamationCircleOutlined key="markHighPriority" style={{ color: this.props.highPriority ? 'red' : 'steelblue' }}/>,
        <DeleteOutlined key="delete"  style={{ color: 'steelblue' }} />
      ];
    } else {
      cardActions = 
      [
        <MessageOutlined key="messages"  style={{ color: 'steelblue' }} onClick={() => (alert('test'))} />
      ];
    }
    

    return (
      <Card
        style={{ width: 400 }}
        // cover={<NavImage alt={`Post ${postID}`} src={this.props.imageURL} to={`/post/${postID}`} />}

        hoverable={true}
        loading={this.props.loading}
        actions={cardActions}>
        <Carousel autoplay>
          <div>
            <h3 style={contentStyle}>1</h3>
          </div>
          <div>
            <h3 style={contentStyle}>2</h3>
          </div>
          <div>
            <h3 style={contentStyle}>3</h3>
          </div>
          <div>
            <h3 style={contentStyle}>4</h3>
          </div>
        </Carousel>
        <Meta
          title={this.props.title}
        />
        <br></br>
        <p>Description: {this.props.description}</p>
        <p>Status: {this.props.status} </p>
        <p>Location: {this.props.location}</p>
        <p>Price: ${this.props.price}</p>
        {this.props.highPriority ? <p style={{ color: this.props.highPriority ? 'red' : 'steelblue' }}>High Priority!</p> : ''} {/* Show high priority label only when necessary.*/}
      </Card>
    );
  }
}

export default PropertyCard; 