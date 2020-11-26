import UserContext from '../contexts/user';
import React from 'react';
import { Form, Carousel, Image, Button, Input, InputNumber, Row, Col } from 'antd';
import { status, json } from '../utilities/requestHandlers';
import { withRouter } from 'react-router-dom';

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
};

const tailFormItemLayout = {
  wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } },
};

const emailRules = [
	{ type: 'email', message: 'The input is not valid E-mail!' },
	{ required: true, message: 'Please input your E-mail!' }
]

const nameRules = [
	{ required: true, message: 'Please input your name!', whitespace: true }
]

const messageRules = [
  { required: true, message: 'Please input an message for the property!', whitespace: true }
]

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

        <h1 align="middle" style={{ padding: '2% 20%' }}>Send a Message to the Real State Agent</h1>
        <Form {...formItemLayout} name="register" onFinish={this.onFinish} scrollToFirstError >
          <Form.Item name="fromEmail" label="Your Email" rules={emailRules} required tooltip="This is a required field">
            <Input />
          </Form.Item>
          <Form.Item name="fromName" label="Your Name" rules={nameRules} required tooltip="This is a required field">
            <Input />
          </Form.Item>
          <Form.Item name="fromNumber" label="Your Number" tooltip="This is a required field">
          <Input.Group compact>
            <InputNumber style={{ width: '7%' }} defaultValue="+44" />
            <InputNumber style={{ width: '20%' }} />
          </Input.Group>
          </Form.Item>
          <Form.Item name="messageText" label="Message" rules={messageRules} required tooltip="This is a required field">
            <TextArea rows={3}></TextArea>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Send Message
					</Button>
          </Form.Item>
        </Form>
      </>
    );
  }
}

export default withRouter(EditProperty);
