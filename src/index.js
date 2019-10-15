import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import Widget from './components/Widget';
import store from './store/store';

// NOTE: In case of a wrong "React hook" error, just run:
// npm link ../chat-widget/node_modules/react
// see: https://github.com/facebook/react/issues/15315#issuecomment-479802153

const ConnectedWidget = props => {
  useEffect(() => {
    const EVENTS_TO_MODIFY = ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'wheel'];
    const originalAddEventListener = document.addEventListener.bind();
    document.addEventListener = (type, listener, options, wantsUntrusted) => {
      let modOptions = options;
      if (EVENTS_TO_MODIFY.includes(type)) {
        if (typeof options === 'boolean') {
          modOptions = {
            capture: options,
            passive: false,
          };
        } else if (typeof options === 'object') {
          modOptions = {
            passive: false,
            ...options,
          };
        }
      }

      return originalAddEventListener(type, listener, modOptions, wantsUntrusted);
    };

    const originalRemoveEventListener = document.removeEventListener.bind();
    document.removeEventListener = (type, listener, options) => {
      let modOptions = options;
      if (EVENTS_TO_MODIFY.includes(type)) {
        if (typeof options === 'boolean') {
          modOptions = {
            capture: options,
            passive: false,
          };
        } else if (typeof options === 'object') {
          modOptions = {
            passive: false,
            ...options,
          };
        }
      }
      return originalRemoveEventListener(type, listener, modOptions);
    };
    return () => {
      document.addEventListener = originalAddEventListener;
      document.removeEventListener = originalRemoveEventListener;
    };
  }, []);

  return (
    <Provider store={store}>
      <Widget {...props} />
    </Provider>
  );
};

ConnectedWidget.propTypes = {
  title: PropTypes.string,
  titleAvatar: PropTypes.string,
  subtitle: PropTypes.string,
  handleNewUserMessage: PropTypes.func.isRequired,
  senderPlaceholder: PropTypes.string,
  disabledPlaceholder: PropTypes.string,
  showCloseButton: PropTypes.bool,
  badge: PropTypes.number,
  launcher: PropTypes.func,
  onToggleChat: PropTypes.func,
  css: PropTypes.string,
};

ConnectedWidget.defaultProps = {
  title: '',
  subtitle: '',
  showCloseButton: true,
  badge: 0,
};

export default ConnectedWidget;
