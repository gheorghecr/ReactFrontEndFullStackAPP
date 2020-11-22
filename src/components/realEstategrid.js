import React from 'react';
import UserContext from '../contexts/user';
import { Col, Row, Alert } from 'antd';
import { withRouter } from 'react-router-dom';
import PropertyCard from './propertyCard';
import { status, json } from '../utilities/requestHandlers';
class RealEstateGrid extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
      success: false, // state to check when to show the alert
      error: false, // state to check when to show the alert
      errorMessage: ' ', // error alert message
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
        this.setState({
          success: true,
        });
        console.log(dataFromServer);
        // delete the post from the posts state
        this.deletePropertyFromPosts(prop_ID);
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
    // TODO: Different link for admin an normal user
    fetch('https://maximum-arena-3000.codio-box.uk/api/properties')
      .then(status)
      .then(json)
      .then(data => {
        this.setState({ posts: data })
        this.setState({ loading: false })
      })
      .catch(err => console.log("Error fetching properties", err));
  }

  render() {

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
        message="Property deleted successfully!"
        description=""
        type="success"
        showIcon
      />
    );

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
        {this.state.error ? <div>{errorMessage}</div> : ''} {/* Show error message when needed*/}
        {this.state.success ? <div>{successMessage}</div> : ''}  {/* Show success message needed*/}

        <Row type="flex" justify="space-around">
          {cardList}
        </Row>
      </>
    );
  }
}


export default withRouter(RealEstateGrid);