enum DirectionEnum { 
	// X=EtoW
	// Y=NtoS
    EAST, 
    WEST, 
    NORTH, 
    SOUTH, 
    NORTHEAST, 
    NORTHWEST, 
    SOUTHEAST, 
    SOUTHWEST
}

enum GameStateEnum {
    IN_PROGRESS,
    OVER,
    ABORTED
}

export { DirectionEnum, GameStateEnum };