var game = function (b, u) {
/*
	b = number of rows
	u = highest val	ue of piece, limited to 1-10 by images right now
 */
    this.base = b;
    this.pieces = [];
    this.upper = u;
    this.playerTotal = 0;
    this.dat = new Array(b);
    this.currentTime = b * 5;
    this.timerRunning = false;
    this.init(b, u)
};
game.prototype = {
    init: function (b, u) {
	/*
		game.init : each 'dat' element is populated with array(base)
		all values of each items array = 0
		then one from row 0, 2 from row 1, 3 from row 2, and so on are set to a random number up to 'upper'
	*/	
        for (var row = 0; row < this.base; row++) {
            this.dat[row] = new Array(this.base);
            for (var col = 0; col < this.base; col++) {
                this.dat[row][col] = 0
            }
			
            for (var col = 0; col <= row; col++) {
                this.dat[row][col] = this.retRnd(this.upper);
                var x = new this.piece(this.dat[row][col], row + '-' + col, row);
                this.pieces.push(x)
            }
        }
    },
    retRnd: function (x) {
	/*
		returns random number up to x
	*/		
        var ret = Math.floor(Math.random() * (x + 1));
        if (ret == 0) {
            return 1
        } else {
            return ret
        }
    },
    solve: function (t) {
	/*
		solves the highest possible value w/o needed to brute force each possible path
	*/			
        t._forEach(function (copyRowVal, copyRow, arr) {
            copyRowVal.forEach(function (copyColVal, copyCol, arr2) {
                if (t[copyRow][copyCol] > t[copyRow][copyCol + 1]) {
                    t[copyRow - 1][copyCol] += t[copyRow][copyCol]
                } else {
                    t[copyRow - 1][copyCol] += t[copyRow][copyCol + 1]
                }
            })
        });
        return t[0][0]
    },
    solution: function () {
	/*
		calls the solve function with a copy of the dat array and returns the solve value
	*/		
	this.copy = this.dat.clone();
        return this.solve(this.copy)
    },
    piece: function (val, id, name) {
	/*
		generates a piece which is really a radio button
	*/				
        var me = ce('radio', id, val, true);
        me.setAttribute('name', name);
        return me
    },
    celebrate: function (isWin) {
	/*
		generates a canvas and does either the colored grid or the black grid depending on isWin
	*/				
        var col = -15;
        var y = 0;
        var gridSize = 15;
        var canvas = ce("canvas", "canvas");
        document.body.appendChild(canvas);
        if (canvas.getContext) {
            ctx = canvas.getContext('2d');
            this.gridSize = 15;
            myInterval = setInterval(make, 15)
        };

        function make() {
            var canvas = _("canvas");
            if (col >= canvas.width) {
                col = 0;
                y += gridSize
            } else {
                col += gridSize
            };
            if (y >= canvas.height) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                y = 0
            };
            if (isWin) {
                ctx.fillStyle = random_color()
            } else {
                ctx.fillStyle = 'rgb(0,0,0)'
            };
            ctx.fillRect(col, y, gridSize, gridSize)
        };

        function random_color() {
            var rint = Math.round(0xffffff * Math.random());
            return 'rgb(' + (rint >> 16) + ',' + (rint >> 8 & 255) + ',' + (rint & 255) + ')'
        }
    }
};

