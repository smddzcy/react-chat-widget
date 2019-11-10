import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ReactComponent as LauncherIcon } from './launcherButton.svg';
import { ReactComponent as Times } from '../../../assets/times.svg';
import Badge from './Badge';
import './style.scss';

const Launcher = ({ toggle, chatOpened, badge }) => (
  <button type="button" className={chatOpened ? 'icw-launcher icw-hide-sm' : 'icw-launcher'} onClick={toggle}>
    <Badge badge={badge} />
    {chatOpened
      ? <Times className="icw-close-launcher" />
      : <LauncherIcon className="icw-open-launcher" />}
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
