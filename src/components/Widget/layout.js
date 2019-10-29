import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Frame from 'react-frame-component';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { disablePageScroll, enablePageScroll, clearQueueScrollLocks } from 'scroll-lock';

import Conversation from '../Conversation';
import Launcher from '../Launcher';
import Trigger from '../Trigger';
import Homepage from '../Homepage';
import UrlModal from './UrlModal';

import './style.scss';

class WidgetLayout extends PureComponent {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      triggerWidth: 300,
      triggerHeight: 400,
      triggerOpacity: 0,
      triggerDisplay: 'none',
      convFrameDisplay: 'none',
      showChat: false,
    };
  }

  componentDidMount() {
    this.convFrame = document.querySelector('#infoset-conv-frame');
  }

  componentDidUpdate(prevProps) {
    if (prevProps.showTrigger && !this.props.showTrigger) {
      clearInterval(this.triggerSizeWatcher);
      this.setState({ triggerOpacity: 0 }, () => {
        // clear the state after the transition
        setTimeout(() => {
          this.setState({ triggerDisplay: 'none', triggerWidth: 300, triggerHeight: 400 });
        }, 300);
      });
    } else if (!prevProps.showTrigger && this.props.showTrigger) {
      // start watching for trigger size changes
      this.triggerSizeWatcher = setInterval(() => {
        if (!this.trigger) return;
        let { scrollWidth, scrollHeight } = this.trigger;
        scrollWidth = Math.min(Math.max(Math.floor(scrollWidth) + 10, 100), 300);
        scrollHeight = Math.min(Math.max(Math.floor(scrollHeight) + 10, 60), 400);
        if (Math.abs(this.state.triggerWidth - scrollWidth) > 3 || Math.abs(this.state.triggerHeight - scrollHeight) > 3) {
          this.setState({ triggerWidth: null, triggerHeight: null }, () => {
            this.setState({
              triggerWidth: scrollWidth, triggerHeight: scrollHeight, triggerDisplay: 'block', triggerOpacity: 1,
            });
          });
        }
      }, 50);
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const openingChat = nextProps.showChat && !this.props.showChat;
    const closingChat = !nextProps.showChat && this.props.showChat;

    if (openingChat) {
      clearTimeout(this.convFrameDisplayTimeout);
      this.setState({ convFrameDisplay: 'block' });
      this.convFrameDisplayTimeout = setTimeout(() => {
        this.setState({ showChat: true });
      }, 50);
    } else if (closingChat) {
      clearTimeout(this.convFrameDisplayTimeout);
      this.setState({ showChat: false });
      this.convFrameDisplayTimeout = setTimeout(() => {
        this.setState({ convFrameDisplay: 'none' });
      }, 300);
    }

    if (window.innerWidth < 768) {
      if (openingChat) {
        disablePageScroll();
      } else if (closingChat) {
        enablePageScroll();
      }
    }
  }

  componentWillUnmount() {
    clearQueueScrollLocks();
    clearTimeout(this.convFrameDisplayTimeout);
    clearInterval(this.triggerSizeWatcher);
  }

  render() {
    const initialFrameContent = `<!DOCTYPE html><html><head><style>html,body,.frame-content{height: 100%;}body{margin:0;padding: 0;font-family:-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;}${this.props.css}</style></head><body class="icw-body"><div style="height: 100%"></div></body></html>`;
    const initialTriggerFrameContent = `<!DOCTYPE html><html class="triggerHtml"><head><style>body{margin:0;padding: 0;font-family:-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;}${this.props.css}</style></head><body class="icw-body"><div></div></body></html>`;
    return (
      <div className={cx('icw-widget-container', { 'icw-opened': this.state.showChat })}>
        <Frame
          initialContent={initialFrameContent}
          id="infoset-conv-frame"
          style={{ opacity: 0, display: this.state.convFrameDisplay }}
          title="Infoset Chat Widget"
          aria-live="polite"
        >
          <UrlModal
            showUrl={this.props.showUrl}
            closeUrl={this.props.closeUrl}
            translation={this.props.translation}
          />
          <div
            style={{ height: '100%' }}
            className={cx({
              'icw-mobile': window.innerWidth < 768
            })}
          >
            <SwitchTransition mode="out-in">
              <CSSTransition
                key={this.props.showPage}
                // addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
                timeout={300}
                classNames="slide"
              >
                {this.props.showPage === 'conversation'
                  ? (
                    <Conversation
                      title={this.props.title}
                      subtitle={this.props.subtitle}
                      staticText={this.props.staticText}
                      sendMessage={this.props.onSendMessage}
                      senderPlaceholder={this.props.translation.widget.senderPlaceholder}
                      disabledPlaceholder={this.props.disabledPlaceholder}
                      toggleChat={this.props.onToggleConversation}
                      showChat={this.props.showChat}
                      showCloseButton={this.props.showCloseButton}
                      showEmojiButton={this.props.showEmojiButton}
                      showAttachmentButton={this.props.showAttachmentButton}
                      disabledInput={this.props.disabledInput}
                      showBackButton={this.props.homepage.enabled}
                      goBack={this.props.goHome}
                    />
                  ) : (
                    <Homepage
                      settings={this.props.homepage}
                      toggleChat={this.props.onToggleConversation}
                    />
                  )}
              </CSSTransition>
            </SwitchTransition>

          </div>
        </Frame>
        <Frame initialContent={initialFrameContent} id="infoset-btn-frame" title="Infoset Chat Widget Button" aria-live="polite">
          {this.props.customLauncher
            ? this.props.customLauncher(this.props.onToggleConversation)
            : <Launcher toggle={this.props.onToggleConversation} badge={this.props.badge} />}
        </Frame>
        <Frame
          initialContent={initialTriggerFrameContent}
          id="infoset-trigger-frame"
          className={this.props.showTrigger ? 'open' : ''}
          style={{
            width: this.state.triggerWidth || 0,
            height: this.state.triggerHeight || 0,
            opacity: this.state.triggerOpacity,
            display: this.state.triggerDisplay,
          }}
          aria-live="polite"
          aria-relevant="additions"
        >
          <Trigger content={this.props.triggerContent} innerRef={n => this.trigger = n} />
        </Frame>
        <div id="infoset-trigger-frame-tip" />
      </div>
    );
  }
}

WidgetLayout.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onSendMessage: PropTypes.func,
  onToggleConversation: PropTypes.func,
  showChat: PropTypes.bool,
  translation: PropTypes.object,
  disabledPlaceholder: PropTypes.string,
  showCloseButton: PropTypes.bool,
  disabledInput: PropTypes.bool,
  badge: PropTypes.number,
  customLauncher: PropTypes.func,
  goHome: PropTypes.func,
  css: PropTypes.string,
  staticText: PropTypes.string,
  triggerContent: PropTypes.string,
  showTrigger: PropTypes.bool,
  showEmojiButton: PropTypes.bool,
  showAttachmentButton: PropTypes.bool,
  homepage: PropTypes.object,
  showPage: PropTypes.string,
  showUrl: PropTypes.string,
  closeUrl: PropTypes.func,
};

export default connect(store => ({
  showChat: store.behavior.showChat,
  disabledInput: store.behavior.disabledInput,
}))(WidgetLayout);
