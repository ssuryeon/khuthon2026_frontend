import {create} from "zustand";

type Store = {
    mode: string;
    selected: boolean;
    setMode: (arg0: string) => void;
    setSelected: () => void;
}

export const modeStore = create<Store>((set) => ({
    mode: '',
    selected: false,
    setMode: (newMode) => set({mode: newMode}),
    setSelected: () => set((state) => ({selected: !state.selected})),
}))

type userStore = {
    user_id: number;
    setUserId: (arg0: number) => void;
}

export const userStore = create<userStore>((set) => ({
    user_id: null,
    setUserId: (newId) => set({user_id: newId})
}))