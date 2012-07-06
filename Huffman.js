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

function Huffman() {
    
    this.huffmanDemo = function(text) {
        
        // Compress the text. Runs the actual Huffman Coding algorithm.
        this.compress(text);
        
        // Uncompress the text using the tree.  Returns a string.
        // This function takes an argument rather than using its member variable
        // because it should be able to take an arbitrary tree.
        var uncompressed = this.decompress(this.tree);

        var ans = {
            table : this.table,
            tree: this.tree,
            packedBitstring: this.packedBitstring,
            uncompressed: uncompressed
        };

        return ans;         
    }
    
    
    this.compress = function(text){
        this.text = text;
        
        // Frequency Table
        this.freq = this.generateFreqTable(this.text);
        
        // Binary Tree
        this.tree = this.generateTree(this.freq);
        
        // Character -> Huffman Code table
        this.table = this.generateCharLookupTable(this.tree);
        
        // Compress text using table.  Returns Bitstring.PackedBitstring object
        this.packedBitstring = this.compressText(this.table, this.text);
    }
    
    this.decompress = function(tree) {
        var uncompressed = this.uncompressBitstring(tree, this.packedBitstring);
        return uncompressed;
    }

    
    /* Using the huffman table, convert the text into an array of integers */
    this.compressText = function(table, text) {
        var c;
        var i;

        var bitstring = '';

        for (i=0; i<text.length; i++) {
            var c = text[i];
            bitstring += table[c];
        }

        // That's a big ass bitstring!
        // Let's pack the bits into a series of integers now.
        var packedBitstring = Bitstring.pack(bitstring);

        return packedBitstring;
    }

    /* Converts packed array into the original string. */
    this.uncompressBitstring = function(tree, packedBitstringObj) {
        var bitstring = Bitstring.unpack(packedBitstringObj);
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

    /* Generate a table indexed by character from a huffman tree.
    * The table and path parameters should not be specified by the user.
    * Examines every node in the tree recursively.
    */
    this.generateCharLookupTable = function(rootNode, table, path) {
        // dead end
        if (rootNode === null) {
            return;
        }

        // first run
        if (table === undefined || path === undefined) {
            table = [];
            path = '';
        }
        
        // if we've found a character, save it in the table
        // along with its code
        if (rootNode.c !== null) {
            table[rootNode.c] = path;
        }

        this.generateCharLookupTable(rootNode.left, table, path + '0');
        this.generateCharLookupTable(rootNode.right, table, path + '1');

        return table;
    }

    this.generateTree = function(freq) {
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

    this.generateFreqTable = function(text) {
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

}
