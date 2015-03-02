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
  [9,24,39,48,53,54,55,64,69,80,96,101,105,106,107,112,117,118,119,123,128,144,155,160,169,170,171,176,185,200,215],
  [5,10,20,25,40,48,54,60,61,67,81,87,88,89,95,109,115,129,135,136,137,143,157,163,164,170,176,184,199,204,214,219],
  [9,24,39,48,53,65,66,67,71,75,76,77,85,100,109,115,124,139,147,148,149,153,157,158,159,171,176,185,200,215],
  [10,25,40,52,53,60,61,62,66,71,78,86,95,100,109,115,124,129,138,146,153,158,162,163,164,171,172,184,199,214]
]
