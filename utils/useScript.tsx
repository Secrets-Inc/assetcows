import { useState, useEffect } from 'react';

// Define a type for the hook's return value
type ScriptStatus = 'loading' | 'ready' | 'error';

const useScript = (url: string): ScriptStatus => {
  const [status, setStatus] = useState<ScriptStatus>('loading');

  useEffect(() => {
    // Check if the script is already present in the document
    let script = document.querySelector(`script[src="${url}"]`) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.src = url;
      script.async = true;
      document.body.appendChild(script);

      const setAttributeFromEvent = (event: Event) => {
        setStatus(event.type === 'load' ? 'ready' : 'error');
      };

      script.addEventListener('load', setAttributeFromEvent);
      script.addEventListener('error', setAttributeFromEvent);

      return () => {
        if (script) {
          script.removeEventListener('load', setAttributeFromEvent);
          script.removeEventListener('error', setAttributeFromEvent);
        }
      };
    } else {
      // If the script already exists, assume it's ready
      setStatus('ready');
    }
  }, [url]);

  return status;
};

export default useScript;
