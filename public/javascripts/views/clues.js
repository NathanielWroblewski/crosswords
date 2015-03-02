namespace('xwords.views')

xwords.views.Clues = function Clues(config) {
    this.el = document.querySelector(config.el),
    this.state = {}
    this.state.across = config.clues.across,
    this.state.down = config.clues.down,

    this.initialize = function() {
      this.setListeners()
    },

    this.setListeners = function() {
      document.addEventListener('board:change', this.handleUpdate.bind(this))
    },

    this.handleUpdate = function(e) {
      this.state.across = e.detail.clues.across
      this.state.down = e.detail.clues.down
      this.render()
    },

    this._template = function(orientation) {
      var data = this.state[orientation],
          html = '<p class="header">' + orientation.toUpperCase() + '</p><dl>'

      var startingPoint = data.map(function(datum) {
        return datum.highlight
      }).indexOf(true)

      var start = (startingPoint >= 0 ? startingPoint : 0),
          end = (start + 5) > data.length ? data.length : start + 5

      for (var i = start; i < end; ++i){
        var active = i === start ? 'active' : ''

        html += '<dt class=' + active + '>' + data[i].number +
          '</dt><dd class=' + active + '>' + data[i].clue + '</dd><br/>'
      }
      html += '</dl>'

      return html
    }

    this.template = function() {
      var html = this._template('across')
      html += this._template('down')

      return html
    },

    this.render = function() {
      this.el.innerHTML = this.template()
    }

    this.initialize()
  }
