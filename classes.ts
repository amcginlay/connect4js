/// <reference path="./typings/index.d.ts" />
import * as _ from 'lodash';

import { CONNECTED_PIECES_TO_WIN } from './constants';
import { DirectionEnum, GameStateEnum} from './enums';
import { IPlayingPiece, IPlayingPieceFactory, IPreviewablePlayingPieceFactory } from './interfaces';

class EnumEx {
    // http://stackoverflow.com/questions/21293063/how-to-programmatically-enumerate-an-enum-type-in-typescript-0-9-5
	static getNamesAndValues(e: any) {
        return this.getNames(e).map(n => { return { name: n, value: e[n] as number }; });
    }
    static getNames(e: any): string[] {
        return this.getObjValues(e).filter(v => typeof v === "string") as string[];
    }
    
	static getValues(e: any): number[] {
        return this.getObjValues(e).filter(v => typeof v === "number") as number[];
    }
    
	private static getObjValues(e: any): (number | string)[] {
        return Object.keys(e).map(k => e[k]);
    }
}

class Coords {
	public constructor(public xCoord: number, public yCoord: number) {
	}
	
	public get x(): number {
		return this.xCoord;
	}
	
	public get y(): number {
		return this.yCoord;
	}
}

class CoordsNavigationService {
	
	public move(from: Coords, direction: DirectionEnum): Coords {
		return new Coords(from.x + this.getIncrementX(direction), from.y + this.getIncrementY(direction));
	}

	private getIncrementX(direction: DirectionEnum): number {
		return this.getIncrement(direction, true);
	}

	private getIncrementY(direction: DirectionEnum): number {
		return this.getIncrement(direction, false);
	}

	private getIncrement(direction: DirectionEnum, isXDimension: boolean): number {
		switch(direction) {
			case DirectionEnum.EAST: return isXDimension ? +1 : +0;
			case DirectionEnum.WEST: return isXDimension ? -1 : +0;
			case DirectionEnum.NORTH: return isXDimension ? +0 : +1;
			case DirectionEnum.SOUTH: return isXDimension ? +0 : -1;
			case DirectionEnum.NORTHEAST: return isXDimension ? +1 : +1;
			case DirectionEnum.NORTHWEST: return isXDimension ? -1 : +1;
			case DirectionEnum.SOUTHEAST: return isXDimension ? +1 : -1;
			case DirectionEnum.SOUTHWEST: return isXDimension ? -1 : -1;
		}
	}

	public getOpposite(direction: DirectionEnum): DirectionEnum {
		switch(direction) {
			case DirectionEnum.EAST: return DirectionEnum.WEST;
			case DirectionEnum.WEST: return DirectionEnum.EAST;
			case DirectionEnum.NORTH: return DirectionEnum.SOUTH;
			case DirectionEnum.SOUTH: return DirectionEnum.NORTH;
			case DirectionEnum.NORTHEAST: return DirectionEnum.SOUTHWEST;
			case DirectionEnum.NORTHWEST: return DirectionEnum.SOUTHEAST;
			case DirectionEnum.SOUTHEAST: return DirectionEnum.NORTHWEST;
			case DirectionEnum.SOUTHWEST: return DirectionEnum.NORTHEAST;
			default: throw new Error("Illegal State");
		}
	}
}

abstract class PlayingPiece implements IPlayingPiece {
	public constructor(protected _id: number) {
	}
		
	public abstract getId(): string
	public abstract getTextDescription(): string
}

class P1PlayingPiece extends PlayingPiece {
	public constructor(id: number) {
		super(id);
	}

	public getId(): string {
		return "P1PlayingPiece:" + this._id;
	}

	public getTextDescription(): string {
		return "Player One";
	}
}

class P2PlayingPiece extends PlayingPiece {
	public constructor(id: number) {
		super(id);
	}

	public getId(): string {
		return "P2PlayingPiece:" + this._id;
	}

	public getTextDescription(): string {
		return "Player Two";
	}
}

class P1PlayingPieceFactory implements IPlayingPieceFactory {
	private _nextId: number = 0;
	public createInstance(): IPlayingPiece {
		return new P1PlayingPiece(this._nextId++);
	}
}

class P2PlayingPieceFactory implements IPlayingPieceFactory {
	private _nextId: number = 0;
	public createInstance(): IPlayingPiece {
		return new P2PlayingPiece(this._nextId++);
	}
}

class PreviewablePlayingPieceFactory implements IPreviewablePlayingPieceFactory {

	private _next: IPlayingPiece = null;
	
	public constructor(private _playingPieceFactory: IPlayingPieceFactory) {
	}

	public createInstance(): IPlayingPiece {
		let result = null;		
		if (this._next != null) {
			result = this._next;
		} else {			
			result = this._playingPieceFactory.createInstance();
		}
	 	this._next = null;
		return result;
	}

