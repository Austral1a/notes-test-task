import {useRef, useState, useEffect, type RefObject} from "react";
import {useSetAtom} from "jotai";
import {notesAtom} from "../../store/atoms.ts";
import {useTrackNote} from "./useNote.tsx";
import type {INote, Position, Size, DragMode} from "../../types.ts";
import {rectanglesIntersect} from "./utils.ts";
import "./Note.css";

interface NoteProps extends INote {
	trashRef: RefObject<HTMLDivElement | null>;
}

export const Note = ({id, _position, _size, trashRef}: NoteProps) => {
	const setNotes = useSetAtom(notesAtom);
	const noteRef = useRef<HTMLDivElement>(null);

	const [position, setPosition] = useState<Position>({
		x: 100,
		y: 100,
		..._position,
	});

	const [size, setSize] = useState<Size>({
		width: 200,
		height: 150,
		..._size,
	});

	useTrackNote({_position: position, _size: size, id});

	const mode = useRef<DragMode>(null);
	const dragOffset = useRef<Position>({x: 0, y: 0});
	const resizeStart = useRef<Position & Size>({x: 0, y: 0, width: 0, height: 0});

	const startDragging = (e: PointerEvent) => {
		if (!noteRef.current) return;

		mode.current = "drag";
		dragOffset.current = {
			x: e.clientX - position.x,
			y: e.clientY - position.y,
		};

		noteRef.current.setPointerCapture(e.pointerId);
	};

	const startResizing = (e: PointerEvent) => {
		e.stopPropagation();
		if (!noteRef.current) return;

		mode.current = "resize";
		resizeStart.current = {
			x: e.clientX,
			y: e.clientY,
			width: size.width,
			height: size.height,
		};

		noteRef.current.setPointerCapture(e.pointerId);
	};

	const handlePointerMove = (e: PointerEvent) => {
		if (!mode.current) return;

		if (mode.current === "drag") {
			setPosition({
				x: e.clientX - dragOffset.current.x,
				y: e.clientY - dragOffset.current.y,
			});
		}

		if (mode.current === "resize") {
			const newWidth = resizeStart.current.width + (e.clientX - resizeStart.current.x);
			const newHeight = resizeStart.current.height + (e.clientY - resizeStart.current.y);

			setSize({
				width: Math.max(120, newWidth),
				height: Math.max(80, newHeight),
			});
		}
	};

	const handlePointerUp = () => {
		if (!mode.current) return;

		const noteRect = noteRef.current?.getBoundingClientRect();
		const trashRect = trashRef.current?.getBoundingClientRect();

		if (rectanglesIntersect(noteRect, trashRect)) {
			setNotes((prev) => prev.filter((note) => note.id !== id));
		}

		mode.current = null;
	};

	useEffect(() => {
		window.addEventListener("pointermove", handlePointerMove);
		window.addEventListener("pointerup", handlePointerUp);

		return () => {
			window.removeEventListener("pointermove", handlePointerMove);
			window.removeEventListener("pointerup", handlePointerUp);
		};
	}, []);

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
