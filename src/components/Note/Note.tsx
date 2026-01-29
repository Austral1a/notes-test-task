import {type RefObject, useRef} from "react";
import {useNote, useTrackNote} from "./useNote.tsx";
import type {INote} from "../../types.ts";
import "./Note.css";

interface NoteProps extends INote {
	trashRef: RefObject<HTMLDivElement | null>;
}

export const Note = (props: NoteProps) => {
	const noteRef = useRef<HTMLDivElement>(null);

	const {startDragging, startResizing, position, size} = useNote({...props, noteRef})
	useTrackNote(props);

	return (
		<div
			ref={noteRef}
			className="note"
			onPointerDown={startDragging}
			style={{
				left: `${position.x}px`,
				top: `${position.y}px`,
				width: `${size.width}px`,
				height: `${size.height}px`,
			}}
		>
			<p>Temp text</p>

			<div
				className="note__resize-handle"
				onPointerDown={startResizing}
			/>
		</div>
	);
};