var lvl = 2;
var stopWin = function () {
	/*
		stops the win or lose screen and sound
	*/		
    var canvas = _('canvas');
    var ctx = canvas.getContext('2d');
    clearInterval(myInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.body.removeChild(_('canvas'));
    try {
        _('win').pause();
        _('win').currentTime = 0;
        _('lose').pause();
        _('lose').currentTime = 0
    } catch (err) {}
};

function playAudio(id, vol) {
/*
	plays the audio element passed in
*/		
    try {
        if (!vol) {
            _(id).volume = 0.25
        } else {
            _(id).volume = vol
        }
        _(id).currentTime = 0;
        _(id).play()
    } catch (e) {}
};

function start(lvl) {
/*
	
*/		
    _('timer').style.display = '';
    _('lvl').innerHTML = 'Level: ' + (lvl - 1).toString();
    _('ans').innerHTML = '';
    _('panel').innerHTML = '';
    _('results').innerHTML = '';
    _('results').style.display = 'none';
    setClass('lvl', 'slideIn');
    setClass('cur', 'slideIn');
    setClass('ans', 'slideIn');
    setClass('getRules', 'slideIn');
    _('cur').innerHTML = 'Current Total is: 0';
    var g = new game(lvl, 9);
    var ans = g.solution();
    _('ans').innerHTML = 'The Answer is:  ' + ans;
    _('timer').innerHTML = g.currentTime;
    decTimer();

    function checkWin() {
		/*
			validates that each selecction is adjacent
		*/			
        var route = [];
        var sumA = 1;
        var sumChecked = 0;
        for (i = 0; i < lvl; i++) {
            sumA += i
        };
        var limit = g.pieces.length;
        for (i = 0; i < limit; i++) {
            if (_(g.pieces[i].id).checked) {
                sumChecked += 1;
                route.push(g.pieces[i].id.split("-")[1])
            }
        };
        if (!sumChecked == lvl) {
            return false
        };
        var pos = 0;
        var ret = true;
        for (i = 0; i < route.length; i++) {
            if (parseInt(route[i], 10) == pos || parseInt(route[i], 10) == (pos + 1)) {
                pos = parseInt(route[i])
            } else {
                ret = false;
                break
            }
        };
        return ret
    };
    icon = function (id, inner) {
		/*
			generates the piece presentation
		*/		
        var nval = 'n';
        switch (true) {
        case (lvl < 11):
            nval = 'n';	// big
            break;
        case (lvl < 16):
            nval = 'Bn'; // medium
            break;
        default:
            nval = 'Cn'; // small
            break
        };
        var innerVal = '<div class="val ' + nval + inner + '">&nbsp;</div>';
        var me = ce('span', 'icon-' + id, innerVal);
        me.setAttribute("class", "piece");
        me.addEvent('click', function () {
            _(id).checked = true;
            playAudio('click', 1);
            tally()
        });
        return me
    };

    function decTimer() {
		/*
			start the timer
		*/			
        timerInterval = setInterval(function () {
            _('timer').innerHTML -= 1;
            if (_('timer').innerHTML == 0) {
                lose()
            }
        }, 1000)
    };

    function clearBoard() {
		/*
			
		*/			
        clearInterval(timerInterval);
        _('lvl').setAttribute('class', 'slideOut');
        _('cur').setAttribute('class', 'slideOut');
        _('ans').setAttribute('class', 'slideOut');
        if (_('rules').className == 'slideIn') {
            setClass('rules', 'slideOut')
        } else {
            setClass('getRules', 'slideOut')
        }
    };

    function lose() {
		/*
			Calls lose screen
			Retry Level
		*/			
        clearBoard();
        playAudio('lose');
        g.celebrate(false);
        _('results').style.display = 'block';
        _('results').innerHTML = 'You Lost!<br /><sub>Hint: The "Answer" is the highest possible value from the top to the bottom of the pyramid</sub>';
        _('results').innerHTML += '<br /><button onClick="stopWin();start(lvl)">Retry Level</button>'
    };

    function tally() {
		/*
			calculates current score and checks for win
		*/		
        g.playerTotal = 0;
        g.pieces.forEach(function (x, idx) {
            if (_(x.id).checked) {
                g.playerTotal += parseInt(x.value);
                _('icon-' + x.id).setAttribute("class", "pieceSelected")
            } else {
                _('icon-' + x.id).setAttribute("class", "piece")
            }
        });
        _('cur').innerHTML = 'Current Total is: ' + g.playerTotal;
        if (g.playerTotal == ans && checkWin()) {
            clearBoard();
            playAudio('win');
            g.celebrate(true);
            _('results').style.display = 'block';
            _('results').innerHTML = 'You Won!';
            _('results').innerHTML += '<br /><button onClick="stopWin();start(lvl+=1)">Next Level</button>'
        } else {
            _('results').innerHTML = ''
        }
    }
	
	
    for (i = 0; i < lvl; i++) {
	/*
		present each row
	*/	
        _('panel').appendChild(ce("div", 'row-' + i, ''));
        _('row-' + i).setAttribute('class', 'row')
    };
	
    g.pieces.forEach(function (x, idx) {
	/*
		present each piece
	*/		
        x.addEvent('click', tally, false);
        x.style.display = 'none';
        _('row-' + x.name).appendChild(x);
        _('row-' + x.name).appendChild(new icon(x.id, x.value))
    })
}
(function () {
	/*
		sets up Rules presentation onLoad
	*/	
    _('hideRules').onclick = function () {
        setClass('rules', 'slideOut');
        setClass('getRules', 'slideIn')
    };
    _('getRules').onclick = function () {
        setClass('rules', 'slideIn');
        setClass('getRules', 'slideOut')
    }
})();