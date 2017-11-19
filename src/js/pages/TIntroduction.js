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
            content={<span><p>If you need to exchange data between systems which have no easy way of communicating,
            or you don't want to worry about authentication you could consider the Effex API for collaboration. 
            The API allows you to
            create private transient data messages in a cloud store and retrieve them later from the same or a different 
            platform</p>
            <h4>Tutorial and guide</h4>
            <p>The tutorial is interactive and demonstrates how to execute each of the API's methods, along with
            the reponse to expect. It doesn't need to be done in any particular order, and can serve as both a referenced and a guide.
            You can go straight there if you want to skip the rest of the articles in the introduction.
            </p>
            <h4>Prequisites</h4>
            <p>The collaborating systems need to be able to issue HTTP requests and deal with JSON responses. 
            CORS is automatically supported, as is JSONP, useful if you are writing or reading 
            from a JavaScript client or a locked down desktop app. Usually items are created with POST requests, but
            you can create small data items with a GET request too, which means that even a browser
            can be used to read and write data.
            </p>
            <h4>Access Keys</h4>
            <p>There is no authentication required. Keys specific to your account 
            are generated that allow reading and writing to the store. A writer key that has been authorized to write
            can create an item, and a reader or updater key (which has been authorized to) can access that item. 
            Both an access key
            and an item id
            is needed to get to data in the store. Both data and keys expire after a given time</p>
            <h4>Rate limits</h4>
            <p>The specific rate limits will depend on the Plan you have subscribed too, but in this beta phase
            the Free plan has generous rate and quota limits. Rate limiting is necessary to protect the API
            against accidental or malicious misuse. Data lifetime is limited to 12 hours after which it will be removed
            from the store and its key will expire.</p>
            <h4>Personally identifiable information</h4>
            <p>This is a public data store, although it is protected by encryption and access keys. Many countries have
            data protection laws covering which data can be stored and where they can be physically resident.
            You should not store personally identifiable information in the store. Google have a useful 
            <a href="https://support.google.com/analytics/answer/6366371">guide</a> that describes how to avoid storing such data.</p>
            </span>
            } 
            subtitle={"What is this API all about"}
           
        /> 
      </MenuWrapper>
    );
  }
}
