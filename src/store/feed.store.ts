import { create } from "zustand";

type FeedFilterType = "ALL" | "ANNOUNCEMENT" | "CAMPAIGN";

interface FeedState {
  selectedFilter: FeedFilterType;
  setSelectedFilter: (filter: FeedFilterType) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  selectedFilter: "ALL",
  setSelectedFilter: (filter) => set({ selectedFilter: filter }),
}));
