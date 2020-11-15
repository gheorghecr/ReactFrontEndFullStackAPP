import React from 'react';

import { Form, Input, Button, Upload } from 'antd';
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
			loading: false,
		};
		this.onFinish = this.onFinish.bind(this);
		this.onFinishFailed = this.onFinishFailed.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.beforeUpload = this.beforeUpload.bind(this);
	}

	onFinish = (values) => {
		console.log('finish')
		console.log('Received values of form: ', values);
		const { confirm, ...data } = values;  // ignore the 'confirm' value in data sent
		// let file = this.state.fileSelected;
		// console.log(file);
		// console.log(data);
		// data.push("file", file, file.name);
		console.log(data);
                
		fetch('https://maximum-arena-3000.codio-box.uk/api/users', {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(status)
			.then(json)
			.then(data => {
				alert("You registered successfully!")
				console.log(data);
			})
			.catch(error => {
				// TODO: show nicely formatted error message and clear form
				alert(`Error: ${JSON.stringify(error)}`);
			});
	};

	onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

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

	handleChange = info => {
		console.log('handle change')
		console.log(info)
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
					loading: false,
					'fileSelected': info.file
				}),
			);
			console.log(this.state)
			this.props.history.push('/login')
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

		return (
			<>
				<h1 align="middle" style={{ padding: '2% 20%' }}>Register</h1>
				<Form {...formItemLayout} name="register" onFinish={this.onFinish} scrollToFirstError onFinishFailed={this.onFinishFailed}>
					<Form.Item name="email" label="E-mail" rules={emailRules}>
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
							Register
					</Button>
					</Form.Item>
				</Form>
			</>
		);
	};
};

export default withRouter(RegistrationForm);