	public preview(): IPlayingPiece {
	if (this._next === null) {
		this._next = this._playingPieceFactory.createInstance();
	}
		return this._next;
	}
}

class PlayingBoardDimensions {

	private _x: number;
	private _y: number;
	
	public constructor(x: number, y: number) {
		
		if (x < 1 || y < 1 || 
		    x % 1 != 0 || y % 1 != 0)
			throw new Error("Illegal Argument");
		
		this._x = x;
		this._y = y;
	}
	
	public get x(): number {
		return this._x;
	}

	public get y(): number {
		return this._y;
	}
}

class ConnectFourPlayingBoardDimensions extends PlayingBoardDimensions {
	public constructor() {
		super(7, 6);
	}
}

class PlayingBoard {

	private grid: Array<Array<IPlayingPiece>>;
	
	public constructor(private _playingBoardDimensions: PlayingBoardDimensions) {
		this.grid = new Array<Array<IPlayingPiece>>(this._playingBoardDimensions.x);
		for (let i = 0; i < this._playingBoardDimensions.x; i++) {
			this.grid[i] = new Array<IPlayingPiece>(this._playingBoardDimensions.y);
		}
	}

	public get sizeX(): number {
		return this._playingBoardDimensions.x;
	}

	public get sizeY(): number {
		return this._playingBoardDimensions.y;
	}
	
	public isInBounds(coords: Coords): boolean {
		let x = coords.x;
		let y = coords.y;
		if (x < 1 || y < 1 || x > this.sizeX || y > this.sizeY) {
			return false;
		}
		return true;
	}

	public setPieceAt(playingPiece: IPlayingPiece, coords: Coords): void {
	// 	requireNonNull(playingPiece, "playingPiece");
	// 	requireNonNull(coords, "coords");
		
	if (!this.isInBounds(coords))
		throw new Error("Illegal Argument");
		
		let x = coords.x;
		let y = coords.y;
		this.grid[x - 1][y - 1] = playingPiece;
	}

	public getPieceAt(coords: Coords): IPlayingPiece {
	// 	requireNonNull(coords, "coords");

		if (!this.isInBounds(coords))
			throw new Error("Illegal Argument");
			
		let x = coords.x;
		let y = coords.y;
		return this.grid[x - 1][y - 1];
	}
}

class PlayingBoardReader {

	public constructor(private _playingBoard: PlayingBoard) {
	}

	public get sizeX(): number {
		return this._playingBoard.sizeX;
	}

	public get sizeY(): number {
		return this._playingBoard.sizeY;
	}
	
	public getPieceAt(coords: Coords): IPlayingPiece {
		return this._playingBoard.getPieceAt(coords);
	}

}

class ConnectSolutionService {
	
	private _connectedPiecesToWin: number

	public constructor(
			private _playingBoard: PlayingBoard, 
			private _coordsNavigationService: CoordsNavigationService,
			connectedPiecesToWin: number) {
	// requireNonNull(playingBoard, "playingBoard");
	// requireNonNull(coordinatesNavigationService, "coordinateNavigationService");

		if (connectedPiecesToWin <= 0)
			throw new Error("Illegal Argument");

		this._connectedPiecesToWin = connectedPiecesToWin;
	}

	public solve(): Array<Array<IPlayingPiece>> {
		let results = null;
		for (let x = 1; x <= this._playingBoard.sizeX; x++) {
	 		for (let y = 1; y <= this._playingBoard.sizeY; y++) {
				// based upon (x,y) potentially representing the end-point of a solution,
				// navigate in each of our eight directions on the board to discover if a solution exists				
				for (let directionValue in EnumEx.getValues(DirectionEnum)) {
					let direction = DirectionEnum[DirectionEnum[directionValue]];					
					let foundSolution = this.solveInternal(new Coords(x, y), direction);					
	 				if (foundSolution != null) {
						// sort all solutions so we can check for duplicates
						foundSolution.sort((a, b) => {
								if (a.getId() < b.getId()) return -1;
								if (a.getId() > b.getId()) return 1;
								return 0;
							});
														
						// initialise results, if not done so already
						if (results === null) {
							results = new Array<Array<IPlayingPiece>>();
						}
						
						// solutions will be reported in both directions
						// if this one's not a dupe then add to the results but keep looking, there could be more ...
						let found = false;
						for (let key in results) {
							if (_.isEqual(key, foundSolution)) {
								found = true;
								break;
							}
						}
						if (!found) {
							results.push(foundSolution);
						}
					}
				}
			}
		}
		return results;		
	}

