"use client"
import React, { useEffect } from "react";
import useEventStatsStore from "@/stores/event-store";
import { fetchEventStats } from "@/components/adminDashboard/reporting/utils/fetchEvent";

const OrganizerStats = () => {
    const { stats, setStats } = useEventStatsStore();

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchEventStats();
                setStats(data);
            } catch (error) {
                console.error("Error fetching event stats:", error);
            }
        };

        loadStats();
    }, [setStats]);

    if (!stats) return <div>Loading...</div>;

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-500 text-white rounded-md p-4 shadow-md flex flex-col items-center">
                <h3 className="text-xl font-bold">Attendees</h3>
                <p className="text-4xl font-bold">{stats.totalAttendees}</p>
                <p className="text-sm">Tickets Sold</p>
            </div>
            <div className="bg-blue-500 text-white rounded-md p-4 shadow-md flex flex-col items-center">
                <h3 className="text-xl font-bold">Events</h3>
                <p className="text-4xl font-bold">{stats.totalEvents}</p>
                <p className="text-sm">Created</p>
            </div>
        </div>
    );
};

export default OrganizerStats;