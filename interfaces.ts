interface IPlayingPiece {
	getId(): string;
	getTextDescription(): string;
}

interface IPlayingPieceFactory {
	createInstance(): IPlayingPiece;
}

interface IPreviewablePlayingPieceFactory extends IPlayingPieceFactory {
	preview(): IPlayingPiece;
}

export { IPlayingPiece, IPlayingPieceFactory, IPreviewablePlayingPieceFactory };