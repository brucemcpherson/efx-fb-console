import React from "react";
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {List,ListItem} from 'material-ui/List';

export default class extends React.Component {


  render() {
    const bs = getMuiTheme().baseTheme;
   
    const mainStyle = {
      color:bs.palette.alternateTextColor,
      backgroundColor:bs.palette.accent1Color,
      display:"table",
      width:this.props.contentWidth,
      height:"calc(64% - " +this.props.contentTop + "px)",
    	position:"absolute",
    	top:this.props.contentTop,
    	left: this.props.contentLeft
    };
    
    const subStyle = {
      color:bs.palette.textColor,
      backgroundColor:bs.palette.accent2Color,
      display:"table",
      width:this.props.contentWidth,
      height:"36%",
    	position:"absolute",
    	top:"64%",
    	left: this.props.contentLeft
    };
    
    const leftSum = {
      position:"absolute",
      width:"50%",
      top:0,
      left:0,
      textAlign:'center'
      
    };
    const rightSum = {...leftSum, left:"50%"};

    
    return ( 
      <div>
        <div style={mainStyle}>
          <div style={{display:"table-cell",verticalAlign:"middle",textAlign:"center"}}>
          <img src="src/img/exn64.png"></img>
            <h1>Ephemeral Exchange API</h1>
            <h2>The easy way to share data between reluctant platforms</h2>
          </div>
        </div>
        <div style = {subStyle}>
          <span style={leftSum}>
            
            <List>
              <h4>Cloud Caching</h4>
              <ListItem primaryText="Simple JSON API" />
              <ListItem primaryText="Supports CORS and JSONP" />
              <ListItem primaryText="Free tier" />
            </List>
            
          </span>
          <span style={rightSum}>
            
            <List>
              <h4>Exchange transient data</h4>
              <ListItem primaryText="No need for authentication" />
              <ListItem primaryText="Key access and usage dashboard" />
              <ListItem primaryText="Encrypted store" />
            </List>
          </span>
        </div>
      </div>


    );
  }
}

