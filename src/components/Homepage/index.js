import React, {
  useRef, useState, useEffect, useCallback, useContext
} from 'react';
import cx from 'classnames';
import { FrameContext } from 'react-frame-component';
import Branding from '../Branding';
import { ReactComponent as Times } from '../../../assets/times.svg';

import './style.scss';
import GlobalContext from '../GlobalContext';

let lastHeaderHeight = 200;
const Homepage = props => {
  const { settings, toggleChat } = props;
  const { document } = useContext(FrameContext);
  const headerRef = useRef(null);
  const parallaxCtrRef = useRef(null);
  const { translation, language } = useContext(GlobalContext);
  const [headerHeight, setHeaderHeight] = useState(lastHeaderHeight);
  const [parallaxHidden, setParallaxHidden] = useState(false);
  const mainPaddingTop = headerHeight - 65;

  useEffect(() => {
    const scrollCtr = document.querySelector('.scroll-container');
    const onScroll = () => {
      const { scrollTop } = scrollCtr;
      const opacity = Math.max(0, Math.min(1, (mainPaddingTop - 25 - scrollTop) / (mainPaddingTop - 25)));
      parallaxCtrRef.current.style.transform = `translate3d(0, -${scrollTop / 4}px, 0)`;
      parallaxCtrRef.current.style.opacity = opacity;
      if (opacity === 0 && !parallaxHidden) {
        setParallaxHidden(true);
      }
      if (opacity !== 0 && parallaxHidden) {
        setParallaxHidden(false);
      }
    };
    scrollCtr.addEventListener('scroll', onScroll, { capture: true, passive: true });
    return () => scrollCtr.removeEventListener('scroll', onScroll, { capture: true, passive: true });
  }, [parallaxHidden]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const el = headerRef.current;
      if (!el) return;
      const prevHeight = el.style.height;
      el.style.overflow = 'hidden';
      el.style.height = 'auto';
      const contentHeight = el.scrollHeight;
      el.style.overflow = '';
      el.style.height = prevHeight;
      if (contentHeight !== 0 && contentHeight !== headerHeight) {
        lastHeaderHeight = contentHeight;
        setHeaderHeight(contentHeight);
      }
    }, 100);
    return () => clearTimeout(timeout);
  });

  return (
    <div className="icw-widget-inner-container icw-home">
      <header ref={headerRef} style={{ height: headerHeight }}>
        <div className="parallax-ctr" ref={parallaxCtrRef}>
          {settings.logo && (
          <div className="icw-h-logo">
            <img src={settings.logo} alt="" />
          </div>
          )}
          <h1 className="icw-h-title">{settings.title}</h1>
          <h2 className="icw-h-subtitle">{settings.subtitle}</h2>
        </div>
      </header>
      <button
        type="button"
        className={cx('icw-header-button icw-close-button', { 'hovered hover-darker': parallaxHidden })}
        onClick={toggleChat}
      >
        <Times />
      </button>
      <main style={{ paddingTop: mainPaddingTop }}>
        {settings.widgets.map(({ component: Component, getProps }, idx) => (
          <section className="icw-card" key={idx}>
            <Component {...getProps()} />
          </section>
        ))}
      </main>
      <div className="icw-branding-ctr">
        <Branding language={language} poweredByLabel={translation.poweredByInfoset} />
      </div>
    </div>
  );
};

export default Homepage;
