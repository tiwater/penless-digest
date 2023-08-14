import CopyButton from './CopyButton';
import DigestButton from './DigestButton';

const Toolbar = ({ onCopy, onDigest, digesting, dark }: any) => {
  return (
    <div className="flex w-full h-12 items-center justify-between px-2 gap-2 border-b border-base-200 dark:border-gray-600">
      <div className="flex items-end gap-2 p-2">
        <img
          src={dark ? '/images/logo-full-white.png' : '/images/logo-full.png'}
          alt="logo"
          className="w-24 h-full object-fit"
        />
        <div className="text-primary text-md">Digest</div>
      </div>
      <div className="flex items-center px-2 gap-2">
        <DigestButton onDigest={onDigest} digesting={digesting} />
        <CopyButton onCopy={onCopy} />
      </div>
    </div>
  );
};

export default Toolbar;
