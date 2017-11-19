import React from "react";
import {red500, green500} from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';

export default class extends React.Component {


  render() {

    const props = this.props;
    const iconStyles = {marginRight:8};
    const divStyles = { display: "inline-flex" , verticalAlign: "middle"};
    const color = props.ok ? green500 : red500;
    const icon = props.ok ? "check_circle" : "error";
    return  ( 
      <div style={divStyles}>
        <FontIcon className="material-icons" style={iconStyles} color={color}>{icon}</FontIcon>
        <span>{
            React.cloneElement(props.children, { 
            style:divStyles
          })
        }
        </span>
        
      </div>
     );

 
  }
}
