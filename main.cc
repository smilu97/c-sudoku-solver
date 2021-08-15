#include <cstdio>
#include <vector>
#include <string>
using namespace std;

void print_vector_int(vector<int> &v) {
  for (auto i: v) {
    printf("%d ", i);
  } puts("");
}

class Sudoku {
public:
  int n;
  vector<int> value;
  vector<vector<int>> binding;
  Sudoku(int n) {
    value = vector<int>(n);
  }
  Sudoku(const char* pathname) {
    if (!read_bindings(pathname)) {
      throw "Couldn't find group file";
    }
  }
  bool read_value(const char* pathname) {
    FILE* fd = fopen(pathname, "r");
    if (fd == NULL) return false;
    for (int i = 0; i < 81; i++) {
      fscanf(fd, "%d", &value[i]);
    }
    fclose(fd);
    return true;
  }
  bool read_bindings(const char* pathname) {
    FILE* fd = fopen(pathname, "r");
    if (fd == NULL) return false;
    fscanf(fd, "%d", &n);
    value = vector<int>(n);
    binding = vector<vector<int>>(n);
    while (1) {
      int k; fscanf(fd, "%d", &k);
      if (k == 0) break;
      vector<int> group(k);
      for (int i = 0; i < k; i++) {
        int tmp; fscanf(fd, "%d", &tmp);
        group[i] = tmp;
      }
      add_group(group);
    }
    fclose(fd);
    return true;
  }
  void add_group(vector<int> group) {
    for (auto u: group) {
      for (auto v: group) {
        if (u == v) continue;
        binding[u].push_back(v);
      }
    }
  }
  bool fill_cell(int u) {
    if (u == n) return true;
    if (value[u] != 0) return fill_cell(u + 1);

    vector<bool> s(10, false);
    for (auto v: binding[u]) {
      s[value[v]] = true;
    }

    int next = u + 1;
    for (int i = 1; i < 10; i++) {
      if (s[i]) continue;
      value[u] = i;
      if (fill_cell(next)) return true;
    }

    value[u] = 0;
    return false;
  }
  void print() {
    for (int i = 0; i < 9; i++) {
      for (int j = 0; j < 9; j++) {
        printf("%d ", value[i*9+j]);
      } puts("");
    }
  }
};

int main(int argc, char** argv)
{
  if (argc < 2) {
    printf("syntax: %s <board.txt> |group.txt| \n", argv[0]);
    return -1;
  }
  try {
    Sudoku sudoku(argc < 3 ? "./groups/basic.txt" : argv[2]);
    if (!sudoku.read_value(argv[1])) {
      printf("%s doesn't exist\n", argv[1]);
      return -1;
    }
    if (!sudoku.fill_cell(0)) {
      throw "Couldn't find solution";
    }
    sudoku.print();
  } catch (const char* message) {
    puts(message);
    return -1;
  }
}
