import UserContext from '../contexts/user';
import React from 'react';
import { Form, Carousel, Image, Button } from 'antd';
import { status, json } from '../utilities/requestHandlers';
import { withRouter } from 'react-router-dom';
import { MessageOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, EyeOutlined  } from '@ant-design/icons';

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
};

const tailFormItemLayout = {
  wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } },
};

/**
* Registration form component for app signup.
*/
class EditProperty extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      prop_ID: this.props.location.state.prop_ID,
    };
  }

  static contextType = UserContext;

  componentWillMount() {
    fetch(`https://maximum-arena-3000.codio-box.uk/api/properties/${this.state.prop_ID}`, {
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
          propertyObject: dataFromServer[0]
        });
        this.getImagesName();
      })
      .catch(error => {
      });
  }

  /**
  * This will retrieve the image names from the server. And store it.
  */
  getImagesName() {
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

  render() {

    // Show loading post while loading the data from the server
    if (!this.state.propertyObject) {
      return (
        <h1 align="middle" style={{ padding: '2% 20%' }}>Getting data from server ...</h1>
      )
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
        <h1 align="middle" style={{ padding: '2% 20%' }}>{this.state.propertyObject.title}</h1>
        <Carousel autoplay dotPosition={'top'} style={{ padding: '2% 20%' }}>
          {photoList}
        </Carousel>
        <div align="center" style = {{  marginBottom : 40}}>
          <Button type="primary" shape="round" size='large'  align="center" >
            Send a message about this property.
          </Button>
        </div>
        <Form {...formItemLayout}>
          <Form.Item label="Description" >
            <p1>{this.state.propertyObject.description}</p1>
          </Form.Item>
          <Form.Item label="Status" >
            <p1>{this.state.propertyObject.status}</p1>
          </Form.Item>
          <Form.Item label="Location">
            <p1>{this.state.propertyObject.location}</p1>
          </Form.Item>
          <Form.Item label="Price">
            <p1>{this.state.propertyObject.price}</p1>
          </Form.Item>
          <Form.Item label="High Priority">
            <p1>{this.state.propertyObject.highPriority ? 'Yes' : 'No'}</p1>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
          </Form.Item>
        </Form>
      </>
    );
  }
}

export default withRouter(EditProperty);
