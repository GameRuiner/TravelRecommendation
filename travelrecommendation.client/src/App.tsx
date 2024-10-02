import { useEffect, useState } from 'react';
import './App.css';

interface Hotel {
    name: string;
}

function App() {
    const [hotels, setHotels] = useState<Hotel[]>();

    useEffect(() => {
        populateHotelsData();
    }, []);

    console.log(hotels);

    const contents = hotels === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <div>
            <ul>
                {hotels.map(hotel =>
                    <li key={hotel.name}>
                        {hotel.name}
                    </li>
                )}
            </ul>
        </div>;

    return (
        <div>
            <h1 id="tableLabel">Recommended hotels</h1>
            <p>Where you want to go?</p>
            {contents}
        </div>
    );

    async function populateHotelsData() {
        const response = await fetch('hotel');
        const data = await response.json();
        setHotels(data);
    }
}

export default App;