import React from 'react';
import { Col, Row } from 'antd';
import PropertyCard from './propertyCard';
import { status, json } from '../utilities/requestHandlers';
class RealEstateGrid extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true
    }
  }

  componentDidMount() {
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
    // Show loading post while loading the data from the server
    if (!this.state.posts.length) {
      return (
        <Row type="flex" justify="space-around">
          <div style={{ padding: "10px" }} >
            <Col span={6}>
              <PropertyCard {...this.state}/>
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
        <div style={{ padding: "10px" }} key={post.ID}>
          <Col span={6}>
            <PropertyCard {...post} />
          </Col>
        </div>
      )
    });

    return (
      <Row type="flex" justify="space-around">
        {cardList}
      </Row>
    );
  }
}

export default RealEstateGrid;