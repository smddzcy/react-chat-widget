import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";

import Header from "./components/Header";
import Messages from "./components/Messages";
import Sender from "./components/Sender";
import "./style.scss";

class Conversation extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.setVh = this.setVh.bind(this);
  }

  componentDidMount() {
    this.setVh();
    window.addEventListener('resize', this.setVh);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setVh);
  }
  

  setVh() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    if (this.context.document) {
      this.context.document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
  }

  render() {
    return (
      <div className={`rcw-conversation-container ${window.innerWidth < 768 ? 'rcw-mobile' : ''}`}>
        <Header
          title={this.props.title}
          subtitle={this.props.subtitle}
          toggleChat={this.props.toggleChat}
          showCloseButton={this.props.showCloseButton}
          titleAvatar={this.props.titleAvatar}
        />
        {this.props.staticText ? (
          <div className="rcw-messages-container" style={{ display: 'flex' }}>
            <div className="rcw-message" style={{ textAlign: 'center', alignSelf: 'center', padding: '0 20px' }}>
              {this.props.staticText}
            </div>
          </div>
        ) : (
          <Fragment>
            <Messages />
            <Sender
              sendMessage={this.props.sendMessage}
              placeholder={this.props.senderPlaceHolder}
              disabledInput={this.props.disabledInput}
            />
          </Fragment>
        )}
      </div>
    );
  }
}

Conversation.propTypes = {
  title: PropTypes.string,
  titleAvatar: PropTypes.string,
  subtitle: PropTypes.string,
  sendMessage: PropTypes.func,
  senderPlaceHolder: PropTypes.string,
  toggleChat: PropTypes.func,
  showCloseButton: PropTypes.bool,
  disabledInput: PropTypes.bool,
  staticText: PropTypes.string
};

export default Conversation;
