class TrieNode {
  children: { [key: string]: TrieNode };
  isEnd: boolean;
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

export class TrieService {
  root: TrieNode;
  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string) {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children[char]) node.children[char] = new TrieNode();
      node = node.children[char];
    }
    node.isEnd = true;
  }

  autoSuggestion(prefix: string): string[] {
    let node = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }
    const result: string[] = [];
    this._autoSuggestionHelper(node, prefix, result);
    return result;
  }

  private _autoSuggestionHelper(
    node: TrieNode,
    prefix: string,
    result: string[]
  ) {
    if (node.isEnd) result.push(prefix);
    for (const char in node.children) {
      this._autoSuggestionHelper(node.children[char], prefix + char, result);
    }
  }
}
