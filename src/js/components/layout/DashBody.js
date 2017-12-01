import React from "react";
import cs from '../../constants/params';
import NotLoggedIn from './NotLoggedIn';
import DashParams from './DashParams';
import DashChart from './DashChart';
import DashKeys from './DashKeys';
import TAReportFailure from './TAReportFailure';
export default class extends React.Component {

  render() {
    
    const {props} = this;

    if (props.auth.status !== cs.status.AUTH_LOGGED_IN) {
      return <NotLoggedIn place="dashboard"/>;
    }
    const resultRoot = props.accounts.pageResults.accounts;
    const statsRoot = props.stats.pageResults;  
    // now render
    return  ( <span>
      <DashParams {...props} />
      <p></p>
      <DashChart {...props} />
      <p></p>
      <DashKeys {...props} />
      <div>
        <TAReportFailure pageResults={statsRoot.stats}/>
        <TAReportFailure pageResults={resultRoot.accounts}/>
      </div>
    </span>);
  }
}