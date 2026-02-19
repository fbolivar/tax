
import React from 'react';

interface CardProps {
    children?: React.ReactNode;
    className?: string;
}

export function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`rounded-3xl shadow-premium border border-gray-100/50 ${className}`}>
            {children}
        </div>
    );
}
