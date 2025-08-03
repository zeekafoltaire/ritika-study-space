
import React, { useState } from 'react';

const Calculator: React.FC = () => {
    const [display, setDisplay] = useState('0');
    const [expression, setExpression] = useState('');
    const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');
    const [isResult, setIsResult] = useState(false);

    const factorial = (n: number): number => {
        if (n < 0 || !Number.isInteger(n)) return NaN;
        if (n > 170) return Infinity; // Prevent performance issues with large numbers
        if (n === 0) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    };

    const handleButtonClick = (value: string) => {
        const isOperator = (v: string) => ['+', '-', '*', '/', '^'].includes(v);
        
        if (/\d/.test(value)) {
            if (isResult || display === '0') {
                setDisplay(value);
                setExpression(prev => (isOperator(prev.slice(-1)) || prev === '') ? prev + value : value);
            } else {
                setDisplay(prev => prev + value);
                setExpression(prev => prev + value);
            }
            setIsResult(false);
            return;
        }

        if (value === '.') {
            if (isResult) {
                setDisplay('0.');
                setExpression('0.');
            } else if (!display.includes('.')) {
                setDisplay(prev => prev + '.');
                setExpression(prev => prev + '.');
            }
            setIsResult(false);
            return;
        }

        if (isOperator(value)) {
            if (expression === '' && display !== '0') {
                 setExpression(display + value);
            } else if (isOperator(expression.trim().slice(-1))) {
                setExpression(prev => prev.trim().slice(0, -1) + value);
            } else {
                setExpression(prev => prev + value);
            }
            setIsResult(true);
            return;
        }
        
        let result: number | string = '';
        const currentVal = parseFloat(display);

        switch (value) {
            case 'C':
                setDisplay('0');
                setExpression('');
                setIsResult(false);
                break;
            case '⌫':
                if (display.length > 1) {
                    const newDisplay = display.slice(0, -1);
                    setDisplay(newDisplay);
                    setExpression(newDisplay);
                } else {
                    setDisplay('0');
                    setExpression('');
                }
                break;
            case '=':
                try {
                    const sanitizedExpression = expression.replace(/\^/g, '**');
                    // Simple validation to prevent obvious non-math execution
                     if (/[^0-9\.\+\-\*\/\(\)\s\e\^\%]/g.test(sanitizedExpression)) {
                         throw new Error("Invalid characters");
                     }
                    // eslint-disable-next-line no-eval
                    result = eval(sanitizedExpression);
                } catch {
                    result = 'Error';
                }
                setExpression(String(result));
                break;
            case 'Rad/Deg':
                setAngleMode(prev => (prev === 'deg' ? 'rad' : 'deg'));
                return; // No display change
            case 'x²':
                result = Math.pow(currentVal, 2);
                break;
            case '!':
                result = factorial(currentVal);
                break;
            case 'π':
                result = Math.PI;
                setExpression(String(result));
                break;
            case 'e':
                result = Math.E;
                setExpression(String(result));
                break;
            case 'sqrt':
                result = Math.sqrt(currentVal);
                break;
            case 'sin': case 'cos': case 'tan':
                const rad = angleMode === 'deg' ? (currentVal * Math.PI) / 180 : currentVal;
                result = value === 'sin' ? Math.sin(rad) : value === 'cos' ? Math.cos(rad) : Math.tan(rad);
                break;
            case 'sin⁻¹': case 'cos⁻¹': case 'tan⁻¹':
                let inverseResult = value === 'sin⁻¹' ? Math.asin(currentVal) : value === 'cos⁻¹' ? Math.acos(currentVal) : Math.atan(currentVal);
                result = angleMode === 'deg' ? (inverseResult * 180) / Math.PI : inverseResult;
                break;
            case 'log':
                result = Math.log10(currentVal);
                break;
            case 'ln':
                result = Math.log(currentVal);
                break;
            default:
                // For operators added to expression
                setExpression(prev => prev + value);
                setIsResult(true);
                return;
        }

        setDisplay(String(result));
        if (value !== '=') {
           setExpression(String(result));
        }
        setIsResult(true);
    };

    const Button: React.FC<{ onClick: () => void, className?: string, children: React.ReactNode }> = ({ onClick, className, children }) => (
        <button
            onClick={onClick}
            className={`flex items-center justify-center text-lg font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:z-10 h-14 ${className}`}
        >
            {children}
        </button>
    );
    
    const buttons = [
        'Rad/Deg', 'x²', 'xʸ', '⌫',
        'sin⁻¹', 'cos⁻¹', 'tan⁻¹', '!',
        'sin', 'cos', 'tan', 'C',
        'ln', 'log', 'sqrt', '%',
        '(', ')', 'π', 'e',
        '7', '8', '9', '/',
        '4', '5', '6', '*',
        '1', '2', '3', '-',
        '0', '.', '=', '+',
    ];

    const getButtonClass = (btn: string) => {
        if (['/', '*', '-', '+', '=', 'xʸ', '%'].includes(btn)) return 'bg-brand-primary text-black hover:bg-brand-primary-hover';
        if (['C', '⌫'].includes(btn)) return 'bg-brand-urgent/20 text-brand-urgent hover:bg-brand-urgent/40';
        return 'bg-brand-surface-light text-brand-text-primary hover:bg-brand-border';
    }

    return (
        <div className="bg-brand-surface rounded-2xl border border-brand-border p-4 md:p-6 shadow-card max-w-md mx-auto">
            <h2 className="text-xl font-bold text-brand-text-primary mb-4">Scientific Calculator</h2>
            
            <div className="bg-brand-bg text-right rounded-lg p-4 mb-4 border border-brand-border">
                <div className="text-xs text-brand-text-secondary h-5 truncate text-right">{expression || '0'}</div>
                <div className="text-4xl font-mono text-white break-all h-12 flex items-center justify-end">
                    <span>{display}</span>
                    <span className="text-sm font-semibold text-brand-secondary ml-2">{angleMode.toUpperCase()}</span>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2 md:gap-3">
                {buttons.map((btn) => (
                    <Button
                        key={btn}
                        onClick={() => handleButtonClick(btn === 'xʸ' ? '^' : btn)}
                        className={`${getButtonClass(btn)} ${btn === '=' ? 'col-span-2' : ''}`}
                    >
                       {btn === 'Rad/Deg' ? angleMode.toUpperCase() : btn}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default Calculator;
