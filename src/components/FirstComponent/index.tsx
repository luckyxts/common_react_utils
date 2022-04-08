import React from 'react';
import classNames from 'classnames';
import getCssPrefix from '../../utils';

function FirstComponent() {
  const cssPrefix = getCssPrefix('first-component');
  const wrapperClass = classNames(
    `${cssPrefix}-red`,
    `${cssPrefix}-font-size`,

  );
  return (
    <div className={wrapperClass}>
      这是第一个组件啊
    </div>
  );
}

export default FirstComponent;
