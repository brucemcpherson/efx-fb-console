import React from "react";
import TAReadAliasItem from '../components/layout/TAReadAliasItem';
import TAWrap from '../components/layout/TAWrap';


  
export default class  extends React.Component {
  
  // This will reselect the current item if the brower back is selected

  render() {

    return ( 
      <TAWrap location={this.props.location}>
        <TAReadAliasItem

          title={"A data item can be accessed by an alias"} 
          subtitle = {
            `If there are no items here, go to the Aliases page and create aliases for data items`
          }
          intro = {
            `You can pick which item to read by its alias from the list below.`
          }
        />
      </TAWrap>
    );
  }
}
