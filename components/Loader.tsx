import React from 'react';
import { LoaderIcon } from './icons';

interface LoaderProps {
    status: string;
}

export const Loader: React.FC<LoaderProps> = ({ status }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
            <LoaderIcon className="h-12 w-12 animate-spin text-primary" />
            <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground">Generating Your Brand Bible...</h2>
                <p className="text-muted-foreground mt-2">{status}</p>
            </div>
        </div>
    );
};
