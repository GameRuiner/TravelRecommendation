import './App.css';
import PromptPage from './PromptPage';
import { useEffect, useState } from 'react';


function App() {
    const [isOnline, setIsOnline] = useState<boolean | null>(null);

    useEffect(() => {
        const checkServer = async () => {
            try {
                const response = await fetch('/hotel/health');
                setIsOnline(response.ok);
            } catch {
                setIsOnline(false);
            }
        }
        checkServer();
    }, [])
    
    if (isOnline === null) {
        return <p>Loading...</p>
    }

    return (
        <div>
            {isOnline ? <PromptPage /> :
                <div className="container-size mt-12 flex flex-col items-center">
                    <p className="bold text-7xl">Server is taking a nap 😴... Call the admin to wake it up! ☎️🚀</p>
                </div>
            }
        </div>
    );
}

export default App;