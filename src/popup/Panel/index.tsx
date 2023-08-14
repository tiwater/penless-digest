import { useEffect, useRef, useState } from 'react';
import { getLocalString, localize } from '../../utils/i18n';
import Toolbar from './components/Toolbar';
import { Tooltip } from 'react-tooltip';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import './markdown.css';
import { cleanCachedDigest, getCachedDigest } from '../../utils/store';
import { getCurrentTab } from '../../utils/tabs';
import { BiStopwatch } from 'react-icons/bi';

const Panel = () => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [digesting, setDigesting] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [timeEllapsed, setTimeEllapsed] = useState(0);
  const timerRef = useRef<any>(null);
  const startTimeRef = useRef(Date.now());

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
      getCachedDigest(`pagecache-${tab[0].url}`)
        .then(pageCache => setContent(pageCache))
        .catch(e => console.log(e));
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
      clearInterval(timerRef.current);
      timerRef.current = null;
    });
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimeEllapsed(Date.now() - startTimeRef.current);
    }, 1000);
  };

  const formatTimeEllapsed = (time: number) => {
    const seconds = Math.floor(time / 1000);
    const minutes = Math.floor(seconds / 60);
    const formattedSeconds = (seconds % 60).toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
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

  const LinkRenderer = (props: any) => {
    return <a href={props.href} onClick={(event) => {
      event.preventDefault();
      chrome.tabs.create({ url: props.href });
    }}>{props.children}</a>
  };

  return (
    <div className="flex flex-col w-96 h-128 bg-base-100 dark:border dark:bg-gray-700 dark:border-gray-600 gap-2">
      <Toolbar onCopy={onCopy} onDigest={content && onRedigest} digesting={digesting} dark={darkMode} />
      {content ? (
        <ReactMarkdown remarkPlugins={[gfm]} components={{ a: LinkRenderer }} className="popup-container w-full h-full p-2 overflow-y-auto">
          {content}
        </ReactMarkdown>
      ) : (
        <div className="relative flex flex-col items-center justify-center gap-4 w-full h-full">
          <div className={clsx({ hidden: !digesting }, 'flex flex-col items-center gap-4')}>
            <div className="text-primary loading loading-bars" />
            <div className="text-primary flex items-center gap-1"><BiStopwatch className="w-5 h-5"/>{formatTimeEllapsed(timeEllapsed)}</div>
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
