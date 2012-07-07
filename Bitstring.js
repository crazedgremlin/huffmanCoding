// Create the Bitstring object and attach functions to it.  Equivalent of
// static methods since we don't have to instantiate Bitstring.


Bitstring = {};


// Define class that contains the number of bits and the array of integers
// containing those bits.
Bitstring.PackedBitstring = function(numBits, arr) {
    this.numBits =  numBits;
    this.arr = arr;
    
    
    this.toString = function() {
        var str = '';
        
        str += "Num Bits: " + this.numBits +
        "<br>" +
        "Num Bytes: " + this.numBits / 8 + 
        "<br>" + 
        "Arr = " + this.arr;
        
        return str;
    }
}


// Pack the '0' and '1' characters into 0 and 1 bits in an array of integers.
Bitstring.pack = function(bitstring) {
    var numBits = bitstring.length;
    var i=0;
    var stop;
    
    // integer answer
    var arr = [];
    
    // contains the bits for one integer
    var bitBuffer = [];
    
    while (i < numBits) {
        stop = i+Integer.BITS_PER_INT;
        
        var j=0;
        while (i < stop) {
            bitBuffer[j] = bitstring[i];
            j++;
            i++;
        }
        var int = Integer.pack(bitBuffer);
        arr.push(int);
    }
    
   
    var ans = new Bitstring.PackedBitstring(numBits, arr);
    
    return ans;
}

// Input is a Bitstring.PackedBitstring object
// Output is a string of '0's and '1's
Bitstring.unpack = function(packedBitstringObj) {
    var numBits = packedBitstringObj.numBits;
    var arr = packedBitstringObj.arr;
    var bitstring = '';
    
    for (i in arr) {
        var thisInt = arr[i];       
        var subBitstring = Integer.unpack(thisInt);
        
        var j=0;
        while (j < subBitstring.length && bitstring.length < numBits) {
            var thisBit = subBitstring[j];
            bitstring += (thisBit);
            j++;
        }
    }
    
    return bitstring;
}


