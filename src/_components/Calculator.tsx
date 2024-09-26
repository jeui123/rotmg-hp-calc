import React, { useState, useEffect } from 'react';

function hp_calc(x: number, b: number): number | null {
    if (1 < x && x < 2) {
        return b;
    } else if (2 <= x && x <= 5) {
        return (1 + 0.2 * (x - 1)) * b;
    } else if (6 <= x && x <= 25) {
        return (1 + 0.2 * 4 + 0.35 * (x - 5)) * b;
    } else if (26 <= x && x <= 35) {
        return (1 + 0.2 * 4 + 0.35 * 20 + 0.4 * (x - 25)) * b;
    } else if (36 <= x && x <= 85) {
        return (1 + 0.2 * 4 + 0.35 * 20 + 0.4 * 10 + 0.35 * (x - 35)) * b;
    } else {
        return null;
    }
}


function shatters_calc(x: number, b: number): number | null {
    if (1 < x && x < 2) {
        return b;
    } else if (2 <= x && x <= 5) {
        return (1 + 0.3 * (x - 1)) * b;
    } else if (6 <= x && x <= 10) {
        return (1 + 0.3 * 4 + 0.4 * (x - 5)) * b;
    } else if (11 <= x && x <= 20) {
        return (1 + 0.3 * 4 + 0.4 * 5 + 0.45 * (x - 10)) * b;
    } else if (21 <= x && x <= 50) {
        return (1 + 0.3 * 4 + 0.4 * 5 + 0.45 * 10 + 0.5 * (x - 20)) * b;
    } else {
        return null; 
    }
}

function o3_calc(x: number, b: number): number | null {
    if (1 < x && x < 2) {
        return b;
    } else if (2 <= x && x <= 5) {
        return (1 + 0.35 * (x - 1)) * b;
    } else if (6 <= x && x <= 15) {
        return (1 + 0.35 * 4 + 0.4 * (x - 5)) * b;
    } else if (16 <= x && x <= 40) {
        return (1 + 0.35 * 4 + 0.4 * 10 + 0.45 * (x - 15)) * b;
    } else if (41 <= x && x <= 85) {
        return (1 + 0.35 * 4 + 0.4 * 10 + 0.45 * 25 + 0.4 * (x - 40)) * b;
    } else {
        return null;
    }
}

const PiecewiseFunctionComponent: React.FC = () => {
    const [x, setX] = useState<number>(1);
    const [b, setB] = useState<number>(0);
    const [result, setResult] = useState<string>(' ');
    const [currentCalc, setCurrentCalc] = useState<'hp' | 'shatters' | 'o3'>('hp');

    useEffect(() => {
        let calculatedResult: number | null;
        switch (currentCalc) {
            default:
            case 'hp':
                calculatedResult = hp_calc(x, b);
                break;
            case 'shatters':
                calculatedResult = shatters_calc(x, b);
                break;
            case 'o3':
                calculatedResult = o3_calc(x, b);
                break;
        }
        if (calculatedResult !== null) {
            const roundedResult = Math.round(calculatedResult);
            setResult(roundedResult.toLocaleString());
        } else {
            setResult(' ');
        }
    }, [x, b, currentCalc]);

    const handleCalcChange = (calc: 'hp' | 'shatters' | 'o3') => {
        setCurrentCalc(calc);
        if (calc === 'shatters') {
            setB(500000);
            setX(Math.min(x, 50)); // Ensure x doesn't exceed 50 for Shatters
        } else if (calc === 'o3') {
            setB(562500);
        }
    };

    const maxPlayers = currentCalc === 'shatters' ? 50 : 85;

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-4xl font-bold mb-4">RotMG HP Calculator</h2>

            <div className='mb-4 flex flex-row items-center space-x-2'>
                <button
                    className={`${currentCalc === 'hp' ? 'bg-blue-700' : 'bg-blue-500'} hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
                    onClick={() => handleCalcChange('hp')}
                >
                    Default
                </button>
                <button
                    className={`${currentCalc === 'shatters' ? 'bg-green-700' : 'bg-green-500'} hover:bg-green-700 text-white font-bold py-2 px-4 rounded`}
                    onClick={() => handleCalcChange('shatters')}
                >
                    Shatters
                </button>
                <button
                    className={`${currentCalc === 'o3' ? 'bg-red-700' : 'bg-red-500'} hover:bg-red-700 text-white font-bold py-2 px-4 rounded`}
                    onClick={() => handleCalcChange('o3')}
                >
                    O3
                </button>
            </div>

            <div className="mb-4">
                <label htmlFor="x-slider" className="block text-sm font-medium text-white-700">
                    Players in Dungeon: {x}
                </label>
                <input
                    type="range"
                    id="x-slider"
                    min="1"
                    max={maxPlayers}
                    value={x}
                    onChange={(e) => setX(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="b-input" className="block text-sm font-medium text-white-700">
                    Boss HP:
                </label>
                <input
                    type="text"
                    id="b-input"
                    value={b}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value) || value === '') {
                            setB(value === '' ? 0 : Number(value));
                        }
                    }}
                    step="0.1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
                />
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold">Scaled HP:</h3>
                <p className="text-2xl font-bold">
                    {result}
                </p>
            </div>
        </div>
    );
};

export default PiecewiseFunctionComponent;