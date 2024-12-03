import { create } from "zustand";

interface IEventStats {
    totalAttendees: number;
    totalEvents: number;
}

interface IEventStatsStore {
    stats: IEventStats | null;
    setStats: (stats: IEventStats) => void;
}

const useEventStatsStore = create<IEventStatsStore>((set) => ({
    stats: null,
    setStats: (stats) => set(() => ({ stats })),
}));

export default useEventStatsStore;