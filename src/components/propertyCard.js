import React from 'react';
import { Card } from 'antd';
//import PostIcon from './posticon';
//import NavImage from './navimage';

const { Meta } = Card;

class PropertyCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        loading: false,
    };
  }

//   componentDidMount() {
//       console.log('aqui')
//     setTimeout(() => {
//         this.setState = {
//             loading: false,
//         };
//     }, 2000);
//   }

  render() {
    const { loading } = this.state;
    const postID = this.props.prop_ID;
    return (
      <Card
        style={{ width: 400 }}
        // cover={<NavImage alt={`Post ${postID}`} src={this.props.imageURL} to={`/post/${postID}`} />}
        hoverable={true}
        loading={loading}>
        <Meta 
            title={this.props.title} 
            description={this.props.description} 
        />
        <br></br>
        <p>Status: {this.props.status} </p>
        <p>Location: {this.props.location}</p>
        <p>Price: ${this.props.price}</p>
        {this.props.highPriority ? <p>High Priority!</p> : ''} {/* Show high priority label only when necessary.*/}
      </Card>
    );
  }
}

export default PropertyCard; 