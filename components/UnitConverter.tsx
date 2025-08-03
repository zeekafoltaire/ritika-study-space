
import React, { useState, useEffect } from 'react';

const conversionFactors: Record<string, Record<string, number>> = {
    Length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.34, yd: 0.9144, ft: 0.3048, in: 0.0254 },
    Mass: { g: 1, kg: 1000, mg: 0.001, t: 1000000, lb: 453.592, oz: 28.3495 },
    Time: { s: 1, min: 60, hr: 3600, day: 86400 },
    DigitalStorage: { B: 1, KB: 1024, MB: 1024**2, GB: 1024**3, TB: 1024**4 },
    Energy: { J: 1, kJ: 1000, cal: 4.184, kcal: 4184, kWh: 3.6e+6, eV: 1.60218e-19 },
};

// Special handling for temperature as it's not a simple factor conversion
const convertTemperature = (value: number, from: string, to: string): number => {
    if (from === to) return value;
    let kelvin = value;
    // Convert input to Kelvin
    if (from === '°C') kelvin = value + 273.15;
    else if (from === '°F') kelvin = (value - 32) * 5/9 + 273.15;

    // Convert Kelvin to output
    if (to === '°C') return kelvin - 273.15;
    if (to === '°F') return (kelvin - 273.15) * 9/5 + 32;
    return kelvin; // to 'K'
};

const categories = {
    Length: ['m', 'km', 'cm', 'mm', 'mi', 'yd', 'ft', 'in'],
    Mass: ['g', 'kg', 'mg', 't', 'lb', 'oz'],
    Temperature: ['°C', '°F', 'K'],
    Time: ['s', 'min', 'hr', 'day'],
    'Digital Storage': ['B', 'KB', 'MB', 'GB', 'TB'],
    Energy: ['J', 'kJ', 'cal', 'kcal', 'kWh', 'eV'],
};
type Category = keyof typeof categories;

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & {options: string[]}> = ({ options, ...props }) => (
    <select {...props} className="w-full bg-brand-surface-light border border-brand-border rounded-md p-3 text-sm focus:ring-2 focus:ring-brand-primary focus:outline-none">
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
     <input {...props} className="w-full bg-brand-surface-light border border-brand-border rounded-md p-3 text-lg font-mono focus:ring-2 focus:ring-brand-primary focus:outline-none" />
);

const UnitConverter: React.FC = () => {
    const [category, setCategory] = useState<Category>('Length');
    const [fromUnit, setFromUnit] = useState(categories['Length'][0]);
    const [toUnit, setToUnit] = useState(categories['Length'][1]);
    const [inputValue, setInputValue] = useState('1');
    const [outputValue, setOutputValue] = useState('');

    useEffect(() => {
        // Reset units when category changes
        setFromUnit(categories[category][0]);
        setToUnit(categories[category][1]);
        setInputValue('1');
    }, [category]);

    useEffect(() => {
        const val = parseFloat(inputValue);
        if (isNaN(val)) {
            setOutputValue('');
            return;
        }

        let result;
        if (category === 'Temperature') {
            result = convertTemperature(val, fromUnit, toUnit);
        } else {
            const factors = conversionFactors[category as keyof typeof conversionFactors];
            const baseValue = val * factors[fromUnit];
            result = baseValue / factors[toUnit];
        }

        // Format to a reasonable number of decimal places
        setOutputValue(Number(result.toPrecision(6)).toString());

    }, [inputValue, fromUnit, toUnit, category]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    return (
        <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-card max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-brand-text-primary mb-4">Unit Converter</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-brand-text-secondary mb-1">Category</label>
                    <Select options={Object.keys(categories)} value={category} onChange={e => setCategory(e.target.value as Category)} />
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4">
                    {/* From Section */}
                    <div className="w-full space-y-2">
                        <label className="block text-sm font-medium text-brand-text-secondary">From</label>
                        <Select options={categories[category]} value={fromUnit} onChange={e => setFromUnit(e.target.value)} />
                        <Input type="number" value={inputValue} onChange={handleInputChange} />
                    </div>
                    {/* Arrow */}
                    <div className="text-2xl font-bold text-brand-primary shrink-0 md:rotate-0 rotate-90 my-2 md:my-0">&#x2192;</div>
                     {/* To Section */}
                    <div className="w-full space-y-2">
                        <label className="block text-sm font-medium text-brand-text-secondary">To</label>
                        <Select options={categories[category]} value={toUnit} onChange={e => setToUnit(e.target.value)} />
                        <Input type="number" value={outputValue} readOnly disabled />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnitConverter;
