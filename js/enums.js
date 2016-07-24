"use strict";
var DirectionEnum;
(function (DirectionEnum) {
    // X=EtoW
    // Y=NtoS
    DirectionEnum[DirectionEnum["EAST"] = 0] = "EAST";
    DirectionEnum[DirectionEnum["WEST"] = 1] = "WEST";
    DirectionEnum[DirectionEnum["NORTH"] = 2] = "NORTH";
    DirectionEnum[DirectionEnum["SOUTH"] = 3] = "SOUTH";
    DirectionEnum[DirectionEnum["NORTHEAST"] = 4] = "NORTHEAST";
    DirectionEnum[DirectionEnum["NORTHWEST"] = 5] = "NORTHWEST";
    DirectionEnum[DirectionEnum["SOUTHEAST"] = 6] = "SOUTHEAST";
    DirectionEnum[DirectionEnum["SOUTHWEST"] = 7] = "SOUTHWEST";
})(DirectionEnum || (DirectionEnum = {}));
exports.DirectionEnum = DirectionEnum;
var GameStateEnum;
(function (GameStateEnum) {
    GameStateEnum[GameStateEnum["IN_PROGRESS"] = 0] = "IN_PROGRESS";
    GameStateEnum[GameStateEnum["OVER"] = 1] = "OVER";
    GameStateEnum[GameStateEnum["ABORTED"] = 2] = "ABORTED";
})(GameStateEnum || (GameStateEnum = {}));
exports.GameStateEnum = GameStateEnum;
//# sourceMappingURL=enums.js.map