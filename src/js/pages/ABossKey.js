import React from "react";
import TABossKey from '../components/layout/TABossKey';
import TAWrap from '../components/layout/TAWrap';

  
export default class  extends React.Component {
  
  // This will reselect the current item if the brower back is selected

  render() {

    return ( 
      <TAWrap location={this.props.location}>
      
        
        <TABossKey

          title={"Boss Keys"} 
          subtitle = {
            `A boss key is a kind of master key that enables you to create other keys. You cannot 
            access data items with a boss key, but you use it to create keys that can.`
          }
          intro = {
            `You would normally create these in the console, but the temporary boss key below will be used
            for these lessons.`
          }
        />
      
      </TAWrap>
    );
  }
}

      