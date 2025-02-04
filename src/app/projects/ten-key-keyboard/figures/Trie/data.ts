export class Trie {
  /** Check if the current node marks a complete word */
  #isEnd = false;

  /** Store sub-`Trie` */
  #children: Record<string, Trie> = {};

  constructor() {}

  public get isEnd() {
    return this.#isEnd;
  }

  public get children() {
    return this.#children;
  }

  /**
   * Check if given `char` is present in current `Trie`.
   */
  hasChar(char: string): Trie | null {
    const searchChar = this.children[char];
    if (typeof searchChar !== "undefined") {
      return searchChar;
    }

    return null;
  }

  /**
   * Add `Trie` at given `char`, and return new added `Trie`.
   */
  addChar(char: string): Trie {
    const newSubTrie = new Trie();
    this.children[char] = newSubTrie;
    return newSubTrie;
  }

  /**
   * Mark complete word found in current `Trie`.
   */
  makeEnd(): void {
    this.#isEnd = true;
  }

  /**
   * Search given `word` in `Trie`.
   */
  searchTrie(word: string): boolean {
    if (word.length === 0) {
      return true;
    }

    const subTrie = this.hasChar(word[0]);
    if (subTrie === null) {
      return false;
    }

    return subTrie.searchTrie(word.slice(1));
  }

  /**
   * Add `word` to this `Trie`.
   */
  addWord(word: string): void {
    if (word.length === 0) {
      this.makeEnd();
      return;
    }

    const subTrie = this.hasChar(word[0]);
    if (subTrie !== null) {
      return subTrie.addWord(word.slice(1));
    } else {
      const newSubTrie = this.addChar(word[0]);
      return newSubTrie.addWord(word.slice(1));
    }
  }

  /**
   * Static constructor to build a `Trie` from a list of words (`wordList`).
   */
  static buildTrie = (wordList: string[]): Trie => {
    const trie = new Trie();
    for (let i = 0; i < wordList.length; i++) {
      const word = wordList[i];
      trie.addWord(word);
    }

    return trie;
  };
}
