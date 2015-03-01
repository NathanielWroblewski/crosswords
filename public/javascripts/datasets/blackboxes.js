namespace('xwords.datasets')

/**
 * The arrays contained herein contain blackbox indices within a board,
 * where 0 is the upper-leftmost cell, e.g. if the indicies within
 * xwords.datasets.blackboxes[0] are [1,2,3] then the second, third, and fourth
 * cells of the puzzle will be black boxes.
 *
 * It is proper American crossword form that a puzzles should have rotational
 * symmetry
 **/
xwords.datasets.blackboxes = [
  [9,24,39,48,53,54,55,64,69,80,96,101,105,106,107,112,117,118,119,123,128,144,155,160,169,170,171,176,185,200,215]
]
