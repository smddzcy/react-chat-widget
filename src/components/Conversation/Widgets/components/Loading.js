import React from 'react';
import PropTypes from 'prop-types';

function Loading({ size, fullScreen, className }) {
  const style = {
    borderWidth: `${size / 10}px`,
    width: `${size}px`,
    height: `${size}px`,
  };
  if (fullScreen) {
    return (
      <div className="center-absolute">
        <div className={`icw-loader ${className}`} style={style} />
      </div>
    );
  }
  return <div className={`icw-loader ${className}`} style={style} />;
}

Loading.propTypes = {
  size: PropTypes.number,
  fullScreen: PropTypes.bool,
  className: PropTypes.string,
};

Loading.defaultProps = {
  size: 14,
  fullScreen: false,
  className: '',
};

export default Loading;
