!function(){

  var wordbank = new xwords.models.WordBank({
    wordbank: xwords.datasets.clues
  })

  var board = new xwords.models.Board({
    model: xwords.models.Cell,
    blackboxes: xwords.datasets.blackboxes[0],
    wordBank: wordbank
  })

  board.placeWords(function(solution) {
    var crossword = new xwords.views.Board({
      el: '.game',
      collection: solution
    })

    var clues = new xwords.views.Clues({
      el: '.clues',
      clues: solution.clues()
    })

    crossword.render()
    clues.render()
  })
}()
