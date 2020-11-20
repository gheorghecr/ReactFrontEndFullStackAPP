import React from 'react';

import { Form, Input, Button, Upload, Alert, Select, } from 'antd';
import { status, json } from '../utilities/requestHandlers';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
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
	{ type: 'number', message: 'The input is not valid E-mail!' },
	{ required: true, message: 'Please input an price for the property!', whitespace: true }
]

function getBase64(img, callback) {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
}

/**
* Dummy request when uploading image. This is necessary because when uploading a image
* it requires an action. And I don't use that action. 
*/
const dummyRequest = ({ file, onSuccess }) => {
	setTimeout(() => {
		onSuccess("ok");
	}, 0);
};

/**
* Registration form component for app signup.
*/
class AddPropertyForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			selectedFile: null,
			loading: false,
			success: false, // state to check when to show the alert
			error: false, // state to check when to show the alert
			errorMessage: ' ', // error alert message
		};
		this.onFinish = this.onFinish.bind(this);
		this.onFinishFailed = this.onFinishFailed.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.beforeUpload = this.beforeUpload.bind(this);
	}

	/**
	* When user clicks on registering. Post data to the server.
	*/
	onFinish = (values) => {
		console.log('Received values of add property form: ', values);
		const { confirm, ...data } = values;  // ignore the 'confirm' value in data sent
		
		const formData = new FormData();
		// TODO: Add the seler ID
		formData.append('email', data.email)
		formData.append('firstName', data.firstName)
		formData.append('lastName', data.lastName)
		formData.append('password', data.password)
		formData.append('sign_up_code', data.sign_up_code)
		formData.append('username', data.username)
		// Add file only if exists
		if(data.file) {
			formData.append('file', data.file.file.originFileObj)
		}
		
		fetch('https://maximum-arena-3000.codio-box.uk/api/properties', {
			method: "POST",
			body: formData,
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
					this.props.history.push('/login')
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
	* Before the user uploads the image (avatar), check if it is an accepted format.
	* And also check's for a max size file.
	*/
	beforeUpload(file) {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
		if (!isJpgOrPng) {
			alert.error('You can only upload JPG/PNG file!');
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			alert.error('Image must smaller than 2MB!');
		}
		return isJpgOrPng && isLt2M;
	}

	/**
	* Handles the change when the image is uploaded.
	* Stores it on the props.
	*/
	handleChange = info => {
		if (info.file.status === 'uploading') {
			this.setState({ loading: true });
			return;
		}
		if (info.file.status === 'done') {
			// Get this url from response in real world.
			this.setState({ loading: false });
			this.setState({ 'selectedFile': info.file });
			getBase64(info.file.originFileObj, imageUrl =>
				this.setState({
					imageUrl,
				}),
			);
		}
		if (info.file.status === 'error') {
			// Get this url from response in real world.
			alert('Error occurred')
			this.setState({ loading: false });
		}
	};

	render() {
		const { loading, imageUrl } = this.state;
		const uploadButton = (
			<div>
				{loading ? <LoadingOutlined /> : <PlusOutlined />}
				<div style={{ marginTop: 8 }}>Upload</div>
			</div>
		);
		
		/**
		* Error Alert from ant design.
		*/
		const errorMessage = (
			<Alert
				message="Error"
				description= {this.state.errorMessage}
				type="error"
				showIcon
			/>
		);

		/**
		* Success Alert from ant design.
		*/
		const successMessage = (
			<Alert
				message="Registered successfully!"
				description="You will be redirected to login page."
				type="success"
				showIcon
			/>
		);

		return (
			<>
				{this.state.success ? <div>{successMessage}</div> : ''}  {/* Show success message when property added successfully*/}
				{this.state.error ? <div>{errorMessage}</div> : ''} {/* Show error message when property NOT added  successfully*/}

				<h1 align="middle" style={{ padding: '2% 20%' }}>Add property</h1>
				<Form {...formItemLayout} name="register"  onFinish={this.onFinish} scrollToFirstError onFinishFailed={this.onFinishFailed}>
					<Form.Item name="title" label="Title" rules={titleRules} required tooltip="This is a required field">
						<Input />
					</Form.Item>
					<Form.Item name="description" label="Description" rules={descriptionRules} required tooltip="This is a required field" >
						<TextArea rows={6} />
					</Form.Item> 
                    <Form.Item name="price" label="Price" rules={priceRules} required tooltip="This is a required field">
						<Input />
					</Form.Item>
					<Form.Item name="location" label="Location" rules={locationRules} required tooltip="This is a required field">
						<Input />
					</Form.Item>
					<Form.Item name="visibility" label="Visibility"  hasFeedback tooltip="Visible to all users?">
						<Select defaultValue="0">
							<Option value="1">Yes</Option>
							<Option value="0">No</Option>
						</Select>
					</Form.Item>
					<Form.Item name="highPriority" label="High Priority" tooltip="Is the high priority property?" >
						<Select defaultValue="0">
							<Option value="1">Yes</Option>
							<Option value="0">No</Option>
						</Select>
					</Form.Item>
					<Form.Item name="file" label="Select your avatar" >
						<Upload
							name="file"
							listType="picture-card"
							className="avatar-uploader"
							showUploadList={false}
							customRequest={dummyRequest}
							beforeUpload={this.beforeUpload}
							onChange={this.handleChange}
						>
							{imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
						</Upload>
					</Form.Item>
					<Form.Item {...tailFormItemLayout}>
						<Button type="primary" htmlType="submit">
							Add Property
					</Button>
					</Form.Item>
				</Form>
			</>
		);
	}
}

export default withRouter(AddPropertyForm);
