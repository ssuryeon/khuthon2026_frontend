import {create} from "zustand";
import { persist } from "zustand/middleware";

type Store = {
    mode: string;
    selected: boolean;
    setMode: (arg0: string) => void;
    setSelected: (val?: boolean) => void;
}

export const modeStore = create<Store>()(
    persist(
        (set) => ({
            mode: '',
            selected: false,
            setMode: (newMode) => set({mode: newMode}),
            setSelected: (val) => set((state) => ({selected: val !== undefined ? val : !state.selected})),
        }),
        {
            name: 'mode-store',
        }
    )
)

type userStore = {
    user_id: number | null;
    setUserId: (arg0: number | null) => void;
}

export const userStore = create<userStore>((set) => ({
    user_id: null,
    setUserId: (newId) => set({user_id: newId})
}))