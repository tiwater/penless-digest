import { useEffect, useState } from 'react';
import { localize } from '../../utils/i18n';
import Toolbar from './Toolbar';
import { Tooltip } from 'react-tooltip';
import { runtime, notifications } from 'webextension-polyfill';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const Panel = () => {
  const [content, setContent] = useState('');
  const [digesting, setDigesting] = useState(false);

  useEffect(() => localize(), []); // This will localize the whole page including the components

  useEffect(() => {
    console.log('Panel mounted');
    runtime.onMessage.addListener((message, _, sendResponse) => {
      if (message.type === 'digest_result') {
        console.log('digest request:', message.result);
        setContent(message.result || '');
        setDigesting(false);
      }
    });
  }, []);

  const onDigest = () => {
    console.log('onDigest');
    setContent('');
    setDigesting(true);
    runtime.sendMessage({ type: 'digest' }).then((response: any) => {
      console.log('digest response:', response);
      setContent(response.content);
      setDigesting(false);
      notifications.create({
        type: 'basic',
        iconUrl: 'images/logo.png',
        title: 'Digesting completed',
        message: 'Finished a digesting process.',
      });
    });
  };

  const onCopy = () => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        console.log('Text is copied:', content);
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };

  return (
    <div className="flex flex-col w-96 h-128 bg-base-100 border border-base-200 dark:bg-gray-700 dark:border-gray-600 gap-2">
      <Toolbar onCopy={onCopy} onDigest={onDigest} digesting={digesting} />
      {content ? (
        <ReactMarkdown remarkPlugins={[gfm]} className="w-full h-full p-2 overflow-y-auto">
          {content}
        </ReactMarkdown>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className={clsx({ hidden: !digesting }, 'flex flex-col items-center gap-4')}>
            <div className="text-primary loading loading-bars" />
            <div data-i18n="loadingText">Loading</div>
          </div>
          <button data-i18n="digest" onClick={onDigest} className={clsx({ hidden: digesting }, 'btn btn-primary px-4')}>
            Digest
          </button>
        </div>
      )}
      <Tooltip id="digest-tooltip" place="bottom" style={{ zIndex: 50 }} />
    </div>
  );
};

export default Panel;
