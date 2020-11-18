import React from 'react';
import { Card, Carousel } from 'antd';
//import PostIcon from './posticon';
//import NavImage from './navimage';

const { Meta } = Card;

class PropertyCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const postID = this.props.prop_ID;

    const contentStyle = {
      height: '160px',
      color: '#fff',
      lineHeight: '160px',
      textAlign: 'center',
      background: '#364d79',
    };

    return (
      <Card
        style={{ width: 400 }}
        // cover={<NavImage alt={`Post ${postID}`} src={this.props.imageURL} to={`/post/${postID}`} />}

        hoverable={true}
        loading={this.props.loading}>
        <Carousel autoplay>
          <div>
            <h3 style={contentStyle}>1</h3>
          </div>
          <div>
            <h3 style={contentStyle}>2</h3>
          </div>
          <div>
            <h3 style={contentStyle}>3</h3>
          </div>
          <div>
            <h3 style={contentStyle}>4</h3>
          </div>
        </Carousel>
        <Meta
          title={this.props.title}
        />
        <br></br>
        <p>Description: {this.props.description}</p>
        <p>Status: {this.props.status} </p>
        <p>Location: {this.props.location}</p>
        <p>Price: ${this.props.price}</p>
        {this.props.highPriority ? <p>High Priority!</p> : ''} {/* Show high priority label only when necessary.*/}
      </Card>
    );
  }
}

export default PropertyCard; 