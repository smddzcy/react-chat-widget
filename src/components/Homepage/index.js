import React, { PureComponent } from 'react';

import { ReactComponent as Times } from '../../../assets/times.svg';

import './style.scss';

class Homepage extends PureComponent {
  render() {
    const { settings, toggleChat } = this.props;
    return (
      <div className="icw-widget-inner-container icw-home">
        <header>
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
        </header>
        <main>
          {settings.widgets.map(({ component: Component, getProps }, idx) => (
            <section className="icw-card" key={idx}>
              <Component {...getProps()} />
            </section>
          ))}
        </main>
      </div>
    );
  }
}

export default Homepage;
