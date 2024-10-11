import { useEffect, useState } from 'react';
import './App.css';

interface Hotel {
    name: string;
}

function PromptPage() {
    const [hotels, setHotels] = useState<Hotel[]>();

    useEffect(() => {
        populateHotelsData();
    }, []);

    return (
        <div>
            <p>Where you want to go?</p>
            <input type="text" />
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

    async function populateHotelsData() {
        const response = await fetch('hotel');
        const data = await response.json();
        setHotels(data);
    }
}

export default PromptPage;