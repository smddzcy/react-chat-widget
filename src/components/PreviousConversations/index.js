import React, { useContext, useCallback } from 'react';
import './style.scss';
import Header from '../Conversation/Header';
import GlobalContext from '../GlobalContext';
import { ReactComponent as BotIcon } from '../Conversation/Messages/bot.svg';
import { getTimeString } from '../../utils/messages';

const ConversationRow = ({ conversation, openConversation, youLabel }) => {
  const lastMsg = conversation.messages[conversation.messages.length - 1];
  const onClick = useCallback(() => openConversation(conversation.chatId), [conversation.chatId]);

  return (
    <div className="row" onClick={onClick}>
      {/* TODO: placeholder in case of no agent photo */}
      {conversation.lastAgentMsg
        ? <div className="icw-avatar" style={{ backgroundImage: `url(${conversation.lastAgentMsg.agent.photo})` }} />
        : <BotIcon className="icw-avatar" />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="icw-name-time">
          <span>{conversation.lastAgentMsg?.agent.name || 'Bot'}</span>
          <span>{getTimeString(lastMsg.time)}</span>
        </div>
        <div className="icw-last-message">{!lastMsg.isFromAgent ? `${youLabel}:` : ''} {lastMsg.msg}</div>
      </div>
    </div>
  );
};

const PreviousConversations = ({ conversations, openConversation, goBack }) => {
  const { translation } = useContext(GlobalContext);

  return (
    <div className="icw-widget-inner-container icw-prev-convs">
      <Header
        title={translation.previousConversations}
        showBackButton
        showCloseButton
        onClickBack={goBack}
      />
      <div className="icw-convs-ctr" data-scroll-lock-scrollable>
        {conversations.map(conversation => (
          <ConversationRow
            conversation={conversation}
            openConversation={openConversation}
            youLabel={translation.you}
            key={conversation.chatId}
          />
        ))}
      </div>
    </div>
  );
};

export default PreviousConversations;
