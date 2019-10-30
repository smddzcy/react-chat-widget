import React, {
  useRef, useState, useEffect, useCallback
} from 'react';
import Branding from '../Branding';
import { ReactComponent as Times } from '../../../assets/times.svg';

import './style.scss';

let lastHeaderHeight = 200;
const Homepage = props => {
  const {
    document, settings, toggleChat, translation
  } = props;
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(lastHeaderHeight);
  const [parallaxStyles, setParallaxStyles] = useState({});
  const mainPaddingTop = headerHeight - 65;

  useEffect(() => {
    const scrollCtr = document.querySelector('.scroll-container');
    const onScroll = e => {
      const { scrollTop } = e.target.documentElement;
      setParallaxStyles({
        transform: `translateY(-${scrollTop / 4}px)`,
        opacity: Math.max(0, Math.min(1, (mainPaddingTop - 20 - scrollTop) / (mainPaddingTop - 20))),
      });
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    return () => document.removeEventListener('scroll', onScroll, { passive: true });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const el = headerRef.current;
      if (!el) return;
      const prevHeight = el.style.height;
      el.style.overflow = 'hidden';
      el.style.height = 0;
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
        <div className="parallax-ctr" style={parallaxStyles}>
          {settings.logo && (
          <div className="icw-h-logo">
            <img src={settings.logo} alt="" />
          </div>
          )}
          <h1 className="icw-h-title">{settings.title}</h1>
          <h2 className="icw-h-subtitle">{settings.subtitle}</h2>
          <button type="button" className="icw-header-button icw-close-button" onClick={toggleChat}>
            <Times />
          </button>
        </div>
      </header>
      <main style={{ paddingTop: mainPaddingTop }}>
        {settings.widgets.map(({ component: Component, getProps }, idx) => (
          <section className="icw-card" key={idx}>
            <Component {...getProps()} />
          </section>
        ))}
      </main>
      <div className="icw-branding-ctr">
        <Branding poweredByLabel={translation.poweredByInfoset} />
      </div>
    </div>
  );
};

export default Homepage;
