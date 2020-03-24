import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import Messages from './Messages';
import Sender from './Sender';
import './style.scss';
import Branding from '../Branding';
import GlobalContext from '../GlobalContext';

class Conversation extends PureComponent {
  componentDidMount() {
    this.setVh();
    window.addEventListener('resize', this.setVh);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setVh);
  }


  setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    if (this.context.document) {
      this.context.document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
  }

  render() {
    return (
      <GlobalContext.Consumer>
        {({ translation, language }) => (
          <div className="icw-widget-inner-container icw-conversation">
            <Header
              title={this.props.title}
              subtitle={this.props.subtitle}
              showCloseButton={this.props.showCloseButton}
              showBackButton={this.props.showBackButton}
              onClickClose={this.props.toggleChat}
              onClickBack={this.props.goBack}
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
                <Messages chatId={this.props.chatId} />
                {!this.props.hideSender && (
                <Sender
                  sendMessage={this.props.sendMessage}
                  disabledPlaceholder={this.props.disabledPlaceholder}
                  disabledInput={this.props.disabledInput}
                />
                )}
              </>
            )}
            <Branding language={language} poweredByLabel={translation.poweredByInfoset} />
          </div>
        )}
      </GlobalContext.Consumer>
    );
  }
}

Conversation.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  sendMessage: PropTypes.func,
  disabledPlaceholder: PropTypes.string,
  toggleChat: PropTypes.func,
  showCloseButton: PropTypes.bool,
  disabledInput: PropTypes.bool,
  staticText: PropTypes.string,
  showBackButton: PropTypes.bool,
  hideSender: PropTypes.bool,
  chatId: PropTypes.string,
  goBack: PropTypes.func,
};

export default Conversation;
