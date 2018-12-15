import React, { PureComponent } from 'react';
import { Widget, addResponseMessage } from '../index';

export default class App extends PureComponent {
  componentDidMount() {
    addResponseMessage('Welcome to this awesome chat!');
  }

  handleNewUserMessage = (newMessage) => {
    addResponseMessage(newMessage);
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
