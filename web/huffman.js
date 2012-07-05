/*

Proof of concept code.

Idea is to create a library for compressing and decompressing content using
huffman coding with explicit tree generation.  This way, we could cut down on
the amount of network traffic between client and server (server-side code would
be an obvious next step).

Dan McArdle
6/3/12

*/

var BITS_PER_INT = 32;

window.onload = function() {
    
    // Get the main divs
    var toBeCompressedDiv = document.getElementById('compressMe');
    var compressedDiv = document.getElementById('compressed');
    var uncompressedDiv = document.getElementById('uncompressed');


    var text = toBeCompressedDiv.innerHTML;
    var huff = huffman(text);


    compressedDiv.innerHTML = huff.packedArray;
    uncompressedDiv.innerHTML = huff.uncompressed;
    
    
    // TEST the packBitstring and unpackArray functions
    // I suspect that they are not behaving correctly    
    testPacking();
}

function testPacking() {
    var str = '';
    var i;

    
    for (i=0; i<32; i++) {
        str += Math.floor(Math.random() + 0.5);
    }

    var packed = packBitstring(str);
    var unpacked = unpackArray(packed);

    console.log("A = " + str);
    console.log("B = " + unpacked);


}

function huffman(text) {
    var freq = generateFreqTable(text);
    var tree = generateTree(freq);
    var table = generateTable(tree);
    
    console.log("FREQ");
    console.log(freq);
    
    var packedArray = compressText(table, text);


    // TODO save frequency information into package and generate tree from that
    var uncompressed = uncompressBitstring(tree, packedArray);

    var ans = {
        table : table,
        packedArray: packedArray,
        uncompressed: uncompressed
    };

    return ans;         
}


/* Using the huffman table, convert the text into an array of integers */
function compressText(table, text) {
    var c;
    var i;

    var bitstring = '';

    for (i=0; i<text.length; i++) {
        var c = text[i];
        bitstring += table[c];
    }

    // That's a big ass bitstring!
    // Let's pack the bits into a series of integers now.
    packedArray = packBitstring(bitstring);

    return packedArray;
}

function uncompressBitstring(tree, packedArray) {
    var bitstring = unpackArray(packedArray);
    var text = '';

    var char;
 
    var node = tree;
    
    for (i in bitstring) {
        char = bitstring[i];
        if (char == '0') {
            node = node.left;
        } else {
            node = node.right;
        }
        
        if (node.c !== null) {
            text += node.c;
            node = tree;
        }
        
    }
    
    return text;
}



/* Pack the '0' and '1' characters into 0 and 1 bits in an array of integers.
 */
function packBitstring(bitstring) {
    var packed = [];
    var packing = 0;
    var count = 0;

    for (var i=bitstring.length-1; i>=0; i--) {
        c = bitstring[i];

        packing = packing << 1;
        packing += parseInt(c);
        count++;
        if (count == BITS_PER_INT) {
            packed.push(packing);
            packing = 0;
            count = 0;
        }
    }

    // if there's some left over
    if (count > 0) {
        packed.push(packing);
    }

    return packed;
}

function unpackArray(array) {
    var bitstring = '';
    var unpacking;
    var num;
    var count = 0;
    var i, j;

    for (i in array) {
        unpacking = array[i];

        for (j=0; j<BITS_PER_INT; j++) {
            // apply bitmask
            num = unpacking & 1;
            // convert 0 or 1 to '0' or '1' and add to bitstring
            bitstring += num;
            // shift to the right by one bit
            unpacking = unpacking >> 1;
        }
    }

    return bitstring;
}


/* Generate a table from a huffman tree. The table and path parameters should
 * not be specified by the user.
 */
function generateTable(rootNode, table, path) {
    // dead end
    if (rootNode === null) {
        return;
    }

    // first run
    if (table === undefined || path === undefined) {
        table = [];
        path = '';
    }
    
    if (rootNode.c !== null) {
        console.log(path + ' -> "' + rootNode.c + '"');
        table[rootNode.c] = path;
    }

    generateTable(rootNode.left, table, path + '0');
    generateTable(rootNode.right, table, path + '1');

    return table;
}




function generateTree(freq) {
    var q = new PriorityQueue();
    var c;
    var i;

    // create a leaf node for each symbol, add to priority queue
    for (i=0; i<freq.length; i++) {
        var f = freq[i];
        var leaf = new Node(f.character, f.frequency);
        q.push(leaf);
    }


    while (q.length() > 1) {
        // remove two nodes
        var a = q.pop();
        var b = q.pop();

        // create a new node with the sum of their probabilities
        var newNode = new Node(null, null);
        newNode.left = a;
        newNode.right = b;
        newNode.prob = a.prob + b.prob;

        // push new node back onto queue
        q.push(newNode);
    }

    var root = q.pop();
    console.log(root);
    
    return root;
}


function generateFreqTable(text) {
    // count the occurrences of each character in text
    var counter = [];
    var i;
    for (i=0; i<text.length; i++) {
        var c = text[i];

        // in case we haven't seen this character yet
        if (counter[c] === undefined)
            counter[c] = 0;

        counter[c]++;
    }

    // push each character count into a different structure
    var sorted = [];
    var c;
    i = 0;
    for (c in counter) {
        sorted[i] = {
            character: c,
            frequency: counter[c]
        }; 
        i++;
    }

    // sort this new structure by ascending frequency
    sorted.sort(function(a,b) {
        return a.frequency - b.frequency;
    });

    return sorted;
}


/*--------------- DATA TYPES ------------------*/

// Define a priority queue which pops the item with the lowest
// freq value.
function PriorityQueue() {
    this.list = [];
    
    this.length = function() {
        return this.list.length;
    }
    
    this.push = function(item) {
        this.list.push(item);
    }
    
    this.pop = function(item) {
        var item;
        var minItem;
        var minIndex = 0;
        
        for (var i=1; i<this.list.length; i++) {
            item = this.list[i];
            minItem = this.list[minIndex];
            
            if (item.freq < minItem.freq) {
                minIndex = i;
            }
        }
        
        // remove the item @ minIndex from the list
        item = this.list.splice(minIndex, 1);
        
        // grab the first item from the result array
        return item[0];
    }
    
    this.test = function() {
        function assertEqual(experimental, expected, strDesc) {
            if (!strDesc) {
                strDesc = '';
            }
            
            // test if the values are equal
            if (experimental != expected) {
                console.error('FAIL: ' + experimental + ' != ' + expected);
            } else {
                console.log('PASS: ' + experimental + ' == ' + expected);
            }
        }
        
        // define datatype with freq
        function Test(freq) {
            this.freq = freq;
        }
        
        this.push(new Test(1));
        this.push(new Test(2));
        this.push(new Test(0));
        this.push(new Test(3));
    
        
        assertEqual( this.pop().freq, 0 );
        assertEqual( this.pop().freq, 1 );
        assertEqual( this.pop().freq, 2 );
        assertEqual( this.pop().freq, 3 );
    }
}

// node data type
function Node(character, prob) {
    this.c = character;
    this.prob = prob;
    this.left = null;
    this.right = null;
}

