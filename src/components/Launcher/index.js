import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import openLauncher from './launcherButton.svg';
import times from '../../../assets/times.svg';
import Badge from './Badge';
import './style.scss';

const Launcher = ({ toggle, chatOpened, badge }) => (
  <button type="button" className={chatOpened ? 'icw-launcher icw-hide-sm' : 'icw-launcher'} onClick={toggle}>
    <Badge badge={badge} />
    {chatOpened
      ? <img src={times} className="icw-close-launcher" alt="" />
      : <img src={openLauncher} className="icw-open-launcher" alt="" />}
  </button>
);

Launcher.propTypes = {
  toggle: PropTypes.func,
  chatOpened: PropTypes.bool,
  badge: PropTypes.number,
};

export default connect(store => ({
  chatOpened: store.behavior.showChat,
}))(Launcher);
