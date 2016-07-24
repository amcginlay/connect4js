"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="./typings/index.d.ts" />
var _ = require('lodash');
var constants_1 = require('./constants');
var enums_1 = require('./enums');
var EnumEx = (function () {
    function EnumEx() {
    }
    // http://stackoverflow.com/questions/21293063/how-to-programmatically-enumerate-an-enum-type-in-typescript-0-9-5
    EnumEx.getNamesAndValues = function (e) {
        return this.getNames(e).map(function (n) { return { name: n, value: e[n] }; });
    };
    EnumEx.getNames = function (e) {
        return this.getObjValues(e).filter(function (v) { return typeof v === "string"; });
    };
    EnumEx.getValues = function (e) {
        return this.getObjValues(e).filter(function (v) { return typeof v === "number"; });
    };
    EnumEx.getObjValues = function (e) {
        return Object.keys(e).map(function (k) { return e[k]; });
    };
    return EnumEx;
}());
var Coords = (function () {
    function Coords(xCoord, yCoord) {
        this.xCoord = xCoord;
        this.yCoord = yCoord;
    }
    Object.defineProperty(Coords.prototype, "x", {
        get: function () {
            return this.xCoord;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Coords.prototype, "y", {
        get: function () {
            return this.yCoord;
        },
        enumerable: true,
        configurable: true
    });
    return Coords;
}());
var CoordsNavigationService = (function () {
    function CoordsNavigationService() {
    }
    CoordsNavigationService.prototype.move = function (from, direction) {
        return new Coords(from.x + this.getIncrementX(direction), from.y + this.getIncrementY(direction));
    };
    CoordsNavigationService.prototype.getIncrementX = function (direction) {
        return this.getIncrement(direction, true);
    };
    CoordsNavigationService.prototype.getIncrementY = function (direction) {
        return this.getIncrement(direction, false);
    };
    CoordsNavigationService.prototype.getIncrement = function (direction, isXDimension) {
        switch (direction) {
            case enums_1.DirectionEnum.EAST: return isXDimension ? +1 : +0;
            case enums_1.DirectionEnum.WEST: return isXDimension ? -1 : +0;
            case enums_1.DirectionEnum.NORTH: return isXDimension ? +0 : +1;
            case enums_1.DirectionEnum.SOUTH: return isXDimension ? +0 : -1;
            case enums_1.DirectionEnum.NORTHEAST: return isXDimension ? +1 : +1;
            case enums_1.DirectionEnum.NORTHWEST: return isXDimension ? -1 : +1;
            case enums_1.DirectionEnum.SOUTHEAST: return isXDimension ? +1 : -1;
            case enums_1.DirectionEnum.SOUTHWEST: return isXDimension ? -1 : -1;
        }
    };
    CoordsNavigationService.prototype.getOpposite = function (direction) {
        switch (direction) {
            case enums_1.DirectionEnum.EAST: return enums_1.DirectionEnum.WEST;
            case enums_1.DirectionEnum.WEST: return enums_1.DirectionEnum.EAST;
            case enums_1.DirectionEnum.NORTH: return enums_1.DirectionEnum.SOUTH;
            case enums_1.DirectionEnum.SOUTH: return enums_1.DirectionEnum.NORTH;
            case enums_1.DirectionEnum.NORTHEAST: return enums_1.DirectionEnum.SOUTHWEST;
            case enums_1.DirectionEnum.NORTHWEST: return enums_1.DirectionEnum.SOUTHEAST;
            case enums_1.DirectionEnum.SOUTHEAST: return enums_1.DirectionEnum.NORTHWEST;
            case enums_1.DirectionEnum.SOUTHWEST: return enums_1.DirectionEnum.NORTHEAST;
            default: throw new Error("Illegal State");
        }
    };
    return CoordsNavigationService;
}());
var PlayingPiece = (function () {
    function PlayingPiece(_id) {
        this._id = _id;
    }
    return PlayingPiece;
}());
var P1PlayingPiece = (function (_super) {
    __extends(P1PlayingPiece, _super);
    function P1PlayingPiece(id) {
        _super.call(this, id);
    }
    P1PlayingPiece.prototype.getId = function () {
        return "P1PlayingPiece:" + this._id;
    };
    P1PlayingPiece.prototype.getTextDescription = function () {
        return "Player One";
    };
    return P1PlayingPiece;
}(PlayingPiece));
var P2PlayingPiece = (function (_super) {
    __extends(P2PlayingPiece, _super);
    function P2PlayingPiece(id) {
        _super.call(this, id);
    }
    P2PlayingPiece.prototype.getId = function () {
        return "P2PlayingPiece:" + this._id;
    };
    P2PlayingPiece.prototype.getTextDescription = function () {
        return "Player Two";
    };
    return P2PlayingPiece;
}(PlayingPiece));
var P1PlayingPieceFactory = (function () {
    function P1PlayingPieceFactory() {
        this._nextId = 0;
    }
    P1PlayingPieceFactory.prototype.createInstance = function () {
        return new P1PlayingPiece(this._nextId++);
    };
    return P1PlayingPieceFactory;
}());
var P2PlayingPieceFactory = (function () {
    function P2PlayingPieceFactory() {
        this._nextId = 0;
    }
    P2PlayingPieceFactory.prototype.createInstance = function () {
        return new P2PlayingPiece(this._nextId++);
    };
    return P2PlayingPieceFactory;
}());
var PreviewablePlayingPieceFactory = (function () {
    function PreviewablePlayingPieceFactory(_playingPieceFactory) {
        this._playingPieceFactory = _playingPieceFactory;
        this._next = null;
    }
    PreviewablePlayingPieceFactory.prototype.createInstance = function () {
        var result = null;
        if (this._next != null) {
            result = this._next;
        }
        else {
            result = this._playingPieceFactory.createInstance();
        }
        this._next = null;
        return result;
    };
    PreviewablePlayingPieceFactory.prototype.preview = function () {
        if (this._next === null) {
            this._next = this._playingPieceFactory.createInstance();
        }
        return this._next;
    };
    return PreviewablePlayingPieceFactory;
}());
var PlayingBoardDimensions = (function () {
    function PlayingBoardDimensions(x, y) {
        if (x < 1 || y < 1 ||
            x % 1 != 0 || y % 1 != 0)
            throw new Error("Illegal Argument");
        this._x = x;
        this._y = y;
    }
    Object.defineProperty(PlayingBoardDimensions.prototype, "x", {
        get: function () {
            return this._x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayingBoardDimensions.prototype, "y", {
        get: function () {
            return this._y;
        },
        enumerable: true,
        configurable: true
    });
    return PlayingBoardDimensions;
}());
var ConnectFourPlayingBoardDimensions = (function (_super) {
    __extends(ConnectFourPlayingBoardDimensions, _super);
    function ConnectFourPlayingBoardDimensions() {
        _super.call(this, 7, 6);
    }
    return ConnectFourPlayingBoardDimensions;
}(PlayingBoardDimensions));
var PlayingBoard = (function () {
    function PlayingBoard(_playingBoardDimensions) {
        this._playingBoardDimensions = _playingBoardDimensions;
        this.grid = new Array(this._playingBoardDimensions.x);
        for (var i = 0; i < this._playingBoardDimensions.x; i++) {
            this.grid[i] = new Array(this._playingBoardDimensions.y);
        }
    }
    Object.defineProperty(PlayingBoard.prototype, "sizeX", {
        get: function () {
            return this._playingBoardDimensions.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayingBoard.prototype, "sizeY", {
        get: function () {
            return this._playingBoardDimensions.y;
        },
        enumerable: true,
        configurable: true
    });
    PlayingBoard.prototype.isInBounds = function (coords) {
        var x = coords.x;
        var y = coords.y;
        if (x < 1 || y < 1 || x > this.sizeX || y > this.sizeY) {
            return false;
        }
        return true;
    };
    PlayingBoard.prototype.setPieceAt = function (playingPiece, coords) {
        // 	requireNonNull(playingPiece, "playingPiece");
        // 	requireNonNull(coords, "coords");
        if (!this.isInBounds(coords))
            throw new Error("Illegal Argument");
        var x = coords.x;
        var y = coords.y;
        this.grid[x - 1][y - 1] = playingPiece;
    };
    PlayingBoard.prototype.getPieceAt = function (coords) {
        // 	requireNonNull(coords, "coords");
        if (!this.isInBounds(coords))
            throw new Error("Illegal Argument");
        var x = coords.x;
        var y = coords.y;
        return this.grid[x - 1][y - 1];
    };
    return PlayingBoard;
}());
var PlayingBoardReader = (function () {
    function PlayingBoardReader(_playingBoard) {
        this._playingBoard = _playingBoard;
    }
    Object.defineProperty(PlayingBoardReader.prototype, "sizeX", {
        get: function () {
            return this._playingBoard.sizeX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayingBoardReader.prototype, "sizeY", {
        get: function () {
            return this._playingBoard.sizeY;
        },
        enumerable: true,
        configurable: true
    });
    PlayingBoardReader.prototype.getPieceAt = function (coords) {
        return this._playingBoard.getPieceAt(coords);
    };
    return PlayingBoardReader;
}());
var ConnectSolutionService = (function () {
    function ConnectSolutionService(_playingBoard, _coordsNavigationService, connectedPiecesToWin) {
        // requireNonNull(playingBoard, "playingBoard");
        // requireNonNull(coordinatesNavigationService, "coordinateNavigationService");
        this._playingBoard = _playingBoard;
        this._coordsNavigationService = _coordsNavigationService;
        if (connectedPiecesToWin <= 0)
            throw new Error("Illegal Argument");
        this._connectedPiecesToWin = connectedPiecesToWin;
    }
    ConnectSolutionService.prototype.solve = function () {
        var results = null;
        for (var x = 1; x <= this._playingBoard.sizeX; x++) {
            for (var y = 1; y <= this._playingBoard.sizeY; y++) {
                // based upon (x,y) potentially representing the end-point of a solution,
                // navigate in each of our eight directions on the board to discover if a solution exists				
                for (var directionValue in EnumEx.getValues(enums_1.DirectionEnum)) {
                    var direction = enums_1.DirectionEnum[enums_1.DirectionEnum[directionValue]];
                    var foundSolution = this.solveInternal(new Coords(x, y), direction);
                    if (foundSolution != null) {
                        // sort all solutions so we can check for duplicates
                        foundSolution.sort(function (a, b) {
                            if (a.getId() < b.getId())
                                return -1;
                            if (a.getId() > b.getId())
                                return 1;
                            return 0;
                        });
                        // initialise results, if not done so already
                        if (results === null) {
                            results = new Array();
                        }
                        // solutions will be reported in both directions
                        // if this one's not a dupe then add to the results but keep looking, there could be more ...
                        var found = false;
                        for (var key in results) {
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
    };
    ConnectSolutionService.prototype.solveInternal = function (coords, direction) {
        // only endpoints can form the start of a solution so discard all others
        if (!this.isEndpoint(coords, direction)) {
            return null;
        }
        // build the sequence beginning with the endpoint
        var firstPiece = this._playingBoard.getPieceAt(coords);
        if (firstPiece === null) {
            return null;
        }
        var results = new Array();
        results.push(firstPiece);
        while (true) {
            // find next coords in chosen direction
            coords = this._coordsNavigationService.move(coords, direction);
            // if it's out of bounds abort while loop
            if (!this._playingBoard.isInBounds(coords)) {
                break;
            }
            // if no piece at coords abort while loop 
            var nextPiece = this._playingBoard.getPieceAt(coords);
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
    };
    ConnectSolutionService.prototype.isEndpoint = function (coords, direction) {
        // It's important to know if any coords is an endpoint so we can 
        // be sure we're counting the sequence length accurately
        // NOTE it's possible to be a sequence of one and still be an endpoint
        // if coordinate out of bounds it cannot be an endpoint
        if (!this._playingBoard.isInBounds(coords)) {
            return false;
        }
        // if no piece at coordinate it cannot be an endpoint
        var piece = this._playingBoard.getPieceAt(coords);
        if (piece === null) {
            return false;
        }
        // piece exists - if opposite neighbour coordinate out of bounds it must be an endpoint
        var directionOpposite = this._coordsNavigationService.getOpposite(direction);
        var oppositeNeighbourCoord = this._coordsNavigationService.move(coords, directionOpposite);
        if (!this._playingBoard.isInBounds(oppositeNeighbourCoord)) {
            return true;
        }
        // if opposite neighbour is NULL it must be an endpoint
        var oppositeNeighbourPiece = this._playingBoard.getPieceAt(oppositeNeighbourCoord);
        if (oppositeNeighbourPiece === null) {
            return true;
        }
        // opposite neighbour exists - if types match it cannot be considered an endpoint in this direction
        if (oppositeNeighbourPiece.constructor === piece.constructor) {
            return false;
        }
        // otherwise, types must differ and it is an endpoint
        return true;
    };
    return ConnectSolutionService;
}());
var AlternatingPlayingPieceFactory = (function () {
    function AlternatingPlayingPieceFactory(_factoryOne, _factoryTwo) {
        this._factoryOne = _factoryOne;
        this._factoryTwo = _factoryTwo;
        this._isFactoryOneCreatingNext = true;
    }
    AlternatingPlayingPieceFactory.prototype.createInstance = function () {
        var result = null;
        if (this._isFactoryOneCreatingNext) {
            result = this._factoryOne.createInstance();
        }
        else {
            result = this._factoryTwo.createInstance();
        }
        this._isFactoryOneCreatingNext = !this._isFactoryOneCreatingNext;
        return result;
    };
    return AlternatingPlayingPieceFactory;
}());
var ConnectFourPlayingService = (function () {
    function ConnectFourPlayingService(_playingBoard, _playingPieceFactory, _connectSolutionService) {
        this._playingBoard = _playingBoard;
        this._playingPieceFactory = _playingPieceFactory;
        this._connectSolutionService = _connectSolutionService;
        // 	requireNonNull(playingBoard, "playingBoard");
        // 	requireNonNull(playingPieceFactory, "playingPieceFactory");
        // 	requireNonNull(connectSolutionService, "connectSolutionService");
        this.initialiseGameState();
    }
    ConnectFourPlayingService.createPlayingBoard = function () {
        return new PlayingBoard(new ConnectFourPlayingBoardDimensions());
    };
    ConnectFourPlayingService.createPreviewablePlayingPieceFactory = function (p1PlayerStarts) {
        var p1PlayingPieceFactory = new P1PlayingPieceFactory();
        var p2PlayingPieceFactory = new P2PlayingPieceFactory();
        var alternatingPlayingPieceFactory = new AlternatingPlayingPieceFactory(p1PlayerStarts ? p1PlayingPieceFactory : p2PlayingPieceFactory, p1PlayerStarts ? p2PlayingPieceFactory : p1PlayingPieceFactory);
        return new PreviewablePlayingPieceFactory(alternatingPlayingPieceFactory);
    };
    ConnectFourPlayingService.prototype.initialiseGameState = function () {
        this._gameState = enums_1.GameStateEnum.IN_PROGRESS;
    };
    ConnectFourPlayingService.prototype.getGameState = function () {
        if (this._gameState === enums_1.GameStateEnum.IN_PROGRESS) {
            // if game is IN_PROGRESS, check if game is OVER
            if (this.isPlayingBoardFull()) {
                this.setGameState(enums_1.GameStateEnum.OVER);
            }
            var winningSequences = this.getWinningSequences();
            if (winningSequences !== null) {
                this.setGameState(enums_1.GameStateEnum.OVER);
            }
        }
        return this._gameState;
    };
    ConnectFourPlayingService.prototype.setGameState = function (gameState) {
        // OVER and ABORTED are end-states, so we reject any 
        // attempt to modify the game state unless it's IN_PROGRESS
        if (this._gameState !== enums_1.GameStateEnum.IN_PROGRESS)
            throw new Error("Illegal Argument");
        this._gameState = gameState;
    };
    ConnectFourPlayingService.prototype.getNextPlayerName = function () {
        return this._playingPieceFactory.preview().getTextDescription();
    };
    ConnectFourPlayingService.prototype.takeTurnString = function (stringMove) {
        if (stringMove === null) {
            throw new Error("Illegal Argument");
        }
        if (stringMove.trim().toLowerCase() === "q") {
            // abort
            this.setGameState(enums_1.GameStateEnum.ABORTED);
            return;
        }
        var intMove = parseInt(stringMove);
        if (isNaN(intMove)) {
            throw new Error("Illegal Move");
        }
        this.takeTurnNumber(intMove);
    };
    ConnectFourPlayingService.prototype.takeTurnNumber = function (x) {
        if (this.getGameState() !== enums_1.GameStateEnum.IN_PROGRESS)
            throw new Error("Illegal Move");
        if (x < 1 || x > this._playingBoard.sizeX)
            throw new Error("Illegal Move");
        var piecesInColumnX = this.getColumnUsageCount(x);
        if (piecesInColumnX >= this._playingBoard.sizeY)
            throw new Error("Illegal Move");
        var y = piecesInColumnX + 1;
        this.takeTurnCoords(new Coords(x, y));
    };
    ConnectFourPlayingService.prototype.getIsInProgress = function () {
        return (this.getGameState() == enums_1.GameStateEnum.IN_PROGRESS);
    };
    ConnectFourPlayingService.prototype.getIsGameOver = function () {
        return (this.getGameState() == enums_1.GameStateEnum.OVER);
    };
    ConnectFourPlayingService.prototype.getIsGameAborted = function () {
        return (this.getGameState() == enums_1.GameStateEnum.ABORTED);
    };
    ConnectFourPlayingService.prototype.getWinningSequences = function () {
        return this._connectSolutionService.solve();
    };
    ConnectFourPlayingService.prototype.getPlayingBoardReader = function () {
        return new PlayingBoardReader(this._playingBoard);
    };
    ConnectFourPlayingService.prototype.takeTurnCoords = function (coords) {
        var playingPiece = this._playingPieceFactory.createInstance();
        this._playingBoard.setPieceAt(playingPiece, coords);
    };
    ConnectFourPlayingService.prototype.getColumnUsageCount = function (x) {
        var result = 0;
        for (var y = 1; y <= this._playingBoard.sizeY; y++) {
            if (this._playingBoard.getPieceAt(new Coords(x, y)) != null) {
                result++;
            }
        }
        return result;
    };
    ConnectFourPlayingService.prototype.isPlayingBoardFull = function () {
        for (var y = 1; y <= this._playingBoard.sizeY; y++) {
            for (var x = 1; x <= this._playingBoard.sizeX; x++) {
                if (this._playingBoard.getPieceAt(new Coords(x, y)) === null) {
                    return false;
                }
            }
        }
        return true;
    };
    ConnectFourPlayingService.prototype.getWinner = function () {
        var winningSequences = this.getWinningSequences();
        if (winningSequences === null)
            return null;
        if (winningSequences.length === 0)
            return null;
        if (winningSequences[0].length === 0)
            return null;
        return winningSequences[0][0];
    };
    return ConnectFourPlayingService;
}());
var ConnectFourPlayingServiceFactory = (function () {
    function ConnectFourPlayingServiceFactory() {
        this._p1PlayerStarts = false;
    }
    ConnectFourPlayingServiceFactory.prototype.createInstance = function () {
        this._p1PlayerStarts = !this._p1PlayerStarts; // alternate the starting player upon each invocation
        var playingBoard = ConnectFourPlayingService.createPlayingBoard();
        var playingPieceFactory = ConnectFourPlayingService.createPreviewablePlayingPieceFactory(this._p1PlayerStarts);
        var coordsNavigationService = new CoordsNavigationService();
        var connectSolutionService = new ConnectSolutionService(playingBoard, coordsNavigationService, /*ConnectFourPlayingService.*/ constants_1.CONNECTED_PIECES_TO_WIN);
        return new ConnectFourPlayingService(playingBoard, playingPieceFactory, connectSolutionService);
    };
    return ConnectFourPlayingServiceFactory;
}());
exports.ConnectFourPlayingServiceFactory = ConnectFourPlayingServiceFactory;
var ConnectFourScoreKeeperService = (function () {
    function ConnectFourScoreKeeperService() {
        this._playerOneScore = 0;
        this._playerTwoScore = 0;
    }
    Object.defineProperty(ConnectFourScoreKeeperService.prototype, "playerOneScore", {
        get: function () {
            return this._playerOneScore;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectFourScoreKeeperService.prototype, "playerTwoScore", {
        get: function () {
            return this._playerTwoScore;
        },
        enumerable: true,
        configurable: true
    });
    ConnectFourScoreKeeperService.prototype.updateScore = function (winner) {
        if (winner instanceof P1PlayingPiece) {
            this._playerOneScore++;
        }
        else {
            this._playerTwoScore++;
        }
    };
    return ConnectFourScoreKeeperService;
}());
//# sourceMappingURL=classes.js.map