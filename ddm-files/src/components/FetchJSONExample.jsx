"use client"

import React from "react";
import { useState, useEffect } from 'react';

export default function FetchJSONExample({ resourcePath }) {

    const [json, setJSON] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {

        async function getJSON() {
            try {
                const response = await fetch(`/api/getFile?url=${resourcePath}`, {});

                if (!response.ok) {
                    throw new Error('Failed to fetch image');
                }

                const json = await response.json();

                setJSON(json);
            } catch (err) {
                console.log("ERROR")

                setError(err.message)
            }
        }

        getJSON()
    }, [resourcePath]);

    useEffect(() => {
        console.log(json)
    }, [json])

    if (error) {
        return <div>Error fetching resource: {error}</div>;
    }

    if (!json) {
        return <div>Loading resource...</div>;
    }

    return <p>Component using JSON</p>;
}
