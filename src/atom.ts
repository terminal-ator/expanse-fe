import { atom } from "jotai";
import { Category } from "./types";

export const categoryAtom = atom<Category | null>(null);
