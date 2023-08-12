import { useEffect, useState } from 'react';
import { HiOutlineClipboard, HiOutlineClipboardCheck } from 'react-icons/hi';
import { getLocalString } from '../../utils/i18n';

const CopyButton = ({ onCopy: _onCopy }: any) => {
  const [copied, setCopied] = useState(false);
  const CopyIcon = copied ? HiOutlineClipboardCheck : HiOutlineClipboard;
  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [copied]);

  const onCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    console.log('onCopy inline');
    _onCopy && _onCopy();
  };

  return (
    <div
      id="copy"
      onClick={onCopy}
      className="w-7 h-7 rounded-full cursor-pointer hover:text-primary hover:bg-primary/10 flex items-center justify-center"
      data-tooltip-id="digest-tooltip"
      data-tooltip-content={getLocalString('copy')}
    >
      <CopyIcon className="pointer-events-none w-4 h-4" />
    </div>
  );
};

export default CopyButton;
