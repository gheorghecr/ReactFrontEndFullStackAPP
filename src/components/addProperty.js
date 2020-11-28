import React from 'react';
import UserContext from '../contexts/user';

import { Form, Input, Button, Upload, Select, InputNumber, message } from 'antd';
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
class AddPropertyForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			fileList: [],
		};
		this.onFinish = this.onFinish.bind(this);
		this.onFinishFailed = this.onFinishFailed.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	static contextType = UserContext;

	/**
	* When user clicks on registering. Post data to the server.
	*/
	onFinish = (values) => {
		console.log('Received values of add property form: ', values);
		const { confirm, ...data } = values;  // ignore the 'confirm' value in data sent

		delete data.file; //I don't use the file from here

		const formData = new FormData();

		for (const [ key, value ] of Object.entries(data)) {
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
				message.success('Property added successfully', 4);
				setTimeout(() => {
					this.props.history.push('/')
				}, 2000);

			})
			.catch(error => {
				message.error(`${JSON.stringify(error.errorMessage)}`, 10);
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

		const photosActions = {
			onChange: this.onChange,
			beforeUpload: () => false // upload manually
		};

		return (
			<>

				<h1 align="middle" style={{ padding: '2% 20%' }}>Add property</h1>
				<Form {...formItemLayout} name="register" onFinish={this.onFinish} scrollToFirstError onFinishFailed={this.onFinishFailed}>
					<Form.Item name="title" label="Title" rules={titleRules} required tooltip="This is a required field">
						<Input />
					</Form.Item>
					<Form.Item name="description" label="Description" rules={descriptionRules} required tooltip="This is a required field" >
						<TextArea rows={6} />
					</Form.Item>
					<Form.Item name="location" label="Location" rules={locationRules} required tooltip="This is a required field">
						<TextArea rows={3} />
					</Form.Item>
					<Form.Item name="price" label="Price" rules={priceRules} required tooltip="This is a required field">
						<InputNumber min={1} max={100000000000000} style={{ width: '20%' }} />
					</Form.Item>
					<Form.Item name="visibility" label="Visibility" tooltip="Visible to all users?">
						<Select style={{ width: '20%' }}>
							<Option value="1">Yes</Option>
							<Option value="0">No</Option>
						</Select>
					</Form.Item>
					<Form.Item name="highPriority" label="High Priority" tooltip="Is the high priority property?" >
						<Select  style={{ width: '20%' }}>
							<Option value="1">Yes</Option>
							<Option value="0">No</Option>
						</Select>
					</Form.Item>
					<Form.Item name="status" label="Status" tooltip="Status of the property?" >
						<Select  style={{ width: '20%' }}>
							<Option value="For Sale">For Sale</Option>
							<Option value="Under Offer">Under Offer</Option>
							<Option value="Sold">Sold</Option>
						</Select>
					</Form.Item>
					<Form.Item name="file" label="Select property images:" >
						<Upload {...photosActions}>
							<Button icon={<UploadOutlined />}>Upload</Button>
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
