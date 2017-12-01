import React from "react";
import MenuWrapper from '../components/layout/MenuWrapper';
import Locations from '../components/layout/Locations';


export default class extends React.Component {

  // This will reselect the current item if the brower back is selected

  render() {

    return (
      <MenuWrapper>
        <Locations /> 
      </MenuWrapper>
    );
  }
}
