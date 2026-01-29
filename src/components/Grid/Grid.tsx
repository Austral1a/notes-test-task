import {useRef} from "react";
import {Note} from "../Note/Note.tsx";
import {useAtom} from "jotai";
import {notesAtom} from "../../store/atoms.ts";
import './Grid.css'

export default function Grid() {
	const trashRef = useRef<HTMLDivElement | null>(null);

	const [notes, setNotes] = useAtom(notesAtom)

	return (
		<div className="grid">
			<button onClick={() => {
				setNotes(() => [...notes, {id: Date.now().toString()}])
			}}>Create a new note
			</button>

			{notes.map(note => {
				return <Note trashRef={trashRef} {...note} key={note.id}/>
			})}

			<div id="trash" ref={trashRef} className="remove-area">
				Remove note
			</div>
		</div>
	);
}
