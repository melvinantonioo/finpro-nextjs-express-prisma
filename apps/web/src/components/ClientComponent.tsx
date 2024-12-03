// components/ClientComponent.tsx
'use client'; // Mark as a client-side component

import { useEffect, useState } from 'react';

const ClientComponent = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // Render nothing on SSR

    return (
        <div>
            <h1>This is a client-side only component</h1>
            <p>It only renders after the client-side has been loaded.</p>
        </div>
    );
};

export default ClientComponent;