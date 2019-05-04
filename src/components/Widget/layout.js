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
  constructor(props) {
    super(props);
    this.state = {
      triggerWidth: null,
      triggerHeight: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.showTrigger && !this.props.showTrigger) {
      this.setState({ triggerWidth: null, triggerHeight: null });
      clearInterval(this.triggerSizeWatcher);
    } else if (!prevProps.showTrigger && this.props.showTrigger) {
      // start watching for trigger size changes
      this.triggerSizeWatcher = setInterval(() => {
        if (!this.trigger) return;
        let { scrollWidth, scrollHeight } = this.trigger;
        scrollWidth = Math.min(Math.max(scrollWidth || 0, 100), 300);
        scrollHeight = Math.min(Math.max(scrollHeight || 0, 60), 400);
        if (this.state.triggerWidth !== scrollWidth || this.state.triggerHeight !== scrollHeight) {
          this.setState({ triggerWidth: null, triggerHeight: null }, () => {
            this.setState({ triggerWidth: scrollWidth, triggerHeight: scrollHeight });
          });
        }
      }, 100);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (window.innerWidth < 768) {
      if (!nextProps.showChat) {
        enableBodyScroll(this.convFrame);
      } else {
        disableBodyScroll(this.convFrame);
      }
    }
  }

  componentWillUnmount() {
    clearAllBodyScrollLocks();
    clearInterval(this.triggerSizeWatcher);
  }

  render() {
    const initialFrameContent = `<!DOCTYPE html><html><head><style>body{margin:0;padding: 0;font-family:-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;}${this.props.css}</style></head><body><div></div></body></html>`;
    return (
      <div className={cx('icw-widget-container', { 'icw-opened': this.props.showChat })}>
        <Frame initialContent={initialFrameContent} id="infoset-conv-frame" ref={n => this.convFrame = n}>
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
            disabledInput={this.props.disabledInput}
            titleAvatar={this.props.titleAvatar}
          />
        </Frame>
        <Frame initialContent={initialFrameContent} id="infoset-btn-frame">
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
          initialContent={initialFrameContent}
          id="infoset-trigger-frame"
          className={this.props.showTrigger ? 'open' : ''}
          style={{ width: this.state.triggerWidth || 'auto', height: this.state.triggerHeight || 'auto' }}
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
};

export default connect(store => ({
  showChat: store.behavior.showChat,
  disabledInput: store.behavior.disabledInput,
}))(WidgetLayout);
