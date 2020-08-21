class Matrix{
    constructor(rows, cols){
        this.rows = rows;
        this.cols = cols;
        this.matrix = [];

        for(let i = 0; i < this.rows; i++){
            this.matrix[i] = [];
            for(let j = 0; j < this.cols; j++){
                this.matrix[i][j] = 0;
            }
        }
    }

    copy(){        
        let m = Matrix.map(this, el => el);
        return m;
    }

    randomize(){
        this.each(function(el, i, j){
            return Math.random() * 2 - 1;
        });        
    }

    static transpose(m){
        let result = new Matrix(m.cols, m.rows);
        
        for(let i = 0; i < m.rows; i++){
            for(let j = 0; j < m.cols; j++){
                result.matrix[j][i] = m.matrix[i][j];
            }
        }
        return result;
    }

    static mult(a, b) {        
            if(a.cols !== b.rows){
                console.log("Columns of A must match rows of B.");
                return undefined;
            }
            let result = new Matrix(a.rows, b.cols);
            result.each(function(el, i, j){
                // Dot product
                let sum = 0;
                for(let k = 0; k < a.cols; k++){
                    sum += a.matrix[i][k] * b.matrix[k][j];
                }
                return sum;
            });
            
            return result;      
    }

    static fromArray(arr){
        let m = new Matrix(arr.length, 1);
        for(let i = 0; i < arr.length; i++){
            m.matrix[i][0] = arr[i];
        }
        return m;
    }

    // return a new Matrix a-b
    static subtract(a, b){      
         
        let result = new Matrix(a.rows, a.cols);
        result.each(function(el, i, j){
            return a.matrix[i][j] - b.matrix[i][j];
        });       

        return result;
    }

    static map(m, func){
        let result = new Matrix(m.rows, m.cols);
        result.each((el, i, j) => {
            let val = m.matrix[i][j];
            return func(val);
        });
        return result;
    }

    toArray(){
        let arr = [];
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
                arr.push(this.matrix[i][j]);
            }
        }
        return arr;
    }

    scale(n){
        if(n instanceof Matrix){
            this.each(function(el, i, j){
                return el * n.matrix[i][j];
            });
        } else {
            this.each(function(el, i, j){
                return el * n;
            });
        }
    }

    add(n) {

        if(n instanceof Matrix){
            this.each(function(el, i, j){
                return el + n.matrix[i][j];
            });            
        } else {
            this.each(function(el, i, j){
                return el + n;
            });           
        }        
    }

    map(func){
        //Apply a function to every element of matrix
        this.each(func);
    }
    
    each(func){
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
                this.matrix[i][j] = func(this.matrix[i][j], i, j);
            }
        }
    }

    print(){
        console.table(this.matrix);
    }

    serialize(){
        return JSON.stringify(this);
    }

    static deserialize(data){        

        if(typeof data == 'string'){
            data = JSON.parse(data);
        } 
        let m = new Matrix(data.rows, data.cols);
        m.matrix = data.matrix;
        return m;
    } 
    
}

if(typeof module !== undefined) {
    module.exports = Matrix;
}