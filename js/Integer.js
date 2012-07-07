// Static functions for packing and unpacking integers

Integer = {};
Integer.BITS_PER_INT = 32;

Integer.unpack = function(num) {
    var i;
    var bit;
    var bits = [];
    for (i=0; i<Integer.BITS_PER_INT; i++) {
        bit = num & 1;
        bits.push(bit);
        num >>= 1;
    }
    bits.reverse();
    return bits;
}

Integer.pack = function(bitsArr) {
    var i;
    var packing = 0;
    
    for (i=0; i<Integer.BITS_PER_INT; i++) {
        packing <<= 1;
        packing |= bitsArr[i];
    }
    
    return packing;
}


Integer.testPacking = function() {
    var str = '';
    var i;

    
    for (i=0; i<70; i++) {
        str += Math.floor(Math.random() + 0.5);
    }

    var packed = Bitstring.pack(str);
    var unpacked = Bitstring.unpack(packed);

    console.log("A = " + str);
    console.log("B = " + unpacked);
    
}
