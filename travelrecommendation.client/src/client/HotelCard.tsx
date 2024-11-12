import { useState } from 'react';
import thumb from '../assets/thumbs-up.svg';

export interface Hotel {
    name: string;
    id: string;
    location: string;
    image?: {
        height: number;
        width: number;
        url: string;
    }
    hotelClass?: number;
}

interface IHotelCard {
    hotel: Hotel;
    sendRating: (value: boolean, hotelId: string) => void;
}


function HotelCard({ hotel, sendRating }: IHotelCard) {
    const [approved, setApproved] = useState<boolean | null>(null);

    const star = (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M11.0137 2.76683C11.379 1.89022 12.6208 1.89022 12.9861 2.76683L14.9102 7.38462C15.0654 7.75726 15.4295 8 15.8332 8H20.893C21.8234 8 22.2893 9.12483 21.6314 9.78268L17.5391 13.875C17.2823 14.1318 17.185 14.5076 17.2847 14.8568L18.9076 20.5369C19.1816 21.496 18.1122 22.2767 17.2822 21.7234L12.5546 18.5716C12.2187 18.3477 11.7811 18.3477 11.4452 18.5717L6.72544 21.7182C5.89284 22.2732 4.81988 21.49 5.09479 20.5279L6.71509 14.8568C6.81486 14.5076 6.71747 14.1318 6.46068 13.875L2.38859 9.8029C1.72328 9.13758 2.19448 8 3.13538 8H8.16658C8.57028 8 8.93438 7.75726 9.08965 7.38462L11.0137 2.76683Z" fill="#323232" />
        </svg>
    );
    const halfStar = (
        <svg width="6" height="12" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_1_7)">
                <path d="M4.50685 0.383416C4.6895 -0.0548888 5.3104 -0.0548888 5.49305 0.383416L6.4551 2.69231C6.5327 2.87863 6.71475 3 6.9166 3H9.4465C9.9117 3 10.1447 3.56242 9.8157 3.89134L7.76955 5.9375C7.64115 6.0659 7.5925 6.2538 7.64235 6.4284L8.4538 9.26845C8.5908 9.748 8.0561 10.1384 7.6411 9.8617L5.2773 8.2858C5.10935 8.17385 4.89055 8.17385 4.7226 8.28585L2.36272 9.8591C1.94642 10.1366 1.40994 9.745 1.5474 9.26395L2.35755 6.4284C2.40743 6.2538 2.35874 6.0659 2.23034 5.9375L0.194296 3.90145C-0.138359 3.56879 0.0972408 3 0.567691 3H3.08329C3.28514 3 3.46719 2.87863 3.54483 2.69231L4.50685 0.383416Z" fill="#323232" />
            </g>
            <defs>
                <clipPath id="clip0_1_7">
                    <rect width="6" height="12" fill="white" />
                </clipPath>
            </defs>
        </svg>

    );

    const approve = (rating: boolean, hotelId: string) => {
        if (approved !== null) return;
        setApproved(rating)
        sendRating(rating, hotelId);
    }

    return (
        <div className="hotel-card">
            <div className="image-container">
                {hotel.image && <img src={hotel.image.url} className="hotel-image"></img>}
            </div>
            <div className="thumbs-container flex gap-3">
                {[null, true].includes(approved) && <div className={`thumb-container ${approved === true ? 'selected' : ''}`} onClick={() => approve(true, hotel.id)}>
                    <img src={thumb} width={18} height={18} className="thumb-button"></img>
                </div>}
                {[null, false].includes(approved) && <div className={`thumb-container  ${approved === false ? 'selected' : ''}`} onClick={() => approve(false, hotel.id)} >
                    <img src={thumb} width={18} height={18} className="thumb-button thumb-down-button"></img>
                </div>}
            </div>
        <div className="p-6">
            <p className="text-lg">{hotel.location}</p>
            <p className="bold mt-3 text-4xl">{hotel.name}</p>
                {hotel.hotelClass && <ul className="hotel-class flex gap-2">
                    {[...Array(Math.floor(hotel.hotelClass))].map((_, i) => <span key={i}>{star}</span>)}
                    {hotel.hotelClass % 1 !== 0 && <span>{halfStar}</span>}
                </ul>}
        </div>
    </div>)
}

export default HotelCard;
