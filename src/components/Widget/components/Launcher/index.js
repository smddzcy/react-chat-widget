import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import openLauncher from '@assets/launcher_button.svg';
import close from '@assets/clear-button.svg';
import Badge from './components/Badge';
import './style.scss';

const Launcher = ({ toggle, chatOpened, badge }) => (
  <button type="button" className={chatOpened ? 'icw-launcher icw-hide-sm' : 'icw-launcher'} onClick={toggle}>
    <Badge badge={badge} />
    {chatOpened
      ? <img src={close} className="icw-close-launcher" alt="" />
      : <img src={openLauncher} className="icw-open-launcher" alt="" />
    }
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
