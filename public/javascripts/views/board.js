namespace('xwords.views')

xwords.views.Board = function Board(config) {
  this.el = document.querySelector(config.el),
  this.state = { currentIndex: 0, currentOrientation: 'across' },
  this.collection = config.collection,

  this.initialize = function() {
    this.setListeners()
  },

  this.setListeners = function() {
    this.el.addEventListener('click', this.handleClick.bind(this))
    document.addEventListener('board:change', this.render.bind(this))
    document.addEventListener('keypress', this.handleKeyPress.bind(this))
    document.addEventListener('keydown', this.handleKeyDown.bind(this))
  },

  this.handleClick = function(e) {
    if (e.target.className.indexOf('cell') >= 0) {
      this.collection.setCurrent(parseInt(e.target.dataset.index))
    }
  },

  this.handleKeyPress = function(e) {
    var key = String.fromCharCode(e.which).toUpperCase()

    if (key.match(/[A-Z]/)) {
      this.collection.setGuess(key)
      this.collection.advanceCurrentIndex()
      if (this.collection.solved()) alert('You have solved the puzzle.')
    }
  },

  this.handleKeyDown = function(e) {
    if (e.keyCode === 8) {
      e.preventDefault()
      this.collection.backpedal()
      this.collection.setGuess('')
    }
  },

  this.template = function(cells) {
    var html = '',
        cellCount = cells.length,
        numberMemo = 0

    for (var i = 0; i < cellCount; ++i) {
      var blackbox  = cells[i].blackbox ?  ' blackbox'  : '',
          highlight = cells[i].highlight ? ' highlight' : '',
          current   = cells[i].current ?   ' current'   : '',
          guessClass = cells[i].guess ? ' guess' : '',
          guess = cells[i].guess || '',
          number = cells[i].number,
          numberClass = number && number !== numberMemo ? ' num' : '',
          classList = blackbox + highlight + current + numberClass + guessClass

      numberMemo = number

      html += '<div class="cell' + classList + '" data-index=' + i +
        ' data-number=' + number + '>' + guess + '</div>'
    }

    return html
  },

  this.render = function() {
    this.el.innerHTML = this.template(this.collection.toJSON())
    return this
  },

  this.initialize()
}
