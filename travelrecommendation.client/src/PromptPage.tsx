
import { FormEvent, useState } from 'react';
import './App.css';
import './PromptPage.css'
import sendIcon from './assets/send.svg'

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
        <div className="mt-12 flex flex-col items-center">
            <p className="bold text-8xl">Where you want to go?</p>
            <form className="prompt-container mt-12 w-full" onSubmit={(e) => submitPrompt(e)}>
                <input className="w-full rounded-full p-6 pl-12 pr-16" name="prompt" />
                <button className="flex h-12 w-12 items-center justify-center rounded-full p-0"><img src={sendIcon} className="h-8 w-8"></img></button>
            </form>
            {hotels && <div>
                <h2 className="bold mt-8 text-3xl">Check this out</h2>
                <ul className="mt-6 flex gap-10">
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