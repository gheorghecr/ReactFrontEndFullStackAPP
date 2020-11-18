import React from 'react';
import UserContext from '../contexts/user';
import { Form, Input, Button, Alert} from 'antd';
import { status, json } from '../utilities/requestHandlers';
import { withRouter } from 'react-router-dom';


const formItemLayout = {
	labelCol: { xs: { span: 24 }, sm: { span: 6 } },
	wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
};

const tailFormItemLayout = {
	wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } },
};


const passwordRules = [
    { required: true, message: 'Please input your password!' }
];

const usernameRules = [
    { required: true, message: 'Please input your username!', whitespace: true }
]

/**
* Login form component for app sing in.
*/
class LoginForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			success: false, // state to check when to show the alert
			error: false, // state to check when to show the alert
			errorMessage: ' ', // error alert message
		};
		this.login = this.login.bind(this);
        this.onFinishFailed = this.onFinishFailed.bind(this);
    }
    
    static contextType = UserContext;

	/**
	* Login function, that sends the request to the server. And if successful
	* store the user details into the context
	*/
    login(values) {
		this.setState({
			error: false // remove error banner if there already
		});
        const { username, password } = values;
        console.log(`logging in user: ${username}`)
        fetch('https://maximum-arena-3000.codio-box.uk/api/users/login', {
            method: "POST",
            headers: {
                "Authorization": "Basic " + btoa(username + ":" + password)
            }
        })
            .then(status)
            .then(json)
            .then(user => {
                console.log(user);
                this.setState({
					success: true
                });
                window.scrollTo(0, 0);
				this.context.login(user);
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
    }

	/**
	* When there is as an error on submit.
	*/
	onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	render() {
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
				message="Login successfully!"
				description="You will be redirected to home page."
				type="success"
				showIcon
			/>
		);

		return (
			<>
				{this.state.success ? <div>{successMessage}</div> : ''}  {/* Show success message when user logs in successfully*/}
				{this.state.error ? <div>{errorMessage}</div> : ''} {/* Show error message when user does not log in successfully*/}

				<h1 align="middle" style={{ padding: '2% 20%' }}>Login</h1>
				<Form {...formItemLayout} name="register" onFinish={this.login} scrollToFirstError onFinishFailed={this.onFinishFailed}>
					<Form.Item name="username" label="Username" rules={usernameRules}>
						<Input />
					</Form.Item>
					<Form.Item name="password" label="Password" rules={passwordRules} hasFeedback>
						<Input.Password />
					</Form.Item>
					<Form.Item {...tailFormItemLayout}>
						<Button type="primary" htmlType="submit">
							Login
					</Button>
					</Form.Item>
				</Form>
			</>
		);
	}
}

export default withRouter(LoginForm);
