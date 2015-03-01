namespace('xwords.models')

xwords.models.Cell = function Cell(options) {
  this.state = options || {},

  this.blackout = function() {
    this.state.blackbox = true
  },

  this.isBlackbox = function() {
    return !!this.state.blackbox
  },

  this.character = function() {
    return this.state.character || ''
  },

  this.setCharacter = function(character) {
    this.state.character = character
  },

  this.toJSON = function() {
    return JSON.parse(JSON.stringify(this.state))
  },

  this.setCurrent = function(value) {
    this.state.current = value
  },

  this.setHighlight = function(value) {
    this.state.highlight = value
  },

  this.isHighlighted = function() {
    return !!this.state.highlight
  },

  this.setGuess = function(letter) {
    this.state.guess = letter
  },

  this.setNumber = function(number) {
    this.state.number = number
  },

  this.getNumber = function() {
    return this.state.number
  },

  this.correct = function() {
    return this.state.guess === this.state.character
  }
}