	private solveInternal(coords: Coords, direction: DirectionEnum): Array<IPlayingPiece> {
	// only endpoints can form the start of a solution so discard all others
	if (!this.isEndpoint(coords, direction)) {
		return null;
	}
		
		// build the sequence beginning with the endpoint
		let firstPiece = this._playingBoard.getPieceAt(coords);		
		if (firstPiece === null) {
			return null;
		}
		
		let results = new Array<IPlayingPiece>();
		results.push(firstPiece);
		
		while(true) {
			// find next coords in chosen direction
			coords = this._coordsNavigationService.move(coords, direction);
			// if it's out of bounds abort while loop
			if (!this._playingBoard.isInBounds(coords)) {
				break;
			}
			
			// if no piece at coords abort while loop 
			let nextPiece = this._playingBoard.getPieceAt(coords);
			if (nextPiece === null) {
				break;
			}
			
			// if no type match for this piece abort while loop
			if (nextPiece.constructor !== firstPiece.constructor) {
				break;
			}
			
			// if we got here, add the found piece to results and resume the while loop
			results.push(nextPiece);
		}
		
		if (results.length < this._connectedPiecesToWin) {
			results = null; // a sequence was found but it's not big enough to win so discard it
		}
		return results;
	}

	private isEndpoint(coords: Coords, direction: DirectionEnum): boolean {
		// It's important to know if any coords is an endpoint so we can 
		// be sure we're counting the sequence length accurately
		// NOTE it's possible to be a sequence of one and still be an endpoint
					
		// if coordinate out of bounds it cannot be an endpoint
		if (!this._playingBoard.isInBounds(coords)) {
			return false;
		}
			
		// if no piece at coordinate it cannot be an endpoint
		let piece = this._playingBoard.getPieceAt(coords);
		if (piece === null) {
			return false;
		}
			
		// piece exists - if opposite neighbour coordinate out of bounds it must be an endpoint
		let directionOpposite = this._coordsNavigationService.getOpposite(direction);
		let oppositeNeighbourCoord = this._coordsNavigationService.move(coords, directionOpposite);
		if (!this._playingBoard.isInBounds(oppositeNeighbourCoord)) {
			return true;
		}		
		
		// if opposite neighbour is NULL it must be an endpoint
		let oppositeNeighbourPiece = this._playingBoard.getPieceAt(oppositeNeighbourCoord);
		if (oppositeNeighbourPiece === null) {
			return true;
		}
		
		// opposite neighbour exists - if types match it cannot be considered an endpoint in this direction
		if (oppositeNeighbourPiece.constructor === piece.constructor) {
			return false;
		}
		
		// otherwise, types must differ and it is an endpoint
		return true;
	}
}

class AlternatingPlayingPieceFactory implements IPlayingPieceFactory {
	
	private _isFactoryOneCreatingNext: boolean;
	
	public constructor(private _factoryOne: IPlayingPieceFactory, private _factoryTwo: IPlayingPieceFactory) {
		this._isFactoryOneCreatingNext = true;
	}

	public createInstance(): IPlayingPiece {
		let result = null;
		if (this._isFactoryOneCreatingNext) {
			result = this._factoryOne.createInstance();
		} else {
			result = this._factoryTwo.createInstance();
		}
		this._isFactoryOneCreatingNext = !this._isFactoryOneCreatingNext;
		return result;
	}
}

class ConnectFourPlayingService {

	//private /*const*/ CONNECTED_PIECES_TO_WIN = 4;

	private _gameState: GameStateEnum; // NOTE use getter and setter to access this private member variable

	public static createPlayingBoard(): PlayingBoard {
		return new PlayingBoard(new ConnectFourPlayingBoardDimensions());
	}

	public static createPreviewablePlayingPieceFactory(p1PlayerStarts: boolean): IPreviewablePlayingPieceFactory {
		let p1PlayingPieceFactory = new P1PlayingPieceFactory();
		let p2PlayingPieceFactory = new P2PlayingPieceFactory();
		let alternatingPlayingPieceFactory = new AlternatingPlayingPieceFactory(
				p1PlayerStarts ? p1PlayingPieceFactory : p2PlayingPieceFactory,
				p1PlayerStarts ? p2PlayingPieceFactory : p1PlayingPieceFactory);
		return new PreviewablePlayingPieceFactory(alternatingPlayingPieceFactory);
	}

	public constructor(
			private _playingBoard: PlayingBoard, 
			private _playingPieceFactory: IPreviewablePlayingPieceFactory,
			private _connectSolutionService: ConnectSolutionService) {
	// 	requireNonNull(playingBoard, "playingBoard");
	// 	requireNonNull(playingPieceFactory, "playingPieceFactory");
	// 	requireNonNull(connectSolutionService, "connectSolutionService");
		this.initialiseGameState();
	}

	private initialiseGameState(): void {
		this._gameState = GameStateEnum.IN_PROGRESS;
	}
	
