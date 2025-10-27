import { MoveUp } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const ToptoBottom = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="
                        fixed bottom-5 right-5
                        bg-black text-white p-3 rounded-full shadow-lg
                        transition duration-300 z-50
                       
                    "
                    aria-label="Scroll to top"
                >
                    <MoveUp/>
                </button>
            )}
        </>
    );
};

export default ToptoBottom;