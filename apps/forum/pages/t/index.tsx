import { useRouter } from 'next/router';
import React from 'react';

export default () => {
  return <div>{JSON.stringify(useRouter())}</div>;
};
