import React from "react";
import Article from "../components/Article";

import Process from '../containers/process';
import { acMenuSelectedValue }  from '../actions/index';  
import MenuWrapper from '../components/layout/MenuWrapper';

export default class  extends React.Component {
  
  // This will reselect the current item if the brower back is selected
  // or if a direct link is used.
  componentDidMount(){
    Process.store.dispatch (acMenuSelectedValue(Process.xRef[this.props.location.pathname]));
  } 
  
  render() {
    return (
      <MenuWrapper>

        <Article 
            title={"Getting started"}
            content={<span><p>When you first register, an account will be created. All data items and keys generated
            will be specific to an account and are constructed to know which account they belong to. All usage statistics 
            are also reported by account. All account acitivities and reporting are accessed through the console and dashboard.</p>
            <h4>Multiple accounts</h4>
            <p>You can create multiple accounts if necessary. You may want to report on usage for particular activities (although
             you can additionally filter on specific keys). The number of additional accounts you can create is 
             limited by the plan you are registered for.
            </p>
            <h4>Quotas</h4>
            <p>Quotas and rate limiting are applied by account - so you can double your quota by creating a new account if you
            feel constrained by any quotas.</p>
            <h4>Deleting -vs- deactivating accounts</h4>
            <p>If you delete an account then all keys and data items associated with that account immediately become unusable. 
            You may want to 
            do this if you share a key with someone accidentally. Deleing an account also removes all its usage data. As an alternative, 
            you can 
            make an account inactive. No activity of any kind will be permitted on the account until you reactivate it, 
            but the account usage 
            stats will still
            be available, and its boss keys will continue to exist - although they won't be usable while the account is not active.</p>
            </span>
            } 
            subtitle={"Accounts"}
            initiallyExpanded={true}
        /> 
      </MenuWrapper>
    );
  }
}
