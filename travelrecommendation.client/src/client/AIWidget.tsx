import { useEffect, useRef } from 'react';

export default function AIWidget({ agentSearch }: { agentSearch: (prompt: string, options: object) => void }) {
  const widgetRef = useRef<HTMLElement | null>(null);
  const isWidgetInit = useRef(false);

  const normalizeOptions = (options: Record<string, unknown>): Record<string, unknown[]> => (
    Object.fromEntries(
      Object.entries(options)
        .map(([key, value]) => [
          key, Array.isArray(value) ? 
          value.flatMap(item => typeof item === "string" ? item.split(",").map(str => str.trim()) : item) : 
          (value as string).split(", ")
        ])
    ));


  useEffect(() => {
    const widget = document.querySelector(
      'elevenlabs-convai'
    ) as HTMLElement | null;
    const initWidget = async (widget: HTMLElement) => {
      widgetRef.current = widget;
      const response = await fetch('hotel/hotel_options');
      const data = await response.json();
      const dynamicVars = {
        "hotel_options": JSON.stringify(data["hotel_options"])
      }
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
    if (widget && !isWidgetInit.current) {
      console.log("init widget")
      isWidgetInit.current = true;
      initWidget(widget)
      console.log(normalizeOptions({
        "countries": ["Japan,Greece,Spain"],
        "price_level": [
            "$$"
        ]
    }))
    }
  }, [agentSearch]);

  return (<></>)
}