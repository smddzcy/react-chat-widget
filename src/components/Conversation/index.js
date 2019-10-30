import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import Messages from './Messages';
import Sender from './Sender';
import './style.scss';
import Branding from '../Branding';

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
        <Branding poweredByLabel={this.props.translation.poweredByInfoset} />
      </div>
    );
  }
}

Conversation.propTypes = {
  title: PropTypes.string,
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
  translation: PropTypes.object,
};

export default Conversation;
