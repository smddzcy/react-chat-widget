import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { ReactComponent as CaretLeft } from '../../../../assets/caretLeft.svg';
import { ReactComponent as Times } from '../../../../assets/times.svg';

import './style.scss';

const Header = ({
  title, subtitle, toggleChat, goBack, showBackButton, showCloseButton, titleAvatar,
}) => (
  <div className={cx('icw-header', { 'icw-header-has-back': showBackButton })}>
    {showBackButton && (
      <button type="button" className="icw-header-button icw-back-button" onClick={goBack}>
        <CaretLeft alt="go back" />
      </button>
    )}
    <div className="icw-title-container">
      <h4 className="icw-title">
        {titleAvatar && <img src={titleAvatar} className="avatar" alt="profile" />}
        {title}
      </h4>
      <span>{subtitle}</span>
    </div>
    {showCloseButton && (
    <button type="button" className="icw-header-button icw-close-button" onClick={toggleChat}>
      <Times alt="close" />
    </button>
    )}
  </div>
);

Header.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  toggleChat: PropTypes.func,
  showCloseButton: PropTypes.bool,
  titleAvatar: PropTypes.string,
};
export default Header;
