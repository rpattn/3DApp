"use client"

import React from "react";
import { useDataContext } from "./DataContext";
import ProtectedResource from "./ProtectedResource";

export default function ManualPage() {

    const data = useDataContext()

    return (
        <div className="w-full h-full">
            <ProtectedResource resourcePath={data.resourcePath + '/page.html'} />
        </div>
    );
}
