import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const profileColors = [
    "rose-600",
    "pink-600",
    "violet-600",
    "blue-500",
    "emerald-500",
    "orange-500"
];

export const getRandomProfileColor = () => {
    return profileColors[Math.floor(Math.random() * profileColors.length)];
}