import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Console from './pages/Console';

import TRegistering from './pages/TRegistering';
import TIntroduction from './pages/TIntroduction';
import TConsole from './pages/TConsole';
import TAccounts from './pages/TAccounts';
import TBossKey from './pages/TBossKey';
import TApiExplorer from './pages/TApiExplorer';

import ABossKey from './pages/ABossKey';
import AWriterKey from './pages/AWriterKey';
import AReaderKey from './pages/AReaderKey';
import AValidateKey from './pages/AValidateKey';
import AUpdaterKey from './pages/AUpdaterKey';

import AWriteItem from './pages/AWriteItem';
import AReadItem from './pages/AReadItem';
import AShareItem from './pages/AShareItem';
import ASharedReadItem from './pages/ASharedReadItem';
import ASharedUpdateItem from './pages/ASharedUpdateItem';
import APing from './pages/APing';
import AInfo from './pages/AInfo';
import ARemoveItem from './pages/ARemoveItem';
import AQuotas from './pages/AQuotas';
import AAlias from './pages/AAlias';
import AReadAliasItem from './pages/AReadAliasItem';
import ADemo from './pages/ADemo';
import AJson from './pages/AJson';
import ALocations from './pages/ALocations';
import {
  Provider
}
from 'react-redux';
import Process from './containers/process';
import {
  ListItem
}
from 'material-ui/List';

import {
  Router,
  Route,
  IndexRoute,
  hashHistory,
  Link,
  IndexLink
}
from "react-router";


// set up date structures for this then start rendering
// this can all be easily set up  with a recursive map
// the first item in each array is the master
// if there's no array then its a router link

let key = 0;
let routes = [];
Process.xRef = {};

// this approach will allow me to set up both the routes and 
// the leftdrawer listitems consistently from this array
Process.xRoutes = [
  
  {label: 'Home',component: Home},
  {label: 'Links',component: ALocations},
  [{label: 'Accounts'}, 
  {label: 'Console',component: Console}, 
  {label: 'Dashboard',component: Dashboard},
  {label: 'JSON editor',component: AJson}],

  [{label: 'Tutorial'},
    
    [{label: 'Getting started'}, 
    {label: 'Introduction',component: TIntroduction}, {label: 'Registering',component: TRegistering}, 
     {label: 'Console',component: TConsole}, {label: 'Accounts',component: TAccounts}, 
     {label: 'Boss key',component: TBossKey}, 
     {label: 'API explorer',component: TApiExplorer}, {label: 'Summary',component: About}
    ],

    [{label: 'Access keys'}, {label: 'Boss',component: ABossKey}, 
     {label: 'Writer',component: AWriterKey}, {label: 'Reader',component: AReaderKey}, {label: 'Updater',component: AUpdaterKey},
     {label: 'Validate',component: AValidateKey}, {label: 'Ping',component: APing}, {label: 'Info',component: AInfo}
    ],

    [{label: 'Data items'}, {label: 'Writing',component: AWriteItem}, 
     {label: 'Reading',component: AReadItem},
     {label: 'Sharing',component: AShareItem}, 
     {label: 'Sharing reading',component: ASharedReadItem}, 
     {label: 'Sharing updating',component: ASharedUpdateItem}, 
     {label: 'Removing',component: ARemoveItem}, 
     {label: 'Aliases',component: AAlias}, 
     {label: 'Alias access',component: AReadAliasItem}, 
     {label: 'Quotas',component: AQuotas}
    ]
  ],
  [{label: 'More'}, {label: 'Demo Videos',component: ADemo}]
  
].map(d => mapNested(d));



function mapNested(item, route) {
  key++;
  route = route || "";
  // if it's an array then these are nested items
  if (!Array.isArray(item)) {
    // the path is built up by adding the path so far to the generated path for this item
    let iPath = item.label.replace(/\s/g, "_").toLowerCase();
    let path = route + (route ? "/" : "") + iPath;

    // generate the route
    routes.push(
      <Route 
            key={key} 
            path={path} 
            name={path.replace(/\//g,"_")} 
            component={item.component}>
          </Route>
    );
    // make a cross reference
    Process.xRef[path] = key;

    return (

      <ListItem 
            primaryText = {item.label}
            key={key}
            value={key}
            containerElement={<IndexLink to={path} />
    }
    primaryTogglesNestedList = {
      true
    }
    />

  );
}
else {
  // we're going deeper to extend the route so far
  route += "/" + item[0].label.replace(/\s/g, "_").toLowerCase();

  // recurse and get all the children
  let ics = item.slice(1).map((d) => mapNested(d, route));

  // this list item will contain the children as nested items 
  return (
    <ListItem 
            primaryText = {item[0].label} 
            nestedItems = {ics}
            key={key}
            value={key}
            primaryTogglesNestedList={true}
            
          />
  );
}
}


Process.init()
  .then(() => {

    ReactDOM.render((
      <Provider store={Process.store}>
        <Router history={hashHistory}>
          <Route path="/" component={App}>
            <IndexRoute component={Home}></IndexRoute>
            {routes}
          </Route>
        </Router>
      </Provider>
    ), document.getElementById('app'));
  });
