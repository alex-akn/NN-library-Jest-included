class ActivationFunction{
    constructor(func, dfunc){
        this.func = func;
        this.dfunc = dfunc;
    }
}

let sigmoid = new ActivationFunction(
    x => 1 / (1 + Math.exp(-x)),
    y => y * (1 - y)
);

let tanh = new ActivationFunction(
    x => Math.tanh(x),
    y => 1 - (y * y)
)

class NeuralNetwork {
    constructor(a, b, c){
        if(a instanceof NeuralNetwork) {
            this.input_nodes = a.input_nodes;
            this.hidden_nodes = a.hidden_nodes;
            this.output_nodes = a.output_nodes;    
            this.weights_ih = a.weights_ih.copy();
            this.weights_ho = a.weights_ho.copy();
            this.bias_h = a.bias_h.copy();
            this.bias_o = a.bias_o.copy();
            this.lr = a.lr;
            this.aFunc = a.aFunc;
        } else {
            this.input_nodes = a;
            this.hidden_nodes = b;
            this.output_nodes = c;    
            this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
            this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
            this.weights_ih.randomize();
            this.weights_ho.randomize();
            this.bias_h = new Matrix(this.hidden_nodes, 1);
            this.bias_o = new Matrix(this.output_nodes, 1);
            this.bias_o.randomize();
            this.bias_h.randomize();
            this.lr = 0.1;
            this.aFunc = sigmoid;
        }        
    }

    /**
     * @param {ActivationFunction} funcObj
     */
    set activationFunction(funcObj){
        this.aFunc = funcObj;
    }

    feedForward(input_array){
        //Generating the hidden outputs
        let inputs = Matrix.fromArray(input_array);
        let hidden = Matrix.mult(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        hidden.map(this.aFunc.func);//activation function

        //Generatin the output's output
        let outputs = Matrix.mult(this.weights_ho, hidden);
        outputs.add(this.bias_o);
        outputs.map(this.aFunc.func);

        return outputs;
    }

    predict(input){
        return this.feedForward(input);
    }

    setLearningRate(lr = 0.1){
        this.lr = lr;
    }

    train(input_array, target_array){
        //let outputs = this.feedForward(inputs);
        let inputs = Matrix.fromArray(input_array);
        let hidden = Matrix.mult(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        hidden.map(this.aFunc.func);
        //Generatin the output's output
        let outputs = Matrix.mult(this.weights_ho, hidden);
        outputs.add(this.bias_o);
        outputs.map(this.aFunc.func);

        let targets = Matrix.fromArray(target_array);
        // ERROR = TARGETS - OUTPUTS
        let output_errors = Matrix.subtract(targets, outputs);
        let weights_ho_transposed = Matrix.transpose(this.weights_ho);
        let hidden_errors = Matrix.mult(weights_ho_transposed, output_errors);

        // ΔW = lr * E * O' * H^
        // O' - gradients = sigmoid' = O * (1 - O)
        // H^ - transposed vector H (hidden)
        // Calculate gradient
        let gradients = Matrix.map(outputs, this.aFunc.dfunc);        
        gradients.scale(output_errors);
        gradients.scale(this.lr);
        // Calculate deltas
        let hidden_T = Matrix.transpose(hidden);
        let weight_ho_deltas = Matrix.mult(gradients, hidden_T);

        // Adjust the weights by deltas
        this.weights_ho.add(weight_ho_deltas);
        // Adjust the biases by its deltas (which is just the gradients)
        this.bias_o.add(gradients);

        // Calculate hidden gradients
        let hidden_gradients = Matrix.map(hidden, this.aFunc.dfunc);
        hidden_gradients.scale(hidden_errors);
        hidden_gradients.scale(this.lr);
        // deltas
        let inputs_T = Matrix.transpose(inputs);
        let weight_ih_deltas = Matrix.mult(hidden_gradients, inputs_T);

        // Adjust wieghts
        this.weights_ih.add(weight_ih_deltas);
        // Adjust biases
        this.bias_h.add(hidden_gradients);        
    }

    serialize(){
        return JSON.stringify(this);
    }

    static deserialize(data){             

        if(typeof data == 'string'){
            data = JSON.parse(data);
        }
        let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
        nn.weights_ih = Matrix.deserialize(data.weights_ih);
        nn.weights_ho = Matrix.deserialize(data.weights_ho);
        nn.bias_h = Matrix.deserialize(data.bias_h);
        nn.bias_o = Matrix.deserialize(data.bias_o);
        nn.lr = data.lr;
        return nn;
    }

    // Functions for Neuroevolution

    copy() {
        return new NeuralNetwork(this);
    }

    mutate(rate){
        function mutate(val) {
            if(Math.random() < rate) {
                return val + randomGaussian(0, 0.1);
            } else {
                return val;
            }
        }
        this.weights_ho.map(mutate);
        this.weights_ih.map(mutate);
        this.bias_h.map(mutate);
        this.bias_o.map(mutate);
    }

}