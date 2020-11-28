import React from 'react';
import { status, json } from '../utilities/requestHandlers';
import UserContext from '../contexts/user';
import { Card, Carousel, Image, Button, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons';

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
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
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
        message.success('High Priority attribute toggled successfully!', 4);
        console.log(dataFromServer);
      })
      .catch(error => {
        message.error('Could not toggle high priority attribute. Try Again!', 10);
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
        message.success('Visibility Toggled successfully!', 4);
      })
      .catch(error => {
        message.error('Could not toggle visibility attribute. Try Again!', 10);
      });
  }

  confirm(e) {
    this.props.deleteProperty(this.props.prop_ID)
  }

  // Cancel deletion
  cancel(e) {
  }

  render() {
    let cardActions;
    // Render different card actions depending if who is logged in is normal user 
    // or an admin.
    const { history } = this.props;

    if (this.context.user.role === 'admin') {
      cardActions =
        [
          <EditOutlined
            key="edit"
            style={{ color: 'steelblue' }}
            onClick={() => (history.push({
              pathname: '/editProperty',
              state: { prop_ID: this.props.prop_ID }
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
          // delete button is wrapped into a popConfirm, to make sure the user wanted to delete the property
          <Popconfirm
            title="Are you sure to delete this property?"
            onConfirm={this.confirm}
            onCancel={this.cancel}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined
              key="delete"
              style={{ color: 'steelblue' }}
            />
          </Popconfirm>
        ];
    } else {
      cardActions =
        [
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
          hoverable={true}
          loading={this.props.loading}
          actions={cardActions}>
          <Carousel autoplay dotPosition={'top'}>
            {photoList}
          </Carousel>
          <Meta
            style={{ marginTop: 30 }}
            title={this.props.title}
          />
          <br></br>
          <p>Description: {this.props.description}</p>
          <p>Status: {this.props.status} </p>
          <p>Location: {this.props.location}</p>
          <p>Price: ${this.props.price}</p>
          {this.state.highPriority ? <p style={{ color: this.state.highPriority ? 'red' : 'steelblue' }}>High Priority!</p> : ''} {/* Show high priority label only when necessary.*/}
          <div align="center">
            <Button type="primary" shape="round" size='large' onClick={() => (history.push({
              pathname: '/propertyDetails',
              state: { prop_ID: this.props.prop_ID }
            }))} > View Details </Button>
          </div>

        </Card>
      </>
    );
  }
}

export default PropertyCard; 