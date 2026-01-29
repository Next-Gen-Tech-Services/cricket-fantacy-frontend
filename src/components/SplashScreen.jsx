import React, { useEffect, useMemo, useState } from 'react';
import splashGif from '../assets/splash.gif';

const SplashScreen = ({ onComplete, duration = 5000 }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const particles = useMemo(
        () =>
            Array.from({ length: 20 }, () => ({
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
            })),
        []
    );

    useEffect(() => {
        // Start fade out animation before completing
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, duration - 500);

        // Complete splash screen
        const completeTimer = setTimeout(() => {
            setIsVisible(false);
            onComplete && onComplete();
        }, duration);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(completeTimer);
        };
    }, [duration, onComplete]);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'
                }`}
        >
            {/* Background with subtle animation */}
            <div className="absolute inset-0 bg-black">
                {/* Animated particles */}
                <div className="absolute inset-0">
                    {particles.map((particle, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-orange-500 rounded-full animate-pulse"
                            style={particle}
                        />
                    ))}
                </div>
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center">
                {/* Logo container */}
                <div className="mb-8 animate-pulse">
                    <img
                        src={splashGif}
                        alt="Cricket Lovers Global"
                        className="w-80 h-80 mx-auto object-contain"
                        
                    />
                </div>

                

               
            </div>

            {/* Bottom gradient */}
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-orange-900/20 to-transparent"></div>
        </div>
    );
};

export default SplashScreen;