import React from 'react';
import RealEstateGrid from './realEstategrid';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

render() {
  return (
    <>
      <div className="site-layout-content">
        <RealEstateGrid/>
      </div>
    </>  
  );
}

  
}

export default Home;