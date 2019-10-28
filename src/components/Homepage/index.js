import React, { PureComponent } from 'react';
import { ReactComponent as Send } from '../../../assets/send.svg';
import './styles.scss';

class Homepage extends PureComponent {
  render() {
    return (
      <div className="icw-widget-inner-container icw-home">
        <header>
          <div className="icw-h-logo">
            <img src="https://downloads.intercomcdn.com/i/o/45718/28ebc88ba3a055eaeb5eb3c0/b5ba5b9c5a083b008fa152e91594b90b.png" alt="" />
          </div>
          <h1 className="icw-h-title">Merhaba! 👋🏻</h1>
          <h2 className="icw-h-subtitle">Apsiyon'a hoş geldiniz. Size yardımcı olmak için buradayız, buradan bize yazabilirsiniz 😎</h2>
        </header>
        <main>
          <section className="icw-card">
            <h2>Bir sohbet başlat</h2>
            <p>Ekip genellikle birkaç dakika içinde yanıt verir.</p>
            <button type="submit" className="icw-mt-10 has-icon">
              Yeni Sohbet
              <Send className="icon" />
            </button>
          </section>
        </main>
      </div>
    );
  }
}

export default Homepage;
