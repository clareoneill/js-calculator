var t,
    s,
    k,
    n = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57],
    np = [96, 97, 98, 99, 100, 101, 102, 103, 104, 105],
    Calc = {

  // set initial variables
  settings: {
    buttons: document.querySelectorAll('td'),
    operators: [ '÷', '×', '-', '+' ],
    output: document.getElementById('output'),
    outputVal: '0',
    btnVal: '',
    keyVal: '',
    lastCharacter: '',
    decimalAdded: false,
    newNumber: false,
    solved: false,
    operation: ''
  },
  
  keys: {
    CLEAR: 12,
    C: 67,
    DECIMAL: 110,
    PERIOD: 190,
    DIVIDE: 111,
    MULTIPLY: 106,
    SUBTRACT: 109,
    MINUS: 189,
    ADD: 107,
    PLUS: 187,
    EQUALS: 187,
    ENTER: 13
  },
    
  init: function() {
    // kick things off
    t = this;
    s = t.settings;
    k = t.keys;
    t.buttonClick();
    t.keyClick();
  },
  
  buttonClick: function() {
    for ( var k = 0; k < s.buttons.length; k++ ) {
      s.buttons[k].addEventListener('click', function() {
        
        // get output value
        // and the clicked button's value
        var btn = this;
        s.outputVal = s.output.innerHTML;
        s.btnVal = btn.innerHTML;
        
        switch ( s.btnVal ) {
         // CLEAR
          case 'C':
            t.clear();
            break;
          
          // EQUALS
          case '=':
            t.equals();
            break;
            
          // DECIMAL
          case '.':
            t.decimal();
            break;
          
          // PLUS/MINUS
          case '+/-':
            t.plusMinus();
            break;
          
          // PERCENT
          case '%':
            t.percent();
            break;
          
          // MINUS
          case '-':
            t.minus();
            break;
            
          default:
            // OPERATORS THAT AREN'T MINUS
            if( s.operators.indexOf(s.btnVal) >= 0 ) {
              t.operators();
              
            // NUMBERS
            } else {
              t.numbers();
            }
            
            break;
        }
      });
    }
  }, 
  
  keyClick: function() {
    document.addEventListener('keyup', function(e) {
      // get outputVal
      s.outputVal = s.output.innerHTML;
      switch( e.keyCode || e.which ) {
        
        // CLEAR
        case( k.CLEAR ):
          s.btnVal = 'C'
          t.clear();
          break;
        case( k.C ):
          s.btnVal = 'C';
          t.clear();
          break;
          
        // DIVIDE
        case( k.DIVIDE ):
          s.btnVal = '÷';
          t.operators();
          break;
        
        // MULTIPLY
        case( k.MULTIPLY ):
          s.btnVal = '×';
          t.operators();
          break;
        
        // SUBTRACT
        case( k.SUBTRACT ):
          s.btnVal = '-';
          t.minus();
          break;
        case( k.MINUS ):
          s.btnVal = '-';
          t.minus();
          break;
        
        // ADD
        case( k.ADD ):
          s.btnVal = '+';
          t.operators();
          break;
        
        // DECIMAL
        case( k.DECIMAL ):
          s.btnVal = '.';
          t.decimal();
          break;
        case( k.PERIOD ):
          s.btnVal = '.';
          t.decimal();
          break;
        
        // EQUALS
        case( k.EQUALS ):
          if( !e.shiftKey ) {
            s.btnVal = '=';
            t.equals();
          } else {
            s.btnVal = '+';
            t.operators();
          }
          break;
        case( k.ENTER ):
          s.btnVal = '=';
          t.equals();
          break;
        
        // ALL THE NUMBERS AND SHIFT + OPERATORS
        default:
          // loop through the numbers
          for( var i = 0; i < n.length; i++ ) {
            // if the shift key is not being pressed
            if( !e.shiftKey) {
              if( e.keyCode == n[i] || e.which == n[i] || e.keyCode == np[i] || e.which == np[i] ) {
                s.btnVal = i;
                t.numbers();
              }
            }
          }
          
          // if the shift key is being pressed
          if( e.shiftKey ) {
            // % - SHIFT + 5
            if( e.keyCode == n[5] || e.which == n[5] ) {
              console.log('percent');
              s.btnVal = '%';
              t.percent();
              
            // * - SHIFT+ 8
            } else if( e.keyCode == n[8] || e.which == n[8] ) {
              s.btnVal = '×';
              t.operators();
              
            // ANYTHING ELSE 
            } else {
              console.log('not included');
            }
          }
          break;
      }
    });
  }, 
  
   ///////////////
  //// CLEAR ////
  ///////////////
  clear: function() {
    // reset output to 0
    // reset operation
    // reset decimalAdded to false
    s.output.innerHTML = 0;
    s.operation = '';
    s.decimalAdded = false;
  }, 
  
  ////////////////
  //// EQUALS ////
  ////////////////
  equals: function() {
    // replace all instances of × and ÷ with * and / respectively
    s.operation = s.operation.replace(/×/g, '*').replace(/÷/g, '/');

    // find last character of equation
    // and remove it if it's not a number
    s.lastCharacter = s.operation[s.operation.length - 1];
    if( s.lastCharacter !== ')' && isNaN(s.lastCharacter) ) {
      s.operation = s.operation.replace(/.$/, '');
    }

    // if the equation isn't empty
    // evaluate and output the value
    if( s.operation ) {
      s.output.innerHTML = eval(s.operation);
      console.log(s.operation + ' = ' + eval(s.operation));
    }

    // reset decimalAdded and solved
    s.decimalAdded = false;
    s.solved = true;
  }, 
  
  /////////////////
  //// DECIMAL ////
  /////////////////
  decimal: function() {
    // if newNumber is true
    // reset output with the button value
    // set newNumber to false
    if( s.newNumber ) {
      s.output.innerHTML = s.btnVal;
      s.newNumber = false;

      // if newNumber is false and decimalAdded is false
      // add the decimal and then set decimalAdded to true
    } else {
      if( !s.decimalAdded ) {
        s.output.innerHTML = s.outputVal + s.btnVal;
        s.decimalAdded = true;
      }
    }

    // set the operation string
    s.operation = s.operation + s.btnVal;
  }, 
  
  ////////////////////
  //// PLUS/MINUS ////
  ////////////////////
  plusMinus: function() {
    // switch +/-
    var totalLength = s.operation.length,
        withParens = '(-' + s.outputVal.replace(/[^0-9.]/, '') + ')',
        outputLength,
        lastIndex,
        savedSlice,
        slicedOut;

    // if the output is negative
    if( s.outputVal.indexOf('-') > -1 ) {
      s.output.innerHTML = s.outputVal.replace('-', '');
      // slice out matching string and replace with positive version
      outputLength = withParens.length;
      lastIndex = s.operation.lastIndexOf( withParens );
      slicedOut = s.operation.slice(lastIndex, totalLength);
      savedSlice = s.operation.slice(0, lastIndex);
      s.operation = savedSlice + s.outputVal.replace(/[^0-9.]/, '');
      // if the output is positive
    } else {
      if( s.outputVal === '0' ) {
        s.output.innerHTML = '-';
      } else {
        s.output.innerHTML = '-' + s.outputVal;
      }
      // slice out matching string and replace with negative version
      // on parenthesis to solve double -- problems
      outputLength = s.outputVal.length;
      lastIndex = s.operation.lastIndexOf( s.outputVal );
      slicedOut = s.operation.slice(lastIndex, totalLength);
      savedSlice = s.operation.slice(0, lastIndex);
      s.operation = savedSlice + '(-' + slicedOut + ')';
    }
  }, 
  
  /////////////////
  //// PERCENT ////
  /////////////////
  percent: function() {
    var totalLength = s.operation.length,
        outputLength = s.outputVal.length,
        lastIndex,
        savedSlice,
        slicedOut;

    // slice out matching string and replace s.outputVal/100
    lastIndex = s.operation.lastIndexOf( s.outputVal );
    slicedOut = s.operation.slice(lastIndex, totalLength);
    savedSlice = s.operation.slice(0, lastIndex);
    s.output.innerHTML = s.outputVal/100;
    s.operation = savedSlice + s.outputVal/100;
  }, 
  
  ///////////////
  //// MINUS ////
  ///////////////
  minus: function() {
    // if the output is 0
    // add the - to the beginning
    if( s.outputVal === '0' ) {
      s.output.innerHTML = s.btnVal;
      s.operation = s.btnVal;

      // else add it to the operation and reset newNumber
    } else {
      s.lastCharacter = s.operation[s.operation.length - 1];
      if( s.lastCharacter === ')' || !isNaN(s.lastCharacter) ) {
        s.newNumber = true;
      }
      s.operation = s.operation + s.btnVal;
    }

    // reset decimalAdded
    // reset solved
    s.decimalAdded = false;
    s.solved = false;
  }, 
  
  /////////////////////////////////////
  //// OPERATORS THAT AREN'T MINUS ////
  /////////////////////////////////////
  operators: function() {
    // find last character of the output
    // if it's another operator strip it and add the new operator
    // else add the operator to the output
    s.lastCharacter = s.outputVal[s.outputVal.length - 1];
    if( s.operators.indexOf(s.lastCharacter) >= 0 ) {
      s.output.innerHTML = s.outputVal;
      s.operation = s.operation.replace(/.$/, '') + s.btnVal;
    } else {
      s.output.innerHTML = s.outputVal;
      s.operation = s.outputVal + s.btnVal;
    }

    // reset decimalAdded so the next number can get one if need be
    // reset newNumber so the output is replaced with the next value
    // reset solved so the operation continues
    s.decimalAdded = false;
    s.newNumber = true;
    s.solved = false;
  }, 
  
  /////////////////
  //// NUMBERS ////
  /////////////////
  numbers: function() {
    // if the current output is 0 replace the zero and add the button value
    // or if the equation has been solved and the user start typing a new number
    if( s.outputVal === '0' || s.solved ) {
      s.output.innerHTML = s.btnVal;
      s.operation = s.btnVal;
      s.solved = false;

      // if the current output isn't 0
      // or the equation hasn't been solved yet
    } else {
      // if we need to reset the number
      // replace the output with just that button value
      // and set newNumber to false
      if( s.newNumber ) {
        s.output.innerHTML = s.btnVal;
        s.newNumber = false;

        // if we don't need to reset
        // add the button value to the output
      } else {
        s.output.innerHTML = s.outputVal + s.btnVal;
      }
      s.operation = s.operation + s.btnVal;
    }
  }
};
  
(function() {
  Calc.init();
})();