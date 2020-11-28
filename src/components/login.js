import React from 'react';
import UserContext from '../contexts/user';
import { Form, Input, Button, message} from 'antd';
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
        fetch('https://maximum-arena-3000.codio-box.uk/api/users/login', {
            method: "POST",
            headers: {
                "Authorization": "Basic " + btoa(username + ":" + password)
            }
        })
            .then(status)
            .then(json)
            .then(user => {
				message.success('Login successfully! You will be redirected to home page.' , 4);
				this.context.login(user, password);
                setTimeout(() => {
					this.props.history.push('/')
				}, 2000);
            })
            .catch(error => {
                window.scrollTo(0, 0); 
				message.error(`${JSON.stringify(error.errorMessage)}`, 10);
            });
    }

	/**
	* When there is as an error on submit.
	*/
	onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	render() {
	
		return (
			<>
				<h1 align="middle" style={{ padding: '2% 20%' }}>Login</h1>
				<Form {...formItemLayout} name="register" onFinish={this.login} scrollToFirstError onFinishFailed={this.onFinishFailed}>
					<Form.Item name="username" label="Username" rules={usernameRules}>
						<Input />
					</Form.Item>
					<Form.Item name="password" label="Password" rules={passwordRules} >
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
