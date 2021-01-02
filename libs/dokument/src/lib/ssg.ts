/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createContext, useContext } from 'react';
// react/jsx-runtime 和 react/jsx-dev-runtime 中的函数只能由编译器转换使用。
// 如果你需要在代码中手动创建元素，你可以继续使用 React.createElement。它将继续工作，不会消失。
export const SSGContext = createContext({});
export const useSSG = () => useContext(SSGContext);

export const withSSG = (Page: any) => {
  return (props: any) => {
    return React.createElement(
      SSGContext.Provider,
      { value: props.ssg },
      React.createElement(Page, props)
    );
  };
};
