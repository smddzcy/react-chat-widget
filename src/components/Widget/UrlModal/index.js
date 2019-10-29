import React, {
  useEffect, useState, useCallback, useRef
} from 'react';
import { CSSTransition } from 'react-transition-group';
import cx from 'classnames';

import { ReactComponent as Times } from '../../../../assets/times.svg';

import './style.scss';

let progressInterval;
const UrlModal = ({ showUrl, closeUrl, translation }) => {
  const [title, setTitle] = useState('');
  const oldIframeLoaded = useRef(0);
  const [iframeLoaded, setIframeLoaded] = useState(0);

  useEffect(() => {
    const xhr = new window.XMLHttpRequest();
    if (showUrl) {
      // start progress interval
      oldIframeLoaded.current = 0;
      setIframeLoaded(0);
      progressInterval = setInterval(() => {
        const newIframeLoaded = Math.min(95, oldIframeLoaded.current + (Math.random() * 10));
        oldIframeLoaded.current = newIframeLoaded;
        setIframeLoaded(newIframeLoaded);
      }, 300);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.responseText.includes('<meta name="x-infoset-desk" content="1"')) {
            setTitle(translation.helpCenter);
          } else {
            const pageTitle = xhr.responseText.match(/<title>(.*?)<\/title>/i)?.[1] || translation.externalUrl;
            setTitle(pageTitle);
          }
        }
      };
      xhr.onerror = () => {
        clearInterval(progressInterval);
        setIframeLoaded(0);
      };
      xhr.open('GET', showUrl);
      xhr.send();
    }
    return () => {
      xhr.abort();
      clearInterval(progressInterval);
      setIframeLoaded(0);
    };
  }, [showUrl]);

  const onIframeLoad = useCallback(() => {
    clearInterval(progressInterval);
    setIframeLoaded(100);
  }, []);

  return (
    <CSSTransition in={!!showUrl} mountOnEnter unmountOnExit timeout={400} classNames="slide-up">
      <div className="icw-url-modal">
        <header>
          <h1>{title}</h1>
          <button type="button" className="icw-header-button icw-close-button" onClick={closeUrl}>
            <Times />
          </button>
        </header>
        <main>
          <div className={cx('progress-bar', { hide: iframeLoaded === 100 })} style={{ width: `${iframeLoaded}%` }} />
          {showUrl && (
          <iframe
            title={title}
            className={cx('icw-url-modal-frame', { loaded: iframeLoaded === 100 })}
            aria-live="polite"
            src={showUrl}
            onLoad={onIframeLoad}
          />
          )}
        </main>
      </div>
    </CSSTransition>
  );
};

export default UrlModal;
