import React from "react";
import TARequestUrl from './TARequestUrl';
import TAGenericParams from './TAGenericParams';

export default class extends React.Component {


  render() {

    const props = this.props;

    const xcs = <div>

        <h4>Request reference</h4>
        <TARequestUrl requestUrl={props.requestUrl} />
        <TAGenericParams rows={this.props.rows} />
      </div>;
      
    return xcs;
 
  }
}
