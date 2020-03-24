import React, { useCallback } from 'react';
import logo from '../../assets/logo.png';

const Branding = ({ poweredByLabel, language }) => (
  <a
    href={`https://infoset.app/${language !== 'en' ? `${language}/` : ''}`}
    title={language === 'tr'
      ? 'bulut çağrı merkezi, çağrı merkezi yazılımı, satış yönetim yazılımı, müşteri destek yazılımı'
      : 'cloud call center, sales management, customer support software'}
    target="_blank"
    className="icw-branding"
  >
    <img src={logo} alt="infoset" />
    <span>{poweredByLabel}</span>
  </a>
);

export default Branding;
