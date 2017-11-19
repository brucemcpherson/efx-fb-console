import React from "react";
import AboutArticles from "../components/layout/AboutArticles";
import MenuWrapper from '../components/layout/MenuWrapper';

export default class extends React.Component {
  render() {
   
    return (
        <MenuWrapper>
            <AboutArticles />
        </MenuWrapper>        
    );
  }
}
