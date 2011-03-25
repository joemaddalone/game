var _ = function (selector) {return document.getElementById(selector)}
function ce(type, ident, inner, isInput) {
    var el;
    if (!isInput) {
        el = document.createElement(type);
        el.innerHTML = inner;
    } else {
        el = document.createElement('input');
		el.setAttribute('type',type);
		el.setAttribute('value',inner);
    }
    el.id = ident;
    return el;
}

function setClass(id,cssClass){
	_(id).setAttribute('class',cssClass)
	}


/* a reverse forEach */
Array.prototype._forEach = function (fun) {
    var len = this.length;
    if (typeof fun != "function") throw new TypeError();
    var thisp = arguments[1];
    for (var i = len; i > 0; i--) {
        if (i in this) fun.call(thisp, this[i], i, this);
    }
};


if (!Array.prototype.forEach)
{
  Array.prototype.forEach = function(fun /*, thisp */)
  {
    if (this === void 0 || this === null)
      throw new TypeError();
    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in t)
        fun.call(thisp, t[i], i, t);
    }
  };
}

Object.prototype.addEvent = function(eventName, eventHandler) {
  if (this.addEventListener){
    this.addEventListener(eventName, eventHandler, false); 
  } else if (this.attachEvent){
    this.attachEvent('on'+eventName, eventHandler);
  }
}


/* because array.slice wont copy objects */
Object.prototype.clone = function () {
    var newObj = (this instanceof Array) ? [] : {};
    for (i in this) {
        if (i == 'clone') {continue}
        if (this[i] && typeof this[i] == "object") {
            newObj[i] = this[i].clone();
        } else {newObj[i] = this[i]}
    }
    return newObj;
};




