import React from 'react';
import { status, json } from '../utilities/requestHandlers';
import UserContext from '../contexts/user';
import { Card, Carousel, Image } from 'antd';
import { EditOutlined, MessageOutlined, DeleteOutlined, ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons';

const { Meta } = Card;

class PropertyCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      prop_ID: this.props.prop_ID,
      highPriority: this.props.highPriority,
      visibility: this.props.visibility,
    };
    this.toggleHighPriority = this.toggleHighPriority.bind(this);
    this.toggleHighVisibility = this.toggleHighVisibility.bind(this);
  }

  static contextType = UserContext;
  
  /**
  * This will retrieve the image names from the server. And store it.
  */
   componentDidMount() {
    fetch(`https://maximum-arena-3000.codio-box.uk/api/images/${this.state.prop_ID}`, {
      method: "GET",
      body: null,
      headers: {
        "Authorization": "Basic " + btoa(this.context.user.username + ":" + this.context.user.password)
      }
    })
      .then(status)
      .then(json)
      .then(dataFromServer => {
        console.log(dataFromServer, 'images')
        this.setState({
          propertyImagesName: dataFromServer
        });
      })
      .catch(error => {
        
      });
   } 

  /**
   * Function that toggles the High Priority attribute for a property
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
        });
        this.props.successMessage('High Priority Toggled successfully!', ' ');
        console.log(dataFromServer);
      })
      .catch(error => {
        this.props.errorMessage('Error Occurred', 'Could not toggle high priority attribute. Try Again!');
      });
  }

  /**
  * Toggles the high priority attribute for a property
  */
  toggleHighVisibility() {
    fetch(`https://maximum-arena-3000.codio-box.uk/api/properties/togglevisibility/${this.props.prop_ID}`, {
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
          visibility: !this.state.visibility,
        });
        this.props.successMessage('Visibility Toggled successfully!', ' ');
        console.log(dataFromServer);
      })
      .catch(error => {
        this.props.errorMessage('Error Occurred', 'Could not toggle visibility attribute. Try Again!');
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
          <MessageOutlined 
            key="messages" 
            style={{ color: 'steelblue' }} 
            onClick={() => (history.push("/editProperty"))} 
          />,
          <EditOutlined 
            key="edit" 
            style={{ color: 'steelblue' }} 
            onClick={() => (history.push({
              pathname: '/editProperty',
              state: {prop_ID: this.props.prop_ID}
            }))} 
          />,
          <ExclamationCircleOutlined 
            key="markHighPriority" 
            onClick={() => (this.toggleHighPriority())} 
            style={{ color: this.state.highPriority ? 'red' : 'steelblue' }} 
          />,
          <EyeOutlined 
            key="markHighPriority" 
            onClick={() => (this.toggleHighVisibility())} 
            style={{ color: this.state.visibility ? 'green' : 'red' }} 
          />,
          <DeleteOutlined 
            key="delete" 
            onClick={() => (this.props.deleteProperty(this.props.prop_ID))} 
            style={{ color: 'steelblue' }} 
          />
        ];
    } else {
      cardActions =
        [
          <MessageOutlined key="messages" style={{ color: 'steelblue' }} onClick={() => (this.props.es6Function(1))} />
        ];
    }

    let photoList = [];

    // map all available images only if they exist
    if (this.state.propertyImagesName) {
      photoList = this.state.propertyImagesName.map(image => {
        return (
          <div>
            <div>
              <Image
                width={200}
                src={`https://maximum-arena-3000.codio-box.uk/${image.imageName}`}
              />
            </div>
          </div>
        )
      });
    }

    return (
      <>
        <Card
          style={{ width: 400 }}
          // cover={<NavImage alt={`Post ${postID}`} src={this.props.imageURL} to={`/post/${postID}`} />}

          hoverable={true}
          loading={this.props.loading}
          actions={cardActions}>
          <Carousel autoplay dotPosition={'top'}>
            {photoList}
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