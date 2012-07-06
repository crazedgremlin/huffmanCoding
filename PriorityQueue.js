
// Data type used by the queue
function Node(character, prob) {
    this.c = character;
    this.prob = prob;
    this.left = null;
    this.right = null;
}


// Define a priority queue which pops the item with the lowest prob value.
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
            
            if (item.prob < minItem.prob) {
                minIndex = i;
            }
        }
        
        // remove the item @ minIndex from the list
        item = this.list.splice(minIndex, 1);
        
        // grab the only item from the result of splice()
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
            this.prob = freq;
        }
        
        this.push(new Test(1));
        this.push(new Test(2));
        this.push(new Test(0));
        this.push(new Test(3));
    
        
        assertEqual( this.pop().prob, 0 );
        assertEqual( this.pop().prob, 1 );
        assertEqual( this.pop().prob, 2 );
        assertEqual( this.pop().prob, 3 );
    }
}


