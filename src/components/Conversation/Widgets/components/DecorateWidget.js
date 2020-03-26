import React, {
  useCallback, useMemo, useContext
} from 'react';
import { useSelector } from 'react-redux';
import GlobalContext from '../../../GlobalContext';
import { setCustomComponentState, setInputDisabled } from '../../../../store/dispatcher';

const DecorateWidget = Widget => ({ id, ...props }) => {
  const { language, sendMessage } = useContext(GlobalContext);
  const state = useSelector(state => state.messages.widgetState[id]);
  const persistState = useCallback(state => setCustomComponentState(id, state), [id]);
  return (
    <Widget
      {...props}
      key={id}
      state={state}
      persistState={persistState}
      setInputDisabled={setInputDisabled}
      language={language}
      sendMessage={sendMessage}
    />
  );
};

export default DecorateWidget;
