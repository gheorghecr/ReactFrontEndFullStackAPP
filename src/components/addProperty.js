import React from 'react';
import UserContext from '../contexts/user';

import { Form, Input, Button, Upload, Select, InputNumber, message, Checkbox } from 'antd';
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
			categorySent: false, //used to know when the category where sent to the server
			featureSent: false,  //used to know when the feature where sent to the server
		};
		this.onFinish = this.onFinish.bind(this);
		this.onFinishFailed = this.onFinishFailed.bind(this);
		this.onChange = this.onChange.bind(this);
		this.getAvailableFeature = this.getAvailableFeature.bind(this);
		this.getAvailableCategories = this.getAvailableCategories.bind(this);
		this.featuresCheckboxChanged = this.featuresCheckboxChanged.bind(this);
		this.categoriesCheckboxChanged = this.categoriesCheckboxChanged.bind(this);
		this.sendFeatures = this.sendFeatures.bind(this);
		this.sendCategories = this.sendCategories.bind(this);
	}

	static contextType = UserContext;

	componentDidMount() {
		this.getAvailableCategories();
		this.getAvailableFeature();
	}

	/**
	* Gets the available features from the server. In order to be used when adding a new property.
	*/
	getAvailableFeature() {
		fetch(`https://maximum-arena-3000.codio-box.uk/api/features`, {
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
					features: dataFromServer,
				});
				console.log(dataFromServer, 'features here')
			})
			.catch(error => {
				console.log(error)
				message.error('Could not get the available features. Try Again!', 5);
			});
	}

	/**
	* Gets the available categories from the server. In order to be used when adding a new property.
	*/
	getAvailableCategories() {
		fetch(`https://maximum-arena-3000.codio-box.uk/api/categories`, {
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
					categories: dataFromServer,
				});
				console.log(dataFromServer, 'categories here')
			})
			.catch(error => {
				console.log(error)
				message.error('Could not get the available categories. Try Again!', 5);
			});
	}

	/**
	* Saves the features selected to the state for later to be send to the server.
	*/
	featuresCheckboxChanged(checkedValuesFeatures) {
		this.setState({
			featuresSelected: checkedValuesFeatures,
		})
	}

	/**
	* Saves the categories selected to the state for later to be send to the server.
	*/
	categoriesCheckboxChanged(checkedValuesCategories) {
		this.setState({
			categoriesSelected: checkedValuesCategories,
		})
	}

	/**
	* When user clicks on registering. Post data to the server.
	*/
	onFinish = (values) => {
		console.log('Received values of add property form: ', values);
		const { confirm, ...data } = values;  // ignore the 'confirm' value in data sent

		delete data.file; //I don't use the file from here
		delete data.categories; // delete categories from here as they are not sent here
		delete data.features; // delete features from here as they are not sent here

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
				message.success('Property added successfully', 4);
				this.setState({
					dataFromServer: dataFromServer
				});
				this.sendFeatures();
				this.sendCategories();

			})
			.catch(error => {
				message.error(`${JSON.stringify(error.errorMessage)}`, 10);
			});
	};

	/**
	* Send the selected features to the server
	*/
	sendFeatures = () => {
		// send features only when there was something selected
		if (this.state.featuresSelected) {
			console.log('sending featuyres')
			let data = { propertyID: this.state.dataFromServer.id, featuresID: this.state.featuresSelected };

			fetch('https://maximum-arena-3000.codio-box.uk/api/features/propertyFeatures', {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Authorization": "Basic " + btoa(this.context.user.username + ":" + this.context.user.password),
					"Content-Type": "application/json"
				}
			})
				.then(status)
				.then(json)
				.then(dataFromServer => {
					this.setState({
						featureSent: true,
					})
				})
				.catch(error => {
					message.error(`${JSON.stringify(error.errorMessage)}`, 10);
				});
		} else {
			// set the state that features where sent (when there are no categories to sent)
			this.setState({
				featureSent: true,
			})
		}


	};

	/**
	* Send the selected categories to the server
	*/
	sendCategories = () => {
		// send categories only when there was something selected
		if (this.state.categoriesSelected) {
			console.log('sent categories')
			let data = { propertyID: this.state.dataFromServer.id, categoryID: this.state.categoriesSelected };

			fetch('https://maximum-arena-3000.codio-box.uk/api/categories/propertyCategory', {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Authorization": "Basic " + btoa(this.context.user.username + ":" + this.context.user.password),
					"Content-Type": "application/json"
				}
			})
				.then(status)
				.then(json)
				.then(dataFromServer => {
					this.setState({
						categorySent: true,
					})
				})
				.catch(error => {
					message.error(`${JSON.stringify(error.errorMessage)}`, 10);
				});
		} else {
			// set the state that categories where sent (when there are no categories to sent)
			this.setState({
				categorySent: true,
			})
		}
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

		if (this.state.categorySent === true && this.state.featureSent === true) {
			setTimeout(() => {
				this.props.history.push('/')
			}, 2000);
		}

		let featuresOptions = [];
		let categoriesOptions = [];

		// creates the check box options for the features
		if (this.state.features) {
			for (const feature of this.state.features) {
				feature.name = feature.name.replace('_', ' '); // removing underscore from name
				let featureObject = { label: feature.name, value: feature.ID }
				featuresOptions.push(featureObject);
			}
		}

		// creates the check box options for the categories
		if (this.state.categories) {
			for (const category of this.state.categories) {
				category.name = category.name.replace('_', ' '); // removing underscore from name
				let categoryObject = { label: category.name, value: category.ID }
				categoriesOptions.push(categoryObject);
			}
		}

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
						<Select style={{ width: '20%' }}>
							<Option value="1">Yes</Option>
							<Option value="0">No</Option>
						</Select>
					</Form.Item>
					<Form.Item name="status" label="Status" tooltip="Status of the property?" >
						<Select style={{ width: '20%' }}>
							<Option value="For Sale">For Sale</Option>
							<Option value="Under Offer">Under Offer</Option>
							<Option value="Sold">Sold</Option>
						</Select>
					</Form.Item>
					<Form.Item name="features" label="Select property features:" >
						<Checkbox.Group options={featuresOptions} onChange={this.featuresCheckboxChanged} />
					</Form.Item>
					<Form.Item name="categories" label="Select property categories:" >
						<Checkbox.Group options={categoriesOptions} onChange={this.categoriesCheckboxChanged} />
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
