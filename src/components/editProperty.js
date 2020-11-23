import React, { useState } from 'react';
import UserContext from '../contexts/user';

import { Form, Input, Button, Upload, Alert, Select, InputNumber, Carousel, Image } from 'antd';
import { status, json } from '../utilities/requestHandlers';
import { UploadOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;


const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
};

const tailFormItemLayout = {
  wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } },
};

const descriptionRules = [
  { required: true, message: 'Please input an description for the property!', whitespace: true }
]

const titleRules = [
  { required: true, message: 'Please input an title for the property!', whitespace: true }
]

const locationRules = [
  { required: true, message: 'Please input an location for the property!', whitespace: true }
]

const priceRules = [
  { required: true, message: 'Please input an price for the property!' }
]

/**
* Registration form component for app signup.
*/
class EditProperty extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      prop_ID: this.props.location.state.prop_ID,
      success: false, // state to check when to show the alert
      error: false, // state to check when to show the alert
      errorMessage: ' ', // error alert message
      fileList: [],
    };
    this.onFinish = this.onFinish.bind(this);
    this.onFinishFailed = this.onFinishFailed.bind(this);
    this.onChange = this.onChange.bind(this);
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
        console.log(dataFromServer[0], 'sdsds')
        this.setState({
          propertyObject: dataFromServer[0]
        });
        this.getImagesName();
      })
      .catch(error => {
        setTimeout(() => {
          this.componentDidMount(); // keep requesting for this property
        }, 2000);
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
        console.log(dataFromServer, 'images')
        this.setState({
          propertyImagesName: dataFromServer
        });
      })
      .catch(error => {
        setTimeout(() => {
          this.getImagesName(); // keep requesting for this images names
        }, 2000);
      });
  }

  /**
  * When user clicks on registering. Post data to the server.
  */
  onFinish = (values) => {
    console.log('Received values of add property form: ', values);
    const { confirm, ...data } = values;  // ignore the 'confirm' value in data sent

    delete data.file; //I don't use the file from here

    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value)
    }

    // Adding all files to the form data
    for (let file of this.state.fileList) {
      formData.append('file', file.originFileObj)
    }

    fetch('https://maximum-arena-3000.codio-box.uk/api/properties', {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": "Basic " + btoa(this.context.user.username + ":" + this.context.user.password)
      }
    })
      .then(status)
      .then(json)
      .then(dataFromServer => {
        this.setState({
          success: true
        });
        console.log(dataFromServer);
        window.scrollTo(0, 0);
        setTimeout(() => {
          this.props.history.push('/')
        }, 2000);

      })
      .catch(error => {
        window.scrollTo(0, 0);
        this.setState({
          errorMessage: `${JSON.stringify(error.errorMessage)}`,
          error: true
        });
      });
  };

  /**
  * When there is as an error on submit.
  */
  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  /**
  * Handles the change when the image is uploaded.
  * Stores it on the state.fileList.
  */
  onChange({ file, fileList }) {
    if (file.status !== 'done') {
      this.setState({
        fileList: fileList
      })
    }
    console.log(this.state.fileList)
  }

  render() {
    // const { loading } = this.state

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
        message="Property added successfully!"
        description=""
        type="success"
        showIcon
      />
    );

    const photosActions = {
      onChange: this.onChange,
      beforeUpload: () => false // upload manually
    };

    // Show loading post while loading the data from the server
    if (!this.state.propertyObject) {
      return (
        <h1>test</h1>
      )
    }

    // Used on the image carousel 
    const contentStyle = {
      height: '400px',
      color: '#fff',
      lineHeight: '160px',
      textAlign: 'center',
      background: '#364d79',
    };

    let photoList = [];

    if (this.state.propertyImagesName) {
      photoList = this.state.propertyImagesName.map(image => {
        return (
          <div>
            <Image
              width={200}
              src={`https://maximum-arena-3000.codio-box.uk/${image.imageName}`}
            />
          </div>
        )
      });
    }


    return (
      <>

        {this.state.success ? <div>{successMessage}</div> : ''}  {/* Show success message when property added successfully*/}
        {this.state.error ? <div>{errorMessage}</div> : ''} {/* Show error message when property NOT added  successfully*/}

        <h1 align="middle" style={{ padding: '2% 20%' }}>Edit property</h1>
        <Carousel autoplay dotPosition={'top'} style={{ padding: '2% 20%' }}>
          {photoList}
          {/* <div>
            <h3 style={contentStyle}>4</h3>
          </div> */}
        </Carousel>
        <Form {...formItemLayout} name="register" onFinish={this.onFinish} scrollToFirstError onFinishFailed={this.onFinishFailed} >
          <Form.Item name="title" label="Title" rules={titleRules} required tooltip="This is a required field" initialValue={this.state.propertyObject.title}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={descriptionRules} required tooltip="This is a required field" initialValue={this.state.propertyObject.description}>
            <TextArea rows={6} />
          </Form.Item>
          <Form.Item name="location" label="Location" rules={locationRules} required tooltip="This is a required field" initialValue={this.state.propertyObject.location}>
            <TextArea rows={3}>LOL</TextArea>
          </Form.Item>
          <Form.Item name="price" label="Price" rules={priceRules} required tooltip="This is a required field" initialValue={this.state.propertyObject.price}>
            <InputNumber min={1} max={100000000000000} style={{ width: '20%' }} />
          </Form.Item>
          <Form.Item name="visibility" label="Visibility" tooltip="Visible to all users?" >
            <Select style={{ width: '20%' }} defaultValue={this.state.propertyObject.visibility ? 'Yes' : 'No'}>
              <Option value="1">Yes</Option>
              <Option value="0">No</Option>
            </Select>
          </Form.Item>
          <Form.Item name="highPriority" label="High Priority" tooltip="Is the high priority property?">
            <Select style={{ width: '20%' }} defaultValue={this.state.propertyObject.highPriority ? 'Yes' : 'No'} >
              <Option value="1">Yes</Option>
              <Option value="0">No</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status" tooltip="Status of the property?">
            <Select style={{ width: '20%' }} defaultValue={this.state.propertyObject.status ? 'Yes' : 'No'} >
              <Option value="For Sale">For Sale</Option>
              <Option value="Under Offer">Under Offer</Option>
              <Option value="Sold">Sold</Option>
            </Select>
          </Form.Item>
          <Form.Item name="file" label="Select your avatar" >
            <Upload {...photosActions}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Save Changes
					</Button>
          </Form.Item>
        </Form>
      </>
    );
  }
}

export default withRouter(EditProperty);
