import {useEffect} from "react";
import {useAtom} from "jotai";
import {notesAtom} from "../../store/atoms.ts";
import type {INote} from "../../types.ts";

export const useTrackNote = ({_position, _size, id}: INote) => {
	const [notes, setNotes] = useAtom(notesAtom);

	useEffect(() => {
		if (notes.some(note => note.id === id)) {
			setNotes(prev =>
				prev.map(note =>
					note.id === id
						? {...note, _position, _size}
						: note
				)
			);
		}
	}, [id, _position, setNotes, _size]);
}
