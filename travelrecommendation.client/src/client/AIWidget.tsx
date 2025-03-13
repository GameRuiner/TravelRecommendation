import { useEffect, useRef } from 'react';

export default function AIWidget({agentSearch}:  {agentSearch : (prompt: string, options: object) => void}) {
  const widgetRef = useRef<HTMLElement | null>(null);

  const normalizeOptions = (options: Record<string, unknown>): Record<string, unknown[]> => (
    Object.fromEntries(
      Object.entries(options)
            .map(([key, value]) => [key, Array.isArray(value) ? value : (value as string).split(", ")])
    ));
  

  useEffect(() => {
    const widget = document.querySelector(
      'elevenlabs-convai'
    ) as HTMLElement | null;
    if (widget) {
      widgetRef.current = widget;
      const dynamicVars = {
        hotel_options: `{
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
        }`,
      };
      widget.setAttribute('dynamic-variables', JSON.stringify(dynamicVars));
      widget.addEventListener('elevenlabs-convai:call', (event) => {
        const customEvent = event as CustomEvent;
        customEvent.detail.config.clientTools = {
          createPrompt: async ({ prompt, options }: { prompt: string, options: Record<string, unknown> }) => {
            agentSearch(prompt, normalizeOptions(options));
            return 'Showed hotels';
          },
        };
      });
    }
  }, [agentSearch]);

  return (<></>)
}