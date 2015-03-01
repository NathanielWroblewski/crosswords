namespace('xwords.models')

xwords.models.WordBank = function WordBank(config) {
  this.state = {},
  this.state.wordbank = config.wordbank || [],
  this.state.wordsByLength = {},

  this.initialize = function() {
    this.arrangeByLength()
  },

  this.arrangeByLength = function() {
    var wordCount = this.state.wordbank.length,
        wordsByLength = {}

    for (var i = 0; i < wordCount; ++i) {
      var datum = this.state.wordbank[i],
          word  = datum.word

      if (wordsByLength[word.length]) {
        wordsByLength[word.length].push(datum)
      } else {
        wordsByLength[word.length] = [datum]
      }
    }

    this.state.wordsByLength = wordsByLength
  },

  this.wordsOfLength = function(length) {
    return this.state.wordsByLength[length] || []
  },

  this.matching = function(characters) {
    var pattern = this.patternFor(characters),
        words = this.wordsOfLength(characters.length)

    return words.filter(function(datum) {
      return datum.word.match(pattern)
    })
  },

  this.patternFor = function(characters) {
    var pattern = characters.map(function(letter) {
      return letter === '' ? '.' : letter
    })

    return new RegExp(pattern.join(''))
  },

  this.fetch = function(word) {
    var bank = this.state.wordbank,
        wordCount = bank.length

    for (var i = 0; i < wordCount; ++i) {
      if (bank[i].word === word) return bank[i]
    }
  }

  this.initialize()
}
