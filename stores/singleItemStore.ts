import { create } from "zustand";

interface SingleItemState {
  showFavoritesIcon: boolean;
  setShowFavoritesIcon: (show: boolean) => void;
}

const useSingleItemStore = create<SingleItemState>((set) => ({
  showFavoritesIcon: true, //initial state: show the icon
  setShowFavoritesIcon: (show) => set({ showFavoritesIcon: show }),
}));

export default useSingleItemStore;
