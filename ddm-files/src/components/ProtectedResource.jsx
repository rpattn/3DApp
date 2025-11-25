"use client"

import React from "react";
import { useState, useEffect } from 'react';

export default function ProtectedResource({ resourcePath }) {

    const [html, setHTML] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await fetch(`/api/getFile?url=${resourcePath}`, {});

                if (!response.ok) {
                    throw new Error('Failed to fetch image');
                }

                const blob = await response.text();

                setHTML(blob);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchImage();
    }, [resourcePath]);

    if (error) {
        return <div>Error fetching resource: {error}</div>;
    }

    if (!html) {
        return <div>Loading resource...</div>;
    }

    //ADD DOM PURIFY TO SANITIZE
    return <div dangerouslySetInnerHTML={{__html: html}}></div>;
}
