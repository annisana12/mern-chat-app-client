import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const profileColors = [
    "bg-rose-600",
    "bg-pink-600",
    "bg-violet-600",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-orange-500"
];

export const getRandomProfileColor = () => {
    return profileColors[Math.floor(Math.random() * profileColors.length)];
}