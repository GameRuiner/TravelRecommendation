import { FormEvent, useState } from 'react';
import './App.css';
import './PromptPage.css'
import sendIcon from './assets/send.svg'

interface Hotel {
    name: string;
}

function PromptPage() {
    const [hotels, setHotels] = useState<Hotel[]>();

    const submitPrompt = (e: FormEvent) => {
        e.preventDefault()
        const target = e.target as typeof e.target & {
            prompt: { value: string };
        };
        const prompt = target.prompt.value;
        populateHotelsData(prompt)
    }

    return (
        <div className="mt-8 flex flex-col items-center">
            <p className="bold text-5xl">Where you want to go?</p>
            <form className="prompt-container mt-8 w-full" onSubmit={(e) => submitPrompt(e)}>
                <input className="w-full rounded-full p-3 pl-6 pr-12" name="prompt" />
                <button className="flex h-8 w-8 items-center justify-center rounded-full p-0"><img src={sendIcon} className="h-6 w-6"></img></button>
            </form>
            {hotels && <div>
                <h2 className="text-3xl font-bold underline">Recommended hotels</h2>
                <ul>
                    {hotels.map(hotel =>
                        <li key={hotel.name}>
                            {hotel.name}
                        </li>
                    )}
                </ul>
            </div>}
        </div>
    );

    async function populateHotelsData(prompt: string) {
        const sendData = JSON.stringify({ 'prompt': prompt });
        const requestOptions: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: sendData,
        };
        const response = await fetch('hotel', requestOptions);
        const data = await response.json();
        setHotels(data);
    }
}

export default PromptPage;