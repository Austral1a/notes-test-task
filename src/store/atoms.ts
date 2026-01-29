import type {INote} from "../types.ts";
import {atomWithStorage} from "jotai/utils";

export const notesAtom = atomWithStorage<INote[]>("notes", [])
