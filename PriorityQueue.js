
// Define a priority queue which pops the item with the lowest value
// contained in the 'field' attribute.

function PriorityQueue(field) {

    this.list = [];
    this.field = field;

    // dynamically return list length
    this.length = function() {
        return this.list.length;
    }
    
    // where the item is pushed doesn't matter because we're finding the min
    // when we pop
    this.push = function(item) {
        this.list.push(item);
    }
    
    // find the item with the minimum field attribute
    this.pop = function(item) {
        var item;
        var minItem;
        var minIndex = 0;
        
        for (var i=1; i<this.list.length; i++) {
            item = this.list[i];
            minItem = this.list[minIndex];
            
            if (item[this.field] < minItem[this.field]) {
                minIndex = i;
            }
        }
        
        // remove the item @ minIndex from the list
        item = this.list.splice(minIndex, 1);
        
        // grab the only item from the result of splice()
        return item[0];
    }
    


    // tests if this data structure is working as expected
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
            this[this.field] = freq;
        }
        
        this.push(new Test(1));
        this.push(new Test(2));
        this.push(new Test(0));
        this.push(new Test(3));
    
        
        assertEqual( this.pop()[this.field], 0 );
        assertEqual( this.pop()[this.field], 1 );
        assertEqual( this.pop()[this.field], 2 );
        assertEqual( this.pop()[this.field], 3 );
    }
}


