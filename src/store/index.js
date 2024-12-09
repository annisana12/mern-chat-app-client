import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createAuthSlice } from "./slices/auth_slice";

export const useAppStore = create(
    // Integrate with redux devtools
    devtools(
        (...a) => ({
            ...createAuthSlice(...a)
        })
    )
)