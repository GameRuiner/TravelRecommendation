import { useEffect, useRef } from 'react';

export default function AIWidget({agentSearch}:  {agentSearch : (prompt: string) => void}) {
  const widgetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const widget = document.querySelector(
      'elevenlabs-convai'
    ) as HTMLElement | null;
    if (widget) {
      widgetRef.current = widget;
      const dynamicVars = {
        hotel_options: {
          price_level: [ '$', '$$', '$$$', '$$$$' ],
          countries: [
            'Spain',
            'Greece',
            'Egypt',
            'Germany',
            'Poland',
            'United States',
            'Japan',
            'Turkiye',
            'United Arab Emirates'
          ]
        },
      };
      widget.setAttribute('dynamic-variables', JSON.stringify(dynamicVars));
      widget.addEventListener('elevenlabs-convai:call', (event) => {
        const customEvent = event as CustomEvent;
        customEvent.detail.config.clientTools = {
          createPrompt: async ({ prompt, options }: { prompt: string, options: object }) => {
            console.log(options)
            agentSearch(prompt);
            return 'Showed hotels';
          },
        };
      });
    }
  }, [agentSearch]);

  return (<></>)
}