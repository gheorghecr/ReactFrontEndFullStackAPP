import React from 'react';

import { Form, Input, Button, Upload, Alert} from 'antd';
import { status, json } from '../utilities/requestHandlers';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';


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
];

const passwordRules = [
	{ required: true, message: 'Please input your password!' }
];

const confirmRules = [
	{ required: true, message: 'Please confirm your password!' },
	// rules can include function handlers in which you can apply additional logic
	({ getFieldValue }) => ({
		validator(rule, value) {
			if (!value || getFieldValue('password') === value) {
				return Promise.resolve();
			}
			return Promise.reject('The passwords that you entered do not match!');
		}
	})
];

const usernameRules = [
	{ required: true, message: 'Please input your username!', whitespace: true }
]

const firstNameRules = [
	{ required: true, message: 'Please input your first name!', whitespace: true }
]

const lastNameRules = [
	{ required: true, message: 'Please input your first name!', whitespace: true }
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
class RegistrationForm extends React.Component {

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
		console.log('finish')
		console.log('Received values of form: ', values);
		const { confirm, ...data } = values;  // ignore the 'confirm' value in data sent
		
		const formData = new FormData();
		formData.append('id', '123')
		formData.append('file', data.file.file)
		
		fetch('https://maximum-arena-3000.codio-box.uk/api/users', {
			method: "POST",
			body: formData,
			
			
		})
			.then(status)
			.then(json)
			.then(data => {
				this.setState({
					success: true
				});
				console.log(data);
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
				{this.state.success ? <div>{successMessage}</div> : ''}  {/* Show success message when user registered successfully*/}
				{this.state.error ? <div>{errorMessage}</div> : ''} {/* Show error message when user NOT registered successfully*/}

				<h1 align="middle" style={{ padding: '2% 20%' }}>Register</h1>
				<Form {...formItemLayout} name="register"  onFinish={this.onFinish} scrollToFirstError onFinishFailed={this.onFinishFailed}>
					{/* <Form.Item name="email" label="E-mail" rules={emailRules}>
						<Input />
					</Form.Item>
					<Form.Item name="firstName" label="First Name" rules={firstNameRules}>
						<Input />
					</Form.Item> 
					<Form.Item name="lastName" label="Last Name" rules={lastNameRules}>
						<Input />
					</Form.Item>
					<Form.Item name="username" label="Username" rules={usernameRules}>
						<Input />
					</Form.Item>
					<Form.Item name="password" label="Password" rules={passwordRules} hasFeedback>
						<Input.Password />
					</Form.Item>
					<Form.Item name="confirm" label="Confirm Password" dependencies={['password']}
						hasFeedback rules={confirmRules}>
						<Input.Password />
					</Form.Item>
					<Form.Item name="sign_up_code" label="Sign Up Code" >
						<Input />
					</Form.Item> */}
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
							Register
					</Button>
					</Form.Item>
				</Form>
			</>
		);
	}
}

export default withRouter(RegistrationForm);
