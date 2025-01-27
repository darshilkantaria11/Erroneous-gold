import { useEffect, useState } from 'react';

const useInView = (ref) => {
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry], observerInstance) => {
                if (entry.isIntersecting) {
                    setIsIntersecting(true);
                    observerInstance.disconnect(); // Stop observing after the first intersection
                }
            },
            {
                threshold: 0, // Adjust threshold as needed
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref]);

    return isIntersecting;
};

export default useInView;
