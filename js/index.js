const inputs = document.getElementsByTagName('input');

function range(n) {
  return Array(n).fill(0).map((_, i) => i);
}

function readValues() {
  const values = {};
  for (var i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    values[i] = Number(input.value);
  }
  return values;
}

function writeValues(values) {
  for (var i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    input.value = String(values[i]);
  }
}

function solveSudoku() {
  const values = readValues();

  const row = range(9).map(_ => range(10).map(_ => false));
  const col = range(9).map(_ => range(10).map(_ => false));
  const cell = range(3).map(_ => range(3).map(_ => range(10).map(_ => false)));
  const tbl = range(9).map((_, x) => range(9).map((_, y) => values[x*9 + y]));

  console.log('init table:', tbl);

  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      if (tbl[x][y]) {
        row[x][tbl[x][y]] = true;
        col[y][tbl[x][y]] = true;
        cell[Math.floor(x/3)][Math.floor(y/3)][tbl[x][y]] = true;
      }
    }
  }

  const isInsertable = (x, y, v) => {
    return !row[x][v] && !col[y][v] && !cell[Math.floor(x/3)][Math.floor(y/3)][v];
  };

  const insert = (x, y, v) => {
    if (false === isInsertable(x, y, v)) return false;

    tbl[x][y] = v;
    row[x][v] = true;
    col[y][v] = true;
    cell[Math.floor(x/3)][Math.floor(y/3)][v] = true;

    return true;
  };

  const remove = (x, y, v) => {
    if (isInsertable(x, y, v)) throw Error('Inappropriate remove called!');

    tbl[x][y] = 0;
    row[x][v] = false;
    col[y][v] = false;
    cell[Math.floor(x/3)][Math.floor(y/3)][v] = false;
  };

  const findFirstRecursively = (x, y) => {
    if (x >= 9) return tbl;

    let nx = x, ny = y + 1;
    if (ny >= 9) {
      nx = x + 1;
      ny = 0;
    }

    if (tbl[x][y]) return findFirstRecursively(nx, ny);

    for (let v = 1; v <= 9; v++) {
      if (insert(x, y, v)) {
        const res = findFirstRecursively(nx, ny);
        if (res !== null) return res;
        remove(x, y, v);
      }
    }

    return null;
  };

  return findFirstRecursively(0, 0);
}

function solve() {
  const tbl = solveSudoku();
  if (tbl !== null) {
    const values = {};

    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        values[x*9 + y] = tbl[x][y];
      }
    }

    writeValues(values);
  }
}
