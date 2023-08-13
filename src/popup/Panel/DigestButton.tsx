import { AiOutlineReload } from 'react-icons/ai';
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
      data-tooltip-content={getLocalString('redigest')}
    >
      <AiOutlineReload className="pointer-events-none w-4 h-4" />
    </button>
  );
};

export default DigestButton;
