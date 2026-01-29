export interface Position {
	x: number;
	y: number;
}

export interface Size {
	width: number;
	height: number;
}

export interface INote {
	id: string;
	_position?: Position;
	_size?: Size;
}

export type DragMode = "drag" | "resize" | null;
