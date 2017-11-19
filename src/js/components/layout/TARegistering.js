import React from "react";
import Article from "../Article";

export default class TARegistering extends React.Component {
  render() {
    
    const demos = [{ 
            title:"Getting started",
            subtitle:"Registering",
            content:<span>
            
            Before you can create items in the store you need to sign in using your Google or GitHub credentials,
            which you can do on the Navigation bar. There is no need for any kind of registration as no personal
            information is required to use this service. You can take this tutorial without signing in.
            
            
            </span>
        },
        { 
            title:"Accounts",
            subtitle:"Getting an account",
            content:<span>
            
            Accounts are managed in the dashboard in this app. All your activity in the store is assigned to an account. 
            You can create multiple accounts (the number is dependent on the plan) in the dashboard, but one will be created
            automatically for you when you sign in for the first time. You can take this tutorial without signing in as it will
            use it's own account for the demos.
            
            </span>
        }, {
            
            title:"The tutorial",
            subtitle:"How it works",
            content:<span>
            
            There is no need to sign in, as the tutorial uses it own account to demonstrate the API. Each topic will offer a
            brief explanation, issue a live call to the API and show you the result.
            </span>
        }, {
            
            title:"Boss key",
            subtitle:"How to get one",
            content:<span>
            
            Access to the store is controlled through the use of access keys. You generate your own access keys using the API.
            However, a boss key is required to generate an access key. You can generate multiple boss keys from the dashboard.
            Boss keys are specific to an account, so keys generated using the boss key will only work on the account 
            that owns the boss key. The tutorial generates its own boss keys, so there is no need for you to 
            generate one.
            
            </span>
        },
        
    ].map((d, i) => 
        <Article 
            key={i} 
            title={d.title}
            content={d.content} 
            subtitle={d.subtitle}
        /> 
    );

    
    return (

        <span>
          {demos}
        </span>


    );
  }
}
