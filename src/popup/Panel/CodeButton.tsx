import { HiOutlineCode } from 'react-icons/hi';

const CodeButton = ({ content }: any) => {

  return (
    <div
      id="code"
      className="w-7 h-7 rounded-full cursor-pointer hover:text-primary hover:bg-primary/10 flex items-center justify-center"
      data-tooltip-id="digest-tooltip"
      data-tooltip-content={content}
    >
      <HiOutlineCode className="pointer-events-none w-4 h-4" />
    </div>
  );
};

export default CodeButton;
