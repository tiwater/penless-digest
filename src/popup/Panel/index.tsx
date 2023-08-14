import { useEffect, useState } from 'react';
import { getLocalString, localize } from '../../utils/i18n';
import Toolbar from './components/Toolbar';
import { Tooltip } from 'react-tooltip';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import './markdown.css';
import { cleanCachedDigest, getCachedDigest } from '../../utils/store';
import { getCurrentTab } from '../../utils/tabs';

const Panel = () => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [digesting, setDigesting] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    localize();
    const observer = new MutationObserver(() => {
      //  Call localize() whenever any page elements change
      localize();
    });
    observer.observe(document, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    getCurrentTab().then(tab => {
      getCachedDigest(`pagecache-${tab[0].url}`).then(pageCache => setContent(pageCache));
    });
  }, []);

  useEffect(() => {
    const match = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(match.matches);

    const handleMatchChange = (e: any) => setDarkMode(e.matches);

    match.addEventListener('change', handleMatchChange);
    setDarkMode(match.matches);
    return () => match.removeEventListener('change', handleMatchChange);
  }, []);

  const onDigest = () => {
    setContent('');
    setError('');
    setDigesting(true);
    chrome.runtime.sendMessage({ type: 'digest' }, (message: any) => {
      console.log('digest response:', message);
      setDigesting(false);
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        setError(chrome.runtime.lastError.message || '');
        return;
      }
      if (message.success) {
        setContent(message.data || '');
      } else {
        setError(message.error || '');
      }
    });
  };

  const onRedigest = () => {
    getCurrentTab().then(tab => {
      cleanCachedDigest(`pagecache-${tab[0].url}`);
    });
    onDigest();
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
    <div className="flex flex-col w-96 h-128 bg-base-100 dark:border dark:bg-gray-700 dark:border-gray-600 gap-2">
      <Toolbar onCopy={onCopy} onDigest={content && onRedigest} digesting={digesting} dark={darkMode} />
      {content ? (
        <ReactMarkdown remarkPlugins={[gfm]} className="popup-container w-full h-full p-2 overflow-y-auto">
          {content}
        </ReactMarkdown>
      ) : (
        <div className="relative flex flex-col items-center justify-center gap-4 w-full h-full">
          <div className={clsx({ hidden: !digesting }, 'flex flex-col items-center gap-4')}>
            <div className="text-primary loading loading-bars" />
            <div data-i18n="loadingText">Loading</div>
          </div>
          <button data-i18n="digest" onClick={onDigest} className={clsx({ hidden: digesting }, 'btn btn-primary px-4')}>
            Digest
          </button>
          <div
            className={clsx(
              { hidden: !error },
              'absolute bottom-1 left-1 right-1 flex flex-col items-center gap-4 border border-error bg-error/30 rounded-sm p-2',
            )}
          >
            <div data-i18n="error" className="text-error font-bold">
              Error
            </div>
            <div>{getLocalString(error)}</div>
          </div>
        </div>
      )}
      <Tooltip id="digest-tooltip" place="bottom" style={{ zIndex: 50 }} />
    </div>
  );
};

export default Panel;
