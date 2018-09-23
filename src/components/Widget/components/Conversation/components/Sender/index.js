import React from 'react';
import PropTypes from 'prop-types';

import send from '@assets/send_button.svg';

import './style.scss';

const Sender = ({ sendMessage, placeholder, disabledInput, autofocus }) =>
  <form className="rcw-sender" onSubmit={sendMessage}>
    <input type="text" className="rcw-new-message" name="message" placeholder={placeholder} disabled={disabledInput} autoFocus={autofocus} autoComplete="off" />
    <button type="submit" className="rcw-send">
      <img src={send} className="rcw-send-icon" alt="send" />
    </button>
    <div className="rcw-branding">Powered by <a href="https://infoset.com.tr/" target="_blank">Infoset</a></div>
  </form>;

Sender.propTypes = {
  sendMessage: PropTypes.func,
  placeholder: PropTypes.string,
  disabledInput: PropTypes.bool,
  autofocus: PropTypes.bool
};

export default Sender;
