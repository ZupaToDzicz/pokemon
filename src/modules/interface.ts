// const sx: number = Number(getComputedStyle(document.documentElement).getPropertyValue("--x"));
// const sy: number = Number(getComputedStyle(document.documentElement).getPropertyValue("--y"));
export const size: number = Number(getComputedStyle(document.documentElement).getPropertyValue("--size"));

export interface Cords {
    x: number;
    y: number;
}