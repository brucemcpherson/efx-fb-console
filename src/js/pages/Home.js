import React from "react";
import AppIntro from '../components/layout/AppIntro';
import MenuWrapper from '../components/layout/MenuWrapper';

export default class Home extends React.Component {
  render() {
   return ( 
      <MenuWrapper fixed={true}>
         <AppIntro />
      </MenuWrapper>
   );
  }
}
   