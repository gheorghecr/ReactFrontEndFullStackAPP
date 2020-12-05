import React from 'react';
import UserContext from '../contexts/user';
import { Col, Row, Button, message, Input, PageHeader } from 'antd';
import { withRouter } from 'react-router-dom';
import PropertyCard from './propertyCard';
import { status, json } from '../utilities/requestHandlers';

const { Search } = Input;
class RealEstateGrid extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
      highPriority: false, // used to know when the user is filtering by high Priority or not
      previousValueOnSearch: this.props.searchValue,
    }
    this.toggleHighPriorityState = this.toggleHighPriorityState.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
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
    // Fetch request depends on the user role and if is filtered high priority or not
    if (this.context.user.role === 'admin') {
      if (this.state.highPriority === true) {
        fetchLink = 'https://maximum-arena-3000.codio-box.uk/api/properties/adminview/highPriority';
      } else {
        fetchLink = 'https://maximum-arena-3000.codio-box.uk/api/properties/adminview';
      }
    } else {
      if (this.state.highPriority === true) {
        fetchLink = 'https://maximum-arena-3000.codio-box.uk/api/properties/highpriority';
      } else {
        fetchLink = 'https://maximum-arena-3000.codio-box.uk/api/properties';
      }
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
        console.log(data)
        this.setState({ posts: data })
        this.setState({ loading: false })
      })
      .catch(error => {
        console.log("Error fetching properties", error);
        if (error.message === 'No properties available' || error.message === 'No properties available marked as High Priority') {
          message.error('No properties available', 3)
          this.setState({
            loading: false,
          })
        } else {
          this.setState({
            loading: false,
          })
          message.error(error.message, 5)
        }
      });
  }

  /**
  * Used to toggle the state that is reportable to request the properties 
  * by high Priority or not.
  * 
  */
  toggleHighPriorityState() {
    this.setState({
      highPriority: !this.state.highPriority,
      loading: true,
      posts: [],
    })

    // give time to set the state before mounting the component again
    setTimeout(() => {
      this.componentDidMount();
    }, 500);
  }


  /**
  * When a user clicks on search this gets triggered and then requests the server for properties.
  * Using the search query.
  * 
  * @param {string} value - Search text.
  */
  handleChange = value => {
    this.setState({
      loading: true,
    })

    let fetchLink;
    // Fetch request depends on the user role and if is filtered high priority or not
    if (this.context.user.role === 'admin') {
      fetchLink = `https://maximum-arena-3000.codio-box.uk/api/properties/search/admin?q=${value}`;
    } else {
      fetchLink = `https://maximum-arena-3000.codio-box.uk/api/properties/search?q=${value}`;
    }

    console.log(fetchLink)

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
        console.log(data)
        this.setState({ posts: data })
        this.setState({ loading: false })
      })
      .catch(error => {
        console.log("Error fetching properties", error);
        if (error.message === 'No properties available' || error.message === 'No properties available marked as High Priority') {
          message.error('No properties found with that search query', 3)
          this.setState({
            loading: false,
          })
        } else {
          this.setState({
            loading: false,
          })
          message.error(error.message, 5)
        }
      });
  };

  render() {
    // Show loading post while loading the data from the server
    if (!this.state.posts.length && this.state.loading === true) {
      return (
        <>
          <Row type="flex" justify="space-around">
            {/* Button to request by high priority or not */}
            <div style={{ marginLeft: "60px", marginBottom: "20px" }} align="start">
              <Button type="primary" shape="round" size='large' onClick={() => (this.toggleHighPriorityState())} > {this.state.highPriority ? "List All" : "List High Priority Only"}</Button>
            </div>
          </Row>
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
        </>
      )
    }

    // Show message if there are no properties
    if (!this.state.posts.length && this.state.loading === false) {
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


            {/* Button to list all properties again when user request high priority properties and there are node*/}
            {this.state.highPriority ? <div style={{ marginLeft: "60px", marginBottom: "20px" }} align="start">
              <Button type="primary" shape="round" size='large' onClick={() => (this.toggleHighPriorityState())} > {this.state.highPriority ? "List All" : "List High Priority Only"}</Button>
            </div>
              : ' '}


          </Row>
          <Row type="flex" justify="space-around">
            <h1> There are no properties</h1>
          </Row>
        </>
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
        {/* Search bar for the real estate grid app */}
        <div style={{ padding: '2% 20%' }}>
          <Search placeholder="Input search text, you can search by title, description or location"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={this.handleChange} />
          <PageHeader className="site-page-header"
            title="Real Estate"
            subTitle="Real Estate APP" />
        </div>

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

          {/* Button to request by high priority or not */}
          <div style={{ marginLeft: "60px", marginBottom: "20px" }} align="start">
            <Button type="primary" shape="round" size='large' onClick={() => (this.toggleHighPriorityState())} > {this.state.highPriority ? "List All" : "List High Priority Only"}</Button>
          </div>

        </Row>

        <Row type="flex" justify="space-around">
          {cardList}
        </Row>
      </>
    );
  }
}


export default withRouter(RealEstateGrid);