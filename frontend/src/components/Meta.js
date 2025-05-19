import React from "react";

import { Helmet } from "react-helmet";
const Meta = (props) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{props.title}</title>
      <link rel="canonical" href="http://mysite.com/example" />
    </Helmet>
  ); 
};

export default Meta;
