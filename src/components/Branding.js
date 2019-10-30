import React, { useCallback } from 'react';
import logo from '../../assets/logo.png';


const Branding = ({ poweredByLabel }) => (
  <a
    href="https://infoset.app/"
    title="cloud call center, sales management, customer support software"
    target="_blank"
    className="icw-branding"
  >
    <img src={logo} alt="infoset" />
    <span>{poweredByLabel}</span>
  </a>
);

export default Branding;
