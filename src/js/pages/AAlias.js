import React from "react";
import TAAlias from '../components/layout/TAAlias';
import TAWrap from '../components/layout/TAWrap';

  
export default class  extends React.Component {
  
  // This will reselect the current item if the brower back is selected

  render() {

    return ( 
      <TAWrap location={this.props.location}>
        <TAAlias
          keyType = {"alias"}
          title={"Register an alias"} 
          subtitle = {
            `You can use aliases to refer to data items`
          }
          intro = {
            `Aliases belong to access keys, and an access key can have as many aliases assigned
            as you want. Assigning a data item to an alias allows you to refer to different data items over time using the same name`
          }
        />
      </TAWrap>
    );
  }
}

      