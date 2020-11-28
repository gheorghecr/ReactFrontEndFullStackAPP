import React from 'react';
import UserContext from '../contexts/user';
import { Col, Row, Button, message } from 'antd';
import { withRouter } from 'react-router-dom';
import PropertyCard from './propertyCard';
import { status, json } from '../utilities/requestHandlers';
class RealEstateGrid extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
    }
  }

  static contextType = UserContext;

  /**
    * Delete an property method. This is triggered from the child component.
    */
  deleteProperty = (prop_ID) => {
    fetch(`https://maximum-arena-3000.codio-box.uk/api/properties/${prop_ID}`, {
      method: "DELETE",
      body: null,
      headers: {
        "Authorization": "Basic " + btoa(this.context.user.username + ":" + this.context.user.password)
      }
    })
      .then(status)
      .then(json)
      .then(dataFromServer => {
        // delete the post from the posts state
        this.deletePropertyFromPosts(prop_ID);
        message.success('Property deleted successfully', 4);
      })
      .catch(error => {
        window.scrollTo(0, 0);
        message.error(`${JSON.stringify(error.errorMessage)}`, 10);
      });
  }

  /**
  * Deletes the deleted property from the posts list on the state
  * And Triggers update
  */
  deletePropertyFromPosts = (prop_ID) => {
    const postsCopy = [...this.state.posts]
    const indexToRemove = postsCopy.findIndex(obj => obj.prop_ID === prop_ID);
    postsCopy.splice(indexToRemove, 1);

    this.setState({
      posts: postsCopy,
    });
  }

  /**
  * Fetch all the properties
  */
  componentDidMount() {
    let fetchLink;
    // Fetch request depends on the user role
    if (this.context.user.role === 'admin') {
      fetchLink = 'https://maximum-arena-3000.codio-box.uk/api/properties/adminview';
    } else {
      fetchLink = 'https://maximum-arena-3000.codio-box.uk/api/properties';
    }

    fetch(fetchLink, {
      method: "GET",
      body: null,
      headers: {
        "Authorization": "Basic " + btoa(this.context.user.username + ":" + this.context.user.password)
      }
    })
      .then(status)
      .then(json)
      .then(data => {
        this.setState({ posts: data })
        this.setState({ loading: false })
      })
      .catch(error => {
        console.log("Error fetching properties", error);
        setTimeout(() => {
          this.componentDidMount(); // keep requesting for properties
        }, 2000);
      });
  }

  render() {

    // Show loading post while loading the data from the server
    if (!this.state.posts.length) {
      return (
        <Row type="flex" justify="space-around">
          <div style={{ padding: "10px" }} >
            <Col span={6}>
              <PropertyCard {...this.state} />
            </Col>
          </div>,
          <div style={{ padding: "10px" }} >
            <Col span={6}>
              <PropertyCard {...this.state} />
            </Col>
          </div>
          <div style={{ padding: "10px" }} >
            <Col span={6}>
              <PropertyCard {...this.state} />
            </Col>
          </div>
        </Row>
      )
    }
    const cardList = this.state.posts.map(post => {
      return (
        <div style={{ padding: "10px" }} key={post.prop_ID}>
          <Col span={6}>
            <PropertyCard {...post} history={this.props.history} deleteProperty={this.deleteProperty} />
          </Col>
        </div>
      )
    });

    return (
      <>

        <Row type="flex" justify="space-around">
          {/* Show the add a property button only if an admin is logged in */}
        {this.context.user.role === 'admin' ?
          <div style={{ marginLeft: "60px", marginBottom: "20px" }} align="start">
            <Button type="primary" shape="round" size='large' onClick={() => (this.props.history.push({
              pathname: '/addProperty',
              state: { prop_ID: this.props.prop_ID }
            }))} > Add a Property </Button>
          </div>
          : " "}

          {/* Show the see my messages button only if an admin is logged in */}
          {this.context.user.role === 'admin' ?
            <div style={{ marginLeft: "60px", marginBottom: "20px" }} align="start">
              <Button type="primary" shape="round" size='large' onClick={() => (this.props.history.push({
                pathname: '/messages',
                state: { prop_ID: this.props.prop_ID }
              }))} > See my messages </Button>
            </div>
            : " "}

        </Row>

        <Row type="flex" justify="space-around">
          {cardList}
        </Row>
      </>
    );
  }
}


export default withRouter(RealEstateGrid);