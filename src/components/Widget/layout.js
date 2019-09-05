import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Frame from 'react-frame-component';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import Conversation from './components/Conversation';
import Launcher from './components/Launcher';
import Trigger from './components/Trigger';
import './style.scss';

class WidgetLayout extends PureComponent {
  messagesCtrRef = React.createRef();

  constructor(props) {
    super(props);
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

  componentWillReceiveProps(nextProps) {
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
        disableBodyScroll(this.messagesCtrRef.current);
      } else if (closingChat) {
        enableBodyScroll(this.messagesCtrRef.current);
      }
    }
  }

  componentWillUnmount() {
    clearAllBodyScrollLocks();
    clearTimeout(this.convFrameDisplayTimeout);
    clearInterval(this.triggerSizeWatcher);
  }

  render() {
    const initialFrameContent = `<!DOCTYPE html><html><head><style>body{margin:0;padding: 0;font-family:-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;}${this.props.css}</style></head><body><div></div></body></html>`;
    const initialTriggerFrameContent = `<!DOCTYPE html><html class="triggerHtml"><head><style>body{margin:0;padding: 0;font-family:-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;}${this.props.css}</style></head><body><div></div></body></html>`;
    return (
      <div className={cx('icw-widget-container', { 'icw-opened': this.state.showChat })}>
        <Frame
          initialContent={initialFrameContent}
          id="infoset-conv-frame"
          style={{ opacity: 0, display: this.state.convFrameDisplay }}
          aria-live="polite"
        >
          <style>{this.props.css}</style>
          <Conversation
            title={this.props.title}
            subtitle={this.props.subtitle}
            staticText={this.props.staticText}
            sendMessage={this.props.onSendMessage}
            senderPlaceholder={this.props.senderPlaceholder}
            disabledPlaceholder={this.props.disabledPlaceholder}
            toggleChat={this.props.onToggleConversation}
            showChat={this.props.showChat}
            showCloseButton={this.props.showCloseButton}
            showEmojiButton={this.props.showEmojiButton}
            showAttachmentButton={this.props.showAttachmentButton}
            disabledInput={this.props.disabledInput}
            titleAvatar={this.props.titleAvatar}
            messagesCtrRef={this.messagesCtrRef}
          />
        </Frame>
        <Frame initialContent={initialFrameContent} id="infoset-btn-frame" aria-live="polite">
          {this.props.customLauncher
            ? this.props.customLauncher(this.props.onToggleConversation)
            : (
              <Launcher
                toggle={this.props.onToggleConversation}
                badge={this.props.badge}
              />
            )}
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
  titleAvatar: PropTypes.string,
  subtitle: PropTypes.string,
  onSendMessage: PropTypes.func,
  onToggleConversation: PropTypes.func,
  showChat: PropTypes.bool,
  senderPlaceholder: PropTypes.string,
  disabledPlaceholder: PropTypes.string,
  showCloseButton: PropTypes.bool,
  disabledInput: PropTypes.bool,
  badge: PropTypes.number,
  customLauncher: PropTypes.func,
  css: PropTypes.string,
  staticText: PropTypes.string,
  triggerContent: PropTypes.string,
  showTrigger: PropTypes.bool,
  showEmojiButton: PropTypes.bool,
  showAttachmentButton: PropTypes.bool,
};

export default connect(store => ({
  showChat: store.behavior.showChat,
  disabledInput: store.behavior.disabledInput,
}))(WidgetLayout);
