namespace('xwords.models')

xwords.models.Board = function Board(config) {
  this.state = {},
  this.state.models = config.models || [],
  this.state.height = 15,
  this.state.width  = 15,
  this.state.blackboxes = config.blackboxes || [],
  this.state.model = config.model,
  this.state.wordBank = config.wordBank,
  this.state.cellCount = this.state.height * this.state.width,
  this.state.startPoints = config.startPoints || [],
  this.state.orientation = 'across',

  this.initialize = function() {
    if (this.state.models.length === 0) {
      var blackboxCount = this.state.blackboxes.length

      for (var i = 0; i < this.state.cellCount; ++i) {
        this.add(new this.state.model)
      }

      for (var i = 0; i < blackboxCount; ++i) {
        var cellIndex = this.state.blackboxes[i]
        this.state.models[cellIndex].blackout()
      }
    }

    if (this.state.startPoints.length === 0) this.calculateStartPoints()
    this.setStartPointNumbers()
  },

  this.add = function(model) {
    this.state.models.push(model)
  },

  this.offBoard = function(currentIndex, indexToCheck) {
    var width = this.state.width,
        cellCount = this.state.cellCount

    if (indexToCheck < 0 || indexToCheck > (cellCount - 1)) return true
    if (currentIndex % width === 0 && indexToCheck === currentIndex - 1) {
      return true
    }
    if (currentIndex % width === (width - 1) && indexToCheck === (currentIndex + 1)) {
      return true
    }
    return false
  },

  this.blackboxAt = function(index) {
    if (!this.state.models[index]) console.log(index)
    return this.state.models[index].isBlackbox()
  },

  this.calculateStartPoints = function() {
    var clueNumber = 1
    this.state.startPoints = []

    for (var i = 0; i < this.state.cellCount; ++i) {
      var across, down
      if (this.state.models[i].isBlackbox()) continue
      if (across = this.acrossWordStartsAt(i)) {
        var length = this.lengthAt(i, 'across', 1)

        this.state.startPoints.push({
          index: i,
          orientation: 'across',
          number: clueNumber,
          length: length,
          indices: this.indicesFor(i, 'across', length)
        })
      }
      if (down = this.downWordStartsAt(i)) {
        var length = this.lengthAt(i, 'down', 1)

        this.state.startPoints.push({
          index: i,
          orientation: 'down',
          number: clueNumber,
          length: length,
          indices: this.indicesFor(i, 'down', length)
        })
      }
      if (across || down) clueNumber++
    }
    // this.state.startPoints = this.state.startPoints.sort(function(a, b) {
    //   return b.length - a.length
    // })
  },

  this.acrossWordStartsAt = function(index) {
    return this.offBoard(index, index - 1) || this.blackboxAt(index - 1)
  },

  this.downWordStartsAt = function(index) {
    return this.offBoard(index, index - 15) || this.blackboxAt(index - 15)
  },

  this.lengthAt = function(index, orientation, depth) {
    var next = orientation === 'across' ? 1 : 15

    if (this.offBoard(index, index + next) || this.blackboxAt(index + next)) {
      return depth
    }

    return this.lengthAt(index + next, orientation, depth + 1)
  },

  this.placeWords = function(callback) {
    var startPoints = this.state.startPoints,
        startPointCount = startPoints.length,
        bank = this.state.wordBank

    for (var i = 0; i < startPointCount; ++i) {
      !function(i, startPoints, bank, self, callback) {
        if (window.solution) return
        var point = startPoints[i]
            word = self.charactersAt(point.index, point.orientation, point.length)

        if (word.indexOf('') >= 0) {
          var potentialWords = bank.matching(word)

          for (var j = 0; j < potentialWords.length; ++j) {
            !function(j, point, potentialWords, state, callback) {
              if (window.solution) return
              var board = new xwords.models.Board(state)
              board.setWord(potentialWords[j], point.index, point.orientation)
              if (board.valid()) {
                if (board.finished()) {
                  window.solution = board
                  callback(board)
                }
                board.placeWords(callback)
              }
            }(j, point, potentialWords, self.dumpState(), callback)
          }
        }
      }(i, startPoints, bank, this, callback)
    }
  },

  this.print = function() {
    var board = this.toJSON().map(function(model) {
      return model.character || '_'
    }).join('').match(/.{15}/g).join('\n')

    console.log(board)
  },

  this.valid = function() {
    var startPoints = this.state.startPoints

    for (var i = 0; i < startPoints.length; ++i) {
      var point = startPoints[i],
          characters = this.charactersAt(point.index, point.orientation, point.length),
          word = characters.join(''),
          completeWord = (characters.indexOf('') < 0),
          notAWord = this.remaining(characters).length === 0,
          oneLetter = word.match(/[A-Z]/)

      if ((completeWord && this.duplicate(word)) || (oneLetter && notAWord)) {
        return false
      }
    }

    return true
  },

  this.remaining = function(characters) {
    var matchingWords = this.state.wordBank.matching(characters)
        currentWords = this.state.startPoints.map(function(point) {
          return this.charactersAt(point.index, point.orientation, point.length)
        }, this)

    return matchingWords.filter(function(word) {
      return currentWords.indexOf(word) < 0
    })
  },

  this.duplicate = function(word) {
    var counter = 0

    for (var i = 0; i < this.state.startPoints.length; ++i) {
      var point = this.state.startPoints[i]

      if (word === this.charactersAt(point.index, point.orientation, point.length).join('')) {
        ++counter
      }
    }

    return counter > 1
  },

  this.finished = function() {
    var cellCount = this.state.models.length

    for (var i = 0; i < cellCount; ++i) {
      var model = this.state.models[i]
      if (!model.isBlackbox() && model.character() === '') return false
    }
    return true
  },

  this.setWord = function(word, index, orientation) {
    var next = orientation === 'across' ? 1 : 15

    for (var i = 0; i < word.word.length; ++i) {
      this.state.models[index + (i * next)].setCharacter(word.word[i])
    }
  },

  this.charactersAt = function(index, orientation, length) {
    var next = orientation === 'across' ? 1 : 15,
        characters = []

    for (var i = 0; i < length; ++i) {
      characters.push(this.characterAt(index + (i * next)))
    }

    return characters
  },

  this.characterAt = function(index) {
    return this.state.models[index].character()
  },

  this.toJSON = function() {
    return this.state.models.map(function(model) {
      return model.toJSON()
    })
  },

  this.dumpState = function() {
    return {
      model: this.state.model,
      wordBank: this.state.wordBank,
      startPoints: this.state.startPoints,
      models: this.state.models.map(function(model) {
        return new this.state.model(model.toJSON())
      }, this)
    }
  },

  this.clues = function() {
    var points = this.state.startPoints,
        list = {
          across: [],
          down:   []
        }

    this.state.startPoints.forEach(function(point, index) {
      var word = this.charactersAt(point.index, point.orientation, point.length),
          datum = this.state.wordBank.fetch(word.join('')),
          highlighted = this.state.models[point.index].isHighlighted()

      list[point.orientation].push({
        number: point.number,
        clue: datum.clue,
        highlight: highlighted
      })
    }, this)

    return list
  },

  this.setCurrent = function(index) {
    if (this.state.currentIndex === index) this.reverseOrientation()
    this.state.models.forEach(function(model) { model.setCurrent(false) })
    var model = this.state.models[index]
    if (model && !model.isBlackbox()) {
      this.state.models[index].setCurrent(true)
      this.state.currentIndex = index
      this.setRelated(index)
    } else {
      this.state.currentIndex = null
      this.removeRelated()
    }
    this.trigger('board:change')
  },

  this.setRelated = function(index) {
    var startPoints = this.state.startPoints,
        results = {}

    for (var i = 0; i < startPoints.length; ++i) {
      var point = startPoints[i]

      if (point.indices.indexOf(index) >= 0) {
        results[point.orientation] = point.indices
      }
    }

    this.removeRelated()

    for (var i = 0; i < results[this.getOrientation()].length; ++i) {
      var modelIndex = results[this.getOrientation()][i]

      this.state.models[modelIndex].setHighlight(true)
    }
  },

  this.removeRelated = function() {
    this.state.models.map(function(model) { model.setHighlight(false) })
  },

  this.trigger = function(eventName) {
    var customEvent = new CustomEvent(eventName, {
      detail: {
        clues: this.clues()
      }
    })

    document.dispatchEvent(customEvent)
  },

  this.indicesFor = function(index, orientation, length) {
    var next = orientation === 'across' ? 1 : 15,
        indicies = []

    for (var i = 0; i < length; ++i) {
      indicies.push(index + (i * next))
    }

    return indicies
  },

  this.getOrientation = function() {
    return this.state.orientation
  },

  this.reverseOrientation = function() {
    if (this.state.orientation === 'across') {
      this.state.orientation = 'down'
    } else {
      this.state.orientation = 'across'
    }
  },

  this.setGuess = function(letter) {
    if (this.state.currentIndex !== 0 && !this.state.currentIndex) return false

    var model = this.state.models[this.state.currentIndex]

    if (model && !model.isBlackbox()) {
      model.setGuess(letter)
      this.trigger('board:change')
    }
  }

  this.advanceCurrentIndex = function() {
    var next = this.getOrientation() === 'across' ? 1 : 15

    if (this.state.currentIndex !== null) {
      this.setCurrent(this.state.currentIndex + next)
    }
  },

  this.setStartPointNumbers = function() {
    var points = this.state.startPoints

    for (var i = 0; i < points.length; ++i) {
      for (var j = 0; j < points[i].indices.length; ++j) {
        var index = points[i].indices[j]

        this.state.models[index].setNumber(points[i].number)
      }
    }
  },

  this.backpedal = function() {
    var next = this.getOrientation() === 'across' ? 1 : 15

    this.setCurrent(this.state.currentIndex - next)
  },

  this.solved = function() {
    for (var i = 0; i < this.state.models.length; ++i) {
      if (!this.state.models[i].correct()) return false
    }
    return true
  }

  this.initialize()
}
