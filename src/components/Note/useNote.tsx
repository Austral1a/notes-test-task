import {type RefObject, useEffect, useRef, useState} from "react";
import {useAtom} from "jotai";
import {notesAtom} from "../../store/atoms.ts";
import type {DragMode, INote, Position, Size} from "../../types.ts";
import {rectanglesIntersect} from "./utils.ts";
import {useSetAtom} from "jotai/index";

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

interface NoteHookArgs extends INote {
	trashRef: RefObject<HTMLDivElement | null>;
	noteRef: RefObject<HTMLDivElement | null>;
}

interface NoteHookResult {
	position: Position;
	size: Size;

	startDragging: (e: PointerEvent) => void;
	startResizing: (e: PointerEvent) => void;
}

export const useNote = ({_position, _size, id, trashRef, noteRef}: NoteHookArgs): NoteHookResult => {
	const setNotes = useSetAtom(notesAtom);

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
	const mode = useRef<DragMode>(null);
	const dragOffset = useRef<Position>({x: 0, y: 0});
	const resizeStart = useRef<Position & Size>({x: 0, y: 0, width: 0, height: 0});
	const positionRef = useRef(position);
	const sizeRef = useRef(size);

	useEffect(() => {
		positionRef.current = position;
		sizeRef.current = size;
	}, [position, size]);


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
		} else {
			setNotes((prev) =>
				prev.map((note) =>
					note.id === id
						? {...note, _position: positionRef.current, _size: sizeRef.current}
						: note
				)
			);
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

	return {
		startDragging,
		startResizing,
		size,
		position
	}
}
