
import { FormEvent, useRef, useState } from 'react';
import './App.css';
import './PromptPage.css'
import HotelCard, { Hotel } from './HotelCard';
import AIWidget from './AIWidget';


function PromptPage() {
    const [hotels, setHotels] = useState<Hotel[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const populateHotelsData = async (prompt: string, options: object | null) => {
        setLoading(true);
        const sendData = JSON.stringify({ 'prompt': prompt, options: options });

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: sendData,
        };
        try {
            const response = await fetch('hotel/get', requestOptions);
            const data = await response.json();
            setHotels(data);
        } finally {
            setLoading(false);
        }
    }

    const submitPrompt = (e: FormEvent) => {
        e.preventDefault()
        const target = e.target as typeof e.target & {
            prompt: { value: string };
        };
        const prompt = target.prompt.value;
        populateHotelsData(prompt, null)
    }

    const sendRating = (rating: boolean, hotelId: string) => {
        const sendData = JSON.stringify({ 'prompt': prompt, 'rating': rating, 'hotelId': hotelId });
        const requestOptions: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: sendData,
        };
        fetch('hotel/rate', requestOptions);
    }    

    const agentSearch = (prompt: string, options: object) => {
        if (inputRef && inputRef.current)
            inputRef.current.value = prompt;
        populateHotelsData(prompt, options);
    }

    return (
        <div className="container-size mt-12 flex flex-col items-center">
            <p className="bold text-6xl">What does your perfect stay look like?</p>
            <form className="prompt-container mt-12 w-full" onSubmit={(e) => submitPrompt(e)}>
                <input className="w-full rounded-full p-6 pl-12 pr-16" name="prompt" autoComplete="off" ref={inputRef} />
                <button className="flex h-12 w-12 items-center justify-center rounded-full p-0">
                    <div className="send-image h-8 w-8">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </button>
            </form>
            {loading && (
                <div className="mt-12 flex items-center justify-center">
                    <div className="loader"></div>
                </div>
            )}
            {hotels && hotels.length > 0 && <div className="max-w-full">
                <h2 className="bold mt-8 text-3xl">Check this out</h2>
                <ul className="mt-6 flex flex-wrap justify-center gap-10">
                    {hotels.map(hotel =>
                        <li key={hotel.id}>
                            <HotelCard hotel={hotel} sendRating={sendRating }></HotelCard>
                        </li>
                    )}
                </ul>
            </div>}
            <AIWidget agentSearch={agentSearch}/>
        </div>
    );


}

export default PromptPage;