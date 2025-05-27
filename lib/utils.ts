
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getAllServices } from "./k8s"
import fs from "fs"
import { Service } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
