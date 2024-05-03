import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// this is used to merge our classnames in  tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
