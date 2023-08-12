import { HiOutlineCode } from 'react-icons/hi';
import { getLocalString } from '../../utils/i18n';
import clsx from 'clsx';

const DigestButton = ({ onDigest, digesting }: any) => {
  return (
    <button
      onClick={onDigest}
      className={clsx('btn btn-circle btn-sm btn-ghost', {
        'btn-disabled': !onDigest || digesting,
      })}
      data-tooltip-id="digest-tooltip"
      data-tooltip-content={getLocalString('digest')}
    >
      {digesting ? (
        <div className="text-primary loading loading-bars loading-sm" />
      ) : (
        <HiOutlineCode className="pointer-events-none w-4 h-4" />
      )}
    </button>
  );
};

export default DigestButton;
