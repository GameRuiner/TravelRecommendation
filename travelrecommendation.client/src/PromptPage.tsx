
import { FormEvent, useState } from 'react';
import './App.css';
import './PromptPage.css'
interface Ancestor {
    level: string;
    name: string;
}

interface Hotel {
    name: string;
    locationId: string;
    ancestors: Ancestor[];
    photos: {
        data: {
            album: string;
            images: {
                large: {
                    height: number;
                    width: number;
                    url: string;
                }
            }
        }[]
    }[];
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

    const getHotelImage = (hotel: Hotel) => {
        const imageObj = hotel.photos[0].data.
            filter(image => image.album === "Hotel & Grounds")[0];
        return <img src={imageObj.images.large.url} className="hotel-image"></img>
    }

    const getHotelLocation = (ancestors: Ancestor[]) => {
        let country = '';
        let region = '';
        let city = '';
        ancestors.forEach((ancestor: Ancestor) => {
            switch (ancestor.level) {
                case 'City':
                    city = ancestor.name
                    break;
                case 'Municipality':
                    city = ancestor.name
                    break;
                case 'Island':
                    city = ancestor.name
                    break;
                case 'Region':
                    region = ancestor.name
                    break;
                case 'Country':
                    country = ancestor.name;
                    break;
            }
        })
        const ancestorsArray = [country, region, city].filter((ancestor: string) => !!ancestor)
        return ancestorsArray.join(' / ')
     
    }

    return (
        <div className="container-size mt-12 flex flex-col items-center">
            <p className="bold text-8xl">Where you want to go?</p>
            <form className="prompt-container mt-12 w-full" onSubmit={(e) => submitPrompt(e)}>
                <input className="w-full rounded-full p-6 pl-12 pr-16" name="prompt" />
                <button className="flex h-12 w-12 items-center justify-center rounded-full p-0">
                    <div className="send-image h-8 w-8">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </button>
            </form>
            {hotels && <div className="max-w-full">
                <h2 className="bold mt-8 text-3xl">Check this out</h2>
                <ul className="mt-6 flex flex-wrap justify-center gap-10">
                    {hotels.map(hotel =>
                        <li key={hotel.locationId} className="hotel-card">
                            {getHotelImage(hotel)}
                            <div className="p-6">
                                <p className="text-lg">{getHotelLocation(hotel.ancestors)}</p>
                                <p className="bold mt-3 text-4xl">{hotel.name}</p>
                            </div>
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