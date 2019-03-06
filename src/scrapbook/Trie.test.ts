import * as Trie from './Trie';

describe('Trie', () => {
  let trie;

  beforeEach(() => {
    trie = Trie.fromMap({
      abc: 1,
      ab: 2,
      // abc: 3,
      abd: 4,
    });

    // trie.set(['a', 'b', 'c'], 1);
    // trie.set(['a', 'b'], 2);
    // trie.set(['a', 'b', 'c'], 3);
    // trie.set(['a', 'b', 'd'], 4);
  });

  it('returns the value of existing key', () => {
    expect(trie.get(['a', 'b', 'c']).value).toBe(3);
    expect(trie.get(['a', 'b']).value).toBe(2);
  });

  it('returns undefined for non-existing keys', () => {
    expect(trie.get(['a', 'a'])).toBeUndefined();
    expect(trie.get(['a', 'b', 'c', 'd'])).toBeUndefined();
  });

  it('supports partially traverse the tree', () => {
    const node = trie.get(['a', 'b']);
    expect(node.get(['c']).value).toBe(3);
    expect(
      trie
        .get(['a'])
        .get(['b'])
        .get(['d'])
        .value
    ).toBe(4);
  });

  // because we support partial traversal - think partial fn application
  it('returns the node itself for empty keyparts', () => {
    expect(trie.get([])).toEqual(trie);
  });
});