	private getGameState(): GameStateEnum {
		if (this._gameState === GameStateEnum.IN_PROGRESS) {
			// if game is IN_PROGRESS, check if game is OVER
			if (this.isPlayingBoardFull()) {
				this.setGameState(GameStateEnum.OVER);
			}
			let winningSequences = this.getWinningSequences();
			if (winningSequences !== null) {
				this.setGameState(GameStateEnum.OVER);
			}
		}
		return this._gameState;
	}
	
	private setGameState(gameState: GameStateEnum):void {
		// OVER and ABORTED are end-states, so we reject any 
		// attempt to modify the game state unless it's IN_PROGRESS
		if (this._gameState !== GameStateEnum.IN_PROGRESS)
			throw new Error("Illegal Argument");
		
		this._gameState = gameState;
	}
	
	public getNextPlayerName(): string {
		return this._playingPieceFactory.preview().getTextDescription();
	}

	public takeTurnString(stringMove: string): void {
		if (stringMove === null) {
			throw new Error("Illegal Argument");
		}

		if (stringMove.trim().toLowerCase() === "q") {
			// abort
			this.setGameState(GameStateEnum.ABORTED);
			return;
		}
			
		let intMove = parseInt(stringMove);
		if (isNaN(intMove)) {
			throw new Error("Illegal Move")
		}
		this.takeTurnNumber(intMove);
	}

	public takeTurnNumber(x: number) {
		if (this.getGameState() !== GameStateEnum.IN_PROGRESS)
			throw new Error("Illegal Move");
		
		if (x < 1 || x > this._playingBoard.sizeX)
			throw new Error("Illegal Move");

		let piecesInColumnX = this.getColumnUsageCount(x);
		if (piecesInColumnX >= this._playingBoard.sizeY)
			throw new Error("Illegal Move");

		let y = piecesInColumnX + 1;
		this.takeTurnCoords(new Coords(x, y));
	}
	
	public getIsInProgress(): boolean {
		return (this.getGameState() == GameStateEnum.IN_PROGRESS);
	}
	
	public getIsGameOver():boolean {
		return (this.getGameState() == GameStateEnum.OVER);
	}

	public getIsGameAborted():boolean {
		return (this.getGameState() == GameStateEnum.ABORTED);
	}

	public getWinningSequences(): Array<Array<IPlayingPiece>> {
		return this._connectSolutionService.solve();
	}

	public getPlayingBoardReader(): PlayingBoardReader {
		return new PlayingBoardReader(this._playingBoard);
	}

	private takeTurnCoords(coords: Coords): void {
		let playingPiece = this._playingPieceFactory.createInstance();
		this._playingBoard.setPieceAt(playingPiece, coords);
	}

	private getColumnUsageCount(x: number): number {
		let result = 0;
		for (let y = 1; y <= this._playingBoard.sizeY; y++) {
			if (this._playingBoard.getPieceAt(new Coords(x, y)) != null) {
				result++;
			}
		}
		return result;
	}

	private isPlayingBoardFull(): boolean {
		for (let y = 1; y <= this._playingBoard.sizeY; y++) {
			for (let x = 1; x <= this._playingBoard.sizeX; x++) {
				if (this._playingBoard.getPieceAt(new Coords(x, y)) === null) {
					return false;
				}
			}
		}
		return true;
	}

	public getWinner(): IPlayingPiece {
		let winningSequences = this.getWinningSequences();
		if (winningSequences === null) return null;			
		if (winningSequences.length === 0) return null;			
		if (winningSequences[0].length === 0) return null;			
		return winningSequences[0][0];
	}
}

class ConnectFourPlayingServiceFactory {

	private _p1PlayerStarts: boolean;
	
	public constructor() {
		this._p1PlayerStarts = false;
	}
	
	public createInstance(): ConnectFourPlayingService {
		this._p1PlayerStarts = !this._p1PlayerStarts; // alternate the starting player upon each invocation
		let playingBoard = ConnectFourPlayingService.createPlayingBoard();
		let playingPieceFactory = ConnectFourPlayingService.createPreviewablePlayingPieceFactory(this._p1PlayerStarts);
		let coordsNavigationService = new CoordsNavigationService();
		let connectSolutionService = new ConnectSolutionService(playingBoard, coordsNavigationService, /*ConnectFourPlayingService.*/CONNECTED_PIECES_TO_WIN);
		
		return new ConnectFourPlayingService(playingBoard, playingPieceFactory, connectSolutionService);
	}

}

class ConnectFourScoreKeeperService {

	private _playerOneScore: number = 0;
	private _playerTwoScore: number = 0;
	
	public get playerOneScore() {
		return this._playerOneScore;
	}

	public get playerTwoScore() {
		return this._playerTwoScore;
	}

	public updateScore(winner: IPlayingPiece): void {
		if (winner instanceof P1PlayingPiece) {
			this._playerOneScore++;
		} else { // P2PlayingPiece
			this._playerTwoScore++;
		}
	}
}

export { ConnectFourPlayingServiceFactory };