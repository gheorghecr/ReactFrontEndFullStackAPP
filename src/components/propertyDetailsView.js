import UserContext from '../contexts/user';
import React from 'react';
import { Form, Carousel, Image, Button, Input, InputNumber, message } from 'antd';
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
    this.onFinish = this.onFinish.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
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
        message.error('Could not retrieve the images!', 5);
      });
  }

  /**
  * When user clicks on send message. Post data to the server.
  */
  onFinish = (values) => {
    // remove error or success popUP message if there are any
    this.setState({
      error: false,
      success: false,
    })

    console.log('Received values of add property form: ', values);
    const { confirm, ...data } = values;  // ignore the 'confirm' value in data sent

    console.log(data);

    if(typeof data.fromNumber === 'undefined') {
      delete data.fromNumber; //Don't send this as user did not input the numer
    }

    console.log(data);

    data.propertyID = this.state.prop_ID
    data.agentID = this.state.propertyObject.sellerID

    fetch(`https://maximum-arena-3000.codio-box.uk/api/messages`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(status)
      .then(json)
      .then(dataFromServer => {
        message.success('Message send successfully!', 4);
      })
      .catch(error => {
        window.scrollTo(0, 0);
        message.error(`${JSON.stringify(error)}`, 10);
      });
  };

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
        <Form {...formItemLayout} id="sendMessage" name="sendMessage" onFinish={this.onFinish} scrollToFirstError >
          <Form.Item name="fromEmail" label="Your Email" rules={emailRules} required tooltip="This is a required field">
            <Input />
          </Form.Item>
          <Form.Item name="fromName" label="Your Name" rules={nameRules} required tooltip="This is a required field">
            <Input />
          </Form.Item>
          <Form.Item name="fromNumber" label="Your Number" tooltip="This is a required field">
            <InputNumber style={{ width: '30%' }} defaultValue="+44" />
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
