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
import PreviousConversations from '../PreviousConversations';
import GlobalContext from '../GlobalContext';

class WidgetLayout extends PureComponent {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      triggerWidth: 300,
      triggerHeight: 400,
      triggerOpacity: 0,
      triggerDisplay: 'none',
      convFrameDisplay: props.showChat ? 'block' : 'none',
      showChat: false,
      prevPageDepth: 0,
    };
    if (props.showTrigger) {
      this.state.triggerDisplay = 'block';
      this.startWatchingTriggerSize();
    }
    if (props.showChat) {
      // display after some time for animation
      this.convFrameDisplayTimeout = setTimeout(() => {
        this.setState({ showChat: true });
      }, 50);
    }
  }

  componentDidMount() {
    this.convFrame = document.querySelector('#infoset-conv-frame-ctr');
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
      this.startWatchingTriggerSize();
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const openingChat = nextProps.showChat && !this.props.showChat;
    const closingChat = !nextProps.showChat && this.props.showChat;

    if (this.props.showPage !== nextProps.showPage) {
      this.setState({ prevPageDepth: this.getPageDepth(this.props.showPage) });
    }

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

  startWatchingTriggerSize = () => {
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

  getPageDepth = page => {
    let pageDepth = 0;
    if (['previous_conversations', 'conversation'].includes(page)) {
      pageDepth = 1;
    } else if (page === 'previous_conversation') {
      pageDepth = 2;
    }
    return pageDepth;
  }

  goHome = () => this.props.switchToPage('home');

  goToPreviousConversation = () => this.props.switchToPage('previous_conversations');

  render() {
    const initialFrameContent = `<!DOCTYPE html><html><head><style>html,body,.frame-content{height: 100%;overscroll-behavior-y:none;overflow:hidden;background:#fff;}body{margin:0;padding: 0;font-family:-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;}${this.props.css}</style></head><body class="icw-body"><div style="height: 100%"></div></body></html>`;
    const initialLauncherFrameContent = `<!DOCTYPE html><html><head><style>html,body,.frame-content{height: 100%;}body{margin:0;padding: 0;font-family:-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;}${this.props.css}</style></head><body class="icw-body"><div style="height: 100%"></div></body></html>`;
    const initialTriggerFrameContent = `<!DOCTYPE html><html class="triggerHtml"><head><style>body{margin:0;padding: 0;font-family:-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;}${this.props.css}</style></head><body class="icw-body"><div></div></body></html>`;
    const pageDepth = this.getPageDepth(this.props.showPage);
    const animationName = pageDepth > this.state.prevPageDepth ? 'slideLeft' : 'slideRight';

    return (
      <div className={cx({ 'icw-opened': this.state.showChat })}>
        <div
          id="infoset-conv-frame-ctr"
          style={{ opacity: 0, display: this.state.convFrameDisplay }}
        >
          <Frame
            initialContent={initialFrameContent}
            title="Infoset Chat Widget"
            id="infoset-conv-frame"
            aria-live="polite"
          >
            <div
              style={{ height: '100%' }}
              className={cx('scroll-container', animationName, {
                'icw-mobile': window.innerWidth < 768
              })}
            >
              <UrlModal showUrl={this.props.showUrl} closeUrl={this.props.closeUrl} />
              <SwitchTransition mode="out-in">
                <CSSTransition
                  key={this.props.showPage}
                  timeout={300}
                  classNames="pageTransition"
                >
                  {this.props.showPage === 'conversation' ? (
                    <Conversation
                      title={this.props.title}
                      subtitle={this.props.subtitle}
                      staticText={this.props.staticText}
                      sendMessage={this.props.onSendMessage}
                      disabledPlaceholder={this.props.disabledPlaceholder}
                      toggleChat={this.props.toggleChat}
                      showCloseButton={this.props.showCloseButton}
                      disabledInput={this.props.disabledInput}
                      showBackButton={this.props.homepage.enabled}
                      onQuickButtonClicked={this.props.onQuickButtonClicked}
                      hasQuickButtons={this.props.hasQuickButtons}
                      goBack={this.goHome}
                    />
                  ) : this.props.showPage === 'home' ? (
                    <Homepage
                      settings={this.props.homepage}
                      toggleChat={this.props.toggleChat}
                      document={document}
                    />
                  ) : this.props.showPage === 'previous_conversations' ? (
                    <PreviousConversations
                      conversations={this.props.prevConversations}
                      openConversation={this.props.openConversation}
                      goBack={this.goHome}
                    />
                  ) : this.props.showPage === 'previous_conversation' ? (
                    <GlobalContext.Consumer>
                      {({ translation }) => (
                        <Conversation
                          title={translation.archivedConversation}
                          hideSender
                          toggleChat={this.props.toggleChat}
                          showCloseButton={this.props.showCloseButton}
                          disabledInput
                          showBackButton
                          goBack={this.goToPreviousConversation}
                          chatId={this.props.showPreviousChatId}
                        />
                      )}
                    </GlobalContext.Consumer>
                  ) : null }
                </CSSTransition>
              </SwitchTransition>
            </div>
          </Frame>
        </div>
        <Frame initialContent={initialLauncherFrameContent} id="infoset-btn-frame" title="Infoset Chat Widget Button" aria-live="polite">
          {this.props.customLauncher
            ? this.props.customLauncher(this.props.toggleChat, this.props.badge)
            : <Launcher toggle={this.props.toggleChat} badge={this.props.badge} />}
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
  showPreviousChatId: PropTypes.string,
  onSendMessage: PropTypes.func,
  toggleChat: PropTypes.func,
  showChat: PropTypes.bool,
  disabledPlaceholder: PropTypes.string,
  showCloseButton: PropTypes.bool,
  disabledInput: PropTypes.bool,
  badge: PropTypes.number,
  customLauncher: PropTypes.func,
  onQuickButtonClicked: PropTypes.func,
  switchToPage: PropTypes.func,
  css: PropTypes.string,
  staticText: PropTypes.string,
  triggerContent: PropTypes.string,
  showTrigger: PropTypes.bool,
  homepage: PropTypes.object,
  showPage: PropTypes.string,
  showUrl: PropTypes.string,
  closeUrl: PropTypes.func,
  openConversation: PropTypes.func,
  prevConversations: PropTypes.array,
};

export default connect(store => ({
  showChat: store.behavior.showChat,
  disabledInput: store.behavior.disabledInput,
  hasQuickButtons: !!store.quickButtons.length,
}))(WidgetLayout);
