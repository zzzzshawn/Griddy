import { create } from "zustand"

interface ImageData {
    imageUrl: string | null;
    prompt: string | null;
}

interface Imagestate {
    data: ImageData;
    setData: (newData: Partial<ImageData>) => void;
}

export const useImageStore = create<Imagestate>((set) => ({
    data: {
        imageUrl: null,
        prompt: null
    },
    setData: (newData) => 
        set((state) => ({
            data: {
                ...state.data,
                ...newData
            }
        }))
}))