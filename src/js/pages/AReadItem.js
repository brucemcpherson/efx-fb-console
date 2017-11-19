import React from "react";
import TAReadItem from '../components/layout/TAReadItem';
import TAWrap from '../components/layout/TAWrap';


  
export default class  extends React.Component {
  
  // This will reselect the current item if the brower back is selected

  render() {

    return ( 
      <TAWrap location={this.props.location}>
        <TAReadItem

          title={"A data item can be read using the key that wrote it"} 
          subtitle = {
            `some items will have been created automatically along with any keys needed for
            the demonstration.`
          }
          intro = {
            `You can pick which item to read from the list below which will also show the items 
            you have created for reading during the session. You can only read these items with the key that created them.`
          }
        />
      </TAWrap>
    );
  }
}
