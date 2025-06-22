// External libraries
import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);


// loading context to be used throughout the app, saves having to add a loading spinner to each jsx
// can call with showLoading and hideLoading throughout the application - LoadingContext is at highest level in app.jsx

export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const [showOverlay, setShowOverlay] = useState(false);

    const showLoading = (text = '') => {
        setLoadingText(text);
        setShowOverlay(true);
        setLoading(true);
    };

    const hideLoading = () => {
        setLoading(false);
        setTimeout(() => {
            setShowOverlay(false); 
            setLoadingText('');
        }, 500);
    };

    return (
        <LoadingContext.Provider value={{ showLoading, hideLoading, loading }}>
            {children}
            {showOverlay && (
                <div
                    className={`fixed inset-0 ${loadingText ? 'bg-gray-100 bg-opacity-80' : 'bg-transparent'
                        } z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${loading ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    {loadingText && (
                        <>
                            <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
                            <p className="text-gray-900 text-lg mt-4">
                                {loadingText}
                            </p>
                        </>
                    )}

                </div>
            )}
        </LoadingContext.Provider>
    );
};
