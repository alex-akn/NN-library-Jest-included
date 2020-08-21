const Matrix = require('./matrix');

test('adding a scalar to matrix', () => {
    let m = new Matrix(3, 3);
    m.matrix[0] = [1, 2, 3];
    m.matrix[1] = [4, 5, 6];
    m.matrix[2] = [7, 8, 9];
    m.add(1);
    
    expect(m).toEqual({
        matrix: [
            [2, 3, 4],
            [5, 6, 7],
            [8, 9, 10]
        ],
        rows: 3,
        cols: 3
    });
  });
