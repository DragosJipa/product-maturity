import React from "react";
import ProgressBar from "./ProgressBar";
export default function MetricCard({ title, value, label }) {
    return (
        <div className="bg-gray-800 rounded-lg p-4 shadow-md">
            <h3 className="text-sm text-gray-400 uppercase">{title}</h3>
            <div className="text-3xl font-bold text-purple-400">{value}</div>
            <div className="mt-2 text-gray-300 text-sm">{label}</div>
            <ProgressBar progress={value} />
        </div>
    );
}
