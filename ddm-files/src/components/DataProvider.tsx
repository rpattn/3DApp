"use client"

import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import DataContext from "./DataContext";

interface DataProviderProps {
    children: ReactNode
    resourcePath: string 
}

export interface inspPageDataTypes {
    inspData: Array<object>,
    allPoints: Array<object>,
    rootPoints: Array<object>,
    rootPointsAll: Array<object>,
}

export const DataProvider: FC<DataProviderProps> = ({ children, resourcePath }) => {
    
    const [data, setData] = useState<inspPageDataTypes | string>("null");
    const [error, setError] = useState(null);

    const contextValue = useMemo(()=> ({
        data: data,
        resourcePath
    }),[data, resourcePath])

    useEffect(() => {

        async function getJSON() {
            try {
                const response = await fetch(`/api/getFile?url=${resourcePath}/data.json`, {});

                if (!response.ok) {
                    throw new Error('Failed to fetch resource');
                }

                const json = await response.json();

                setData(json);
            } catch (err: any) {
                console.log("ERROR")

                setError(err.message)
            }
        }

        getJSON()
    }, []);

    if (error) {
        return <div>Error fetching resource</div>;
    }

    return (
        <DataContext.Provider value={contextValue}>
            {data !== "null"? children : "Loading..."}
        </DataContext.Provider>
    );
};