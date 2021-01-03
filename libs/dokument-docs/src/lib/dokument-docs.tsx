import React from 'react';

/* eslint-disable-next-line */
export function Layout(props: any) {
  return <div>{JSON.stringify(props.config)}</div>;
}

export default (opts: any, config: any) => (props: any) => {
  return <Layout config={config} {...opts} {...props} />;
};
