import React from 'react';
import UserContext from '../contexts/user';
import { Col, Row, Affix, Button, Modal, Tabs } from 'antd';
// import { status, json } from '../utilities/requestHandlers';
import { MessageOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

class Messages extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      visible: false,
    }
  }

  componentDidMount() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  static contextType = UserContext;


  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  callback(key) {
    console.log(key);
  }

  render() {
    console.log(this.state.height)
    return (
      <>
        <Affix offsetTop={90} style={{ marginLeft: 40 }} icon={<MessageOutlined />} onChange={(affixed) => console.log(affixed)}>
          <Button type="primary" shape="round" size='large' onClick={this.showModal} > Messages </Button>
        </Affix>

        <Modal
          title="Messages"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okButtonProps={{ disabled: false }}
          cancelButtonProps={{ disabled: false }}
        >
          <Tabs defaultActiveKey="1" >
            <TabPane tab="List of Conversations" key="1">
              Content of Tab Pane 1
            </TabPane>
            <TabPane tab="Chat" key="2">
              Content of Tab Pane 2
            </TabPane>
          </Tabs>
        </Modal>

      </>
    );
  }
}


export default Messages;