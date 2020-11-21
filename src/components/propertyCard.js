import React from 'react';
import { withRouter } from 'react-router-dom';
import { status, json } from '../utilities/requestHandlers';
import UserContext from '../contexts/user';
import { Card, Carousel, Alert } from 'antd';
import { EditOutlined, MessageOutlined, DeleteOutlined, ExclamationCircleOutlined, ExclamationCircleFilled } from '@ant-design/icons';

const { Meta } = Card;

class PropertyCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      highPriority: this.props.highPriority,
      success: false, // state to check when to show the alert
      error: false, // state to check when to show the alert
      errorMessage: ' ', // error alert message
    };
    this.toggleHighPriority = this.toggleHighPriority.bind(this);
  }

  static contextType = UserContext;

  componentDidMount() {

  }

  /**
  * Toggles the high priority attribute for a property
  */
  toggleHighPriority() {
    fetch(`https://maximum-arena-3000.codio-box.uk/api/properties/togglehighpriority/${this.props.prop_ID}`, {
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
          highPriority: !this.state.highPriority,
          success: true,
        });
        window.scrollTo(0, 0);

        // After 2 seconds remove success message
        setTimeout(() => {
          this.setState({
            success: true,
          });
        }, 2000);
        console.log(dataFromServer);
      })
      .catch(error => {
        window.scrollTo(0, 0);
        this.setState({
          errorMessage: `${JSON.stringify(error.errorMessage)}`,
          error: true
        });
      });
  }

  render() {

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
    const { history } = this.props;

    if (this.context.user.role === 'admin') {
      cardActions =
        [
          <MessageOutlined key="messages" style={{ color: 'steelblue' }} onClick={() => (history.push("/addProperty"))} />,
          <EditOutlined key="edit" style={{ color: 'steelblue' }} />,
          <ExclamationCircleOutlined key="markHighPriority" onClick={() => (this.toggleHighPriority())} style={{ color: this.state.highPriority ? 'red' : 'steelblue' }} />,
          <DeleteOutlined key="delete" style={{ color: 'steelblue' }} />
        ];
    } else {
      cardActions =
        [
          <MessageOutlined key="messages" style={{ color: 'steelblue' }} onClick={() => (history.push("/addProperty"))} />
        ];
    }

    /**
    * Error Alert from ant design.
    */
    const errorMessage = (
      <Alert
        message="Error"
        description={this.state.errorMessage}
        type="error"
        showIcon
      />
    );

    /**
    * Success Alert from ant design.
    */
    const successMessage = (
      <Alert
        message="Property deleted successfully!"
        description=""
        type="success"
        showIcon
      />
    );

    return (
      <>
        {this.state.error ? <div>{errorMessage}</div> : ''} {/* Show error message when needed*/}
        {this.state.success ? <div>{successMessage}</div> : ''}  {/* Show success message needed*/}

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
          {this.state.highPriority ? <p style={{ color: this.state.highPriority ? 'red' : 'steelblue' }}>High Priority!</p> : ''} {/* Show high priority label only when necessary.*/}
        </Card>
      </>
    );
  }
}

export default PropertyCard; 