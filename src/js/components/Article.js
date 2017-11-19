import React from "react";


export default class Article extends React.Component {
  render() {

    return (
      <div style={{fontFamily:"Noto Sans"}}>
        <h3>{this.props.title}</h3>
        <h4>{this.props.subtitle}</h4>
        <div>
        {this.props.content}
        </div>
      </div>
    );
  }
}