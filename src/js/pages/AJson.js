import React from "react";
import JsonEditor from '../components/layout/JsonEditor';
import AAWrap from '../components/layout/AAWrap';

  
export default class  extends React.Component {
  
  // This will reselect the current item if the brower back is selected

  render() {

    return ( 
      <AAWrap  
        location={this.props.location} 
        propagate = {["dispatch","accounts","auth","tutorial","stats"]}>
        <JsonEditor
          title={"Create JSON"} 
          subtitle = {
            `Manually creating json data`
          }
          intro = {
            `Enter JSON data and write it to the store`
          }
        />
      </AAWrap>
    );
  }
}

      