import React from "react";
import TAShareItem from '../components/layout/TAShareItem';
import TAWrap from '../components/layout/TAWrap';


export default class  extends React.Component {
  
  // This will reselect the current item if the brower back is selected

  render() {

    return ( 
      <TAWrap location={this.props.location}>
        <TAShareItem

          title={"A data item can be shared with others"} 
          subtitle = {
            `some items will have been created automatically along with any keys needed for
            the demonstration`
          }
          intro = {
            `In previous examples, items have been accessible only by the owner (the writer key that created them).
            This lesson will create an item and allow others to share it`
          }
        />
      </TAWrap>
    );
  }
}
