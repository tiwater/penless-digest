import React from 'react';
import CopyButton from './CopyButton';

const Toolbar = ({ onCopy }: any) => {
  return (
    <div className="flex w-full h-8 items-center justify-between p-2 gap-2">
      <div className="flex items-end gap-2 p-2">
        <img src="/images/logo-full.png" alt="logo" className="w-24 h-full object-fit" />
        <div className="text-secondary text-md">Digest</div>
      </div>
      <div className="flex items-center px-2 gap-2">
        <CopyButton onCopy={onCopy} />
      </div>
    </div>
  );
};

export default Toolbar;
