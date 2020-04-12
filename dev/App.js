import React, { Component } from 'react';
import { Widget, addResponseMessage, setQuickButtons, setTyping } from '../index';

export default class App extends PureComponent {
  componentDidMount() {
    addResponseMessage('Welcome to this awesome chat!');
  }

  handleNewUserMessage = (newMessage) => {    
    setTyping(true);
    setTimeout(() => {
      setTyping(false);      
      if (newMessage === 'fruits') {
        setQuickButtons([ { label: 'Apple', value: 'apple' }, { label: 'Orange', value: 'orange' }, { label: 'Pear', value: 'pear' }, { label: 'Banana', value: 'banana' } ]);
      } else {
        addResponseMessage(newMessage);
      }
    }, 2000);
  }

  render() {
    return (
      <Widget
        title="Bienvenido"
        subtitle="Asistente virtual"
        senderPlaceholder="Escribe aquí ..."
        disabledPlaceholder="Disabled bro ..."
        handleNewUserMessage={this.handleNewUserMessage}
        badge={1}
      />
    );
  }
}
