import React, {
  useEffect, useState, useCallback, useContext, useRef
} from 'react';
import { CSSTransition } from 'react-transition-group';
import cx from 'classnames';

import { ReactComponent as Times } from '../../../../assets/times.svg';

import './style.scss';
import GlobalContext from '../../GlobalContext';

let progressInterval;
const UrlModal = ({ showUrl, closeUrl }) => {
  const { translation } = useContext(GlobalContext);
  const [url, setUrl] = useState(showUrl);
  const [title, setTitle] = useState('');
  const oldIframeLoaded = useRef(0);
  const [iframeLoaded, setIframeLoaded] = useState(0);

  const clearState = useCallback(() => {
    setUrl(null);
    setTitle('');
    setIframeLoaded(0);
  }, []);

  const onIframeLoad = useCallback(() => {
    clearInterval(progressInterval);
    setIframeLoaded(100);
  }, []);

  const onIframeError = useCallback(() => {
    clearInterval(progressInterval);
    setIframeLoaded(0);
  }, []);

  useEffect(() => {
    const xhr = new window.XMLHttpRequest();
    if (showUrl) {
      setUrl(showUrl);
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
      xhr.onerror = onIframeError;
      xhr.open('GET', showUrl);
      xhr.send();
    } else if (url) {
      // closing modal
      setTimeout(clearState, 400);
    }
    return () => {
      xhr.abort();
      clearInterval(progressInterval);
      setIframeLoaded(0);
    };
  }, [showUrl]);

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
          {url && (
          <iframe
            title={title}
            aria-live="polite"
            src={url}
            onLoad={onIframeLoad}
            onError={onIframeError}
          />
          )}
        </main>
      </div>
    </CSSTransition>
  );
};

export default UrlModal;
