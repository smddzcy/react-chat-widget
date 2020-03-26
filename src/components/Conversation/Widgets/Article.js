import React, { useContext } from 'react';
import GlobalContext from '../../GlobalContext';

const Article = ({
  title, text, url, openUrl
}) => {
  const { SharedWidget } = useContext(GlobalContext);
  return (
    <SharedWidget.LinkWidget
      openUrl={openUrl}
      links={[{
        title, text, url, target: 'tab'
      }]}
    />
  );
};

export default Article;
