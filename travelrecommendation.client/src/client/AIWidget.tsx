import { useEffect, useRef } from 'react';

export default function AIWidget({agentSearch}:  {agentSearch : (prompt: string) => void}) {
  const widgetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const widget = document.querySelector(
      'elevenlabs-convai'
    ) as HTMLElement | null;
    if (widget) {
      widgetRef.current = widget;
      widget.addEventListener('elevenlabs-convai:call', (event) => {
        const customEvent = event as CustomEvent;
        customEvent.detail.config.clientTools = {
          createPrompt: async ({ prompt }: { prompt: string }) => {
            agentSearch(prompt);
            return 'Showed hotels';
          },
        };
      });
    }
  }, [agentSearch]);

  return (<></>)
}