import React, { Fragment } from "react";
import PropTypes from "prop-types";

import Header from "./components/Header";
import Messages from "./components/Messages";
import Sender from "./components/Sender";
import "./style.scss";

const Conversation = props => (
  <div className="rcw-conversation-container">
    <Header
      title={props.title}
      subtitle={props.subtitle}
      toggleChat={props.toggleChat}
      showCloseButton={props.showCloseButton}
      titleAvatar={props.titleAvatar}
    />
    {props.staticText ? (
      <div className="rcw-messages-container" style={{ display: 'flex' }}>
        <div className="rcw-message" style={{ textAlign: 'center', alignSelf: 'center', padding: '0 20px' }}>
          {props.staticText}
        </div>
      </div>
    ) : (
      <Fragment>
        <Messages />
        <Sender
          sendMessage={props.sendMessage}
          placeholder={props.senderPlaceHolder}
          disabledInput={props.disabledInput}
          autofocus={props.autofocus}
        />
      </Fragment>
    )}
  </div>
);

Conversation.propTypes = {
  title: PropTypes.string,
  titleAvatar: PropTypes.string,
  subtitle: PropTypes.string,
  sendMessage: PropTypes.func,
  senderPlaceHolder: PropTypes.string,
  toggleChat: PropTypes.func,
  showCloseButton: PropTypes.bool,
  disabledInput: PropTypes.bool,
  autofocus: PropTypes.bool,
  staticText: PropTypes.string
};

export default Conversation;
