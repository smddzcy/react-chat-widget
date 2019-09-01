import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

import Header from './components/Header';
import Messages from './components/Messages';
import Sender from './components/Sender';
import './style.scss';
import inLogo from './in-logo.png';

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
      <div className={`icw-conversation-container ${window.innerWidth < 768 ? 'icw-mobile' : ''}`}>
        <Header
          title={this.props.title}
          subtitle={this.props.subtitle}
          toggleChat={this.props.toggleChat}
          showCloseButton={this.props.showCloseButton}
          titleAvatar={this.props.titleAvatar}
        />
        {this.props.staticText ? (
          <div className="icw-messages-container" style={{ display: 'flex' }}>
            <div className="icw-message" style={{ textAlign: 'center', alignSelf: 'center', padding: '0 20px' }}>
              {this.props.staticText}
            </div>
          </div>
        ) : (
          <Fragment>
            <Messages />
            <Sender
              sendMessage={this.props.sendMessage}
              placeholder={this.props.disabledInput ? this.props.disabledPlaceholder : this.props.senderPlaceholder}
              disabledInput={this.props.disabledInput}
              showEmojiButton={this.props.showEmojiButton}
              showAttachmentButton={this.props.showAttachmentButton}
            />
          </Fragment>
        )}
        <div className="icw-branding" onClick={() => this.infosetLink && this.infosetLink.click()}>
          <img src={inLogo} alt="infoset" />
          Powered by
          <a href="https://infoset.app/" target="_blank" ref={ref => this.infosetLink = ref}>Infoset</a>
        </div>
      </div>
    );
  }
}

Conversation.propTypes = {
  title: PropTypes.string,
  titleAvatar: PropTypes.string,
  subtitle: PropTypes.string,
  sendMessage: PropTypes.func,
  senderPlaceholder: PropTypes.string,
  disabledPlaceholder: PropTypes.string,
  toggleChat: PropTypes.func,
  showCloseButton: PropTypes.bool,
  disabledInput: PropTypes.bool,
  staticText: PropTypes.string,
  showEmojiButton: PropTypes.bool,
  showAttachmentButton: PropTypes.bool,
};

export default Conversation;
