import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import Messages from './Messages';
import Sender from './Sender';
import './style.scss';
import logo from './logo.png';

class Conversation extends PureComponent {
  constructor(props, ctx) {
    super(props, ctx);
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
      <div className="icw-widget-inner-container icw-conversation">
        <Header
          title={this.props.title}
          subtitle={this.props.subtitle}
          toggleChat={this.props.toggleChat}
          showCloseButton={this.props.showCloseButton}
          titleAvatar={this.props.titleAvatar}
          showBackButton={this.props.showBackButton}
          goBack={this.props.goBack}
        />
        {this.props.staticText ? (
          <div
            className="icw-messages-container"
            data-scroll-lock-scrollable
            style={{ display: 'flex' }}
          >
            <div className="icw-message" style={{ textAlign: 'center', alignSelf: 'center', padding: '0 20px' }}>
              {this.props.staticText}
            </div>
          </div>
        ) : (
          <>
            <Messages />
            <Sender
              sendMessage={this.props.sendMessage}
              placeholder={this.props.disabledInput ? this.props.disabledPlaceholder : this.props.senderPlaceholder}
              disabledInput={this.props.disabledInput}
              showEmojiButton={this.props.showEmojiButton}
              showAttachmentButton={this.props.showAttachmentButton}
            />
          </>
        )}
        <div className="icw-branding" onClick={() => this.infosetLink && this.infosetLink.click()}>
          <img src={logo} alt="infoset" />
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
  showBackButton: PropTypes.bool,
  goBack: PropTypes.func,
};

export default Conversation;
