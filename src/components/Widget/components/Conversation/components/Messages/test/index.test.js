import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { createNewMessage, createComponentMessage } from '@utils/messages';

import Messages from '../index';
import Message from '../components/Message';

configure({ adapter: new Adapter() });

describe('<Messages />', () => {
  const message = createNewMessage('Response message 1');
  /* eslint-disable react/prop-types */
  const Dummy = ({ text }) => <div>{text}</div>;
  /* eslint-enable */
  const customComp = createComponentMessage(Dummy, { text: 'This is a Dummy Component!' });

  const responseMessages = [message, customComp];

  const messagesComponent = shallow(
    <Messages.WrappedComponent
      messages={responseMessages}
    />
  );

  it('should render a Message component', () => {
    expect(messagesComponent.find(Message)).toHaveLength(1);
  });

  it('should reder a custom component', () => {
    expect(messagesComponent.find(Dummy)).toHaveLength(1);
  });
});
