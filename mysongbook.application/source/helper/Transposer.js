
function Transposer () {}

  Transposer.chordList = [
      { name: 'Ab',  value: 0,   type: 'b' },
      { name: 'A',   value: 1,   type: 'n' },
      //~ { name: 'A#',  value: 2,   type: '#' },
      //~ { name: 'Bb',  value: 2,   type: 'b' },
      { name: 'Bb',  value: 2,   type: 'n' },
      { name: 'B',   value: 3,   type: 'n' },
      { name: 'C',   value: 4,   type: 'n' },
      { name: 'C#',  value: 5,   type: '#' },
      { name: 'Db',  value: 5,   type: 'b' },
      { name: 'D',   value: 6,   type: 'n' },
      { name: 'D#',  value: 7,   type: '#' },
      { name: 'Eb',  value: 7,   type: 'b' },
      { name: 'E',   value: 8,   type: 'n' },
      { name: 'F',   value: 9,   type: 'n' },
      { name: 'F#',  value: 10,  type: '#' },
      { name: 'Gb',  value: 10,  type: 'b' },
      { name: 'G',   value: 11,  type: 'n' },
      { name: 'G#',  value: 0,   type: '#' }
    ];
    
  Transposer.getValue = function(chordName) {
    for (c in this.chordList) {
      if (this.chordList[c].name === chordName) {
        return this.chordList[c];
      } 
    };
    return "?";
  };
    
  Transposer.getBase = function(chord) { 
    if (chord.charAt(1) === "b" || chord.charAt(1) === "#") {
      var c = this.getValue(chord.substring(0,2));
      c["rest"] = chord.substring(2);
      return c;
    } else {
      var c = this.getValue(chord.charAt(0));
      c["rest"] = chord.substring(1);
      return c;
    };
  };
  
  Transposer.getNew = function(old, transp) { 
    var newValue = old.value + transp;
    if (newValue > 11) {
      newValue -= 12;
    } else if (newValue < 0) {
      newValue += 12;
    };
    
    for (y in this.chordList) {
      if (this.chordList[y].value === newValue) {
        if (this.chordList[y].type === "n") {
          return this.chordList[y].name;
        } else {
          if (this.chordList[y].type === old.type) { //b=>b ; #=>#
            return this.chordList[y].name;
          } else {
            if (transp > 0 &&  this.chordList[y].type === "#") { //positive transp results in #, negative transp in b
              return this.chordList[y].name;
            } else if (transp < 0 &&  this.chordList[y].type === "b") {
              return this.chordList[y].name;
            };
          };
        };
      }; 
    };
  };
    
  Transposer.transpose = function(chord, transp) { 
    var oldC = this.getBase(chord);
    if(oldC.name) {
      var newC = this.getNew(oldC, transp);
      //~ enyo.log(chord + ": " + newC + oldC.rest);
      return newC + oldC.rest;
    } else {
      return "?";
    };
  };
  
  Transposer.getDelta = function(key, newK) {
    var oldKey = this.getBase(key);
    var newKey = this.getBase(newK);
    for (x in this.chordList) {
      if (this.chordList[x].name === oldKey.name) {
        var a = this.chordList[x].value;
      } else if (this.chordList[x].name === newKey.name) {
        var b = this.chordList[x].value;
      };
    };
    return b - a;
  };
