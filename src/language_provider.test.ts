import { TypeaheadOutput } from '@grafana/ui';
import Prism, { Token } from 'prismjs';
import { XRayLanguageProvider } from 'language_provider';
import { tokenizer } from 'syntax';
import { Value } from 'slate';

describe('XRayLanguageProvider', () => {
  it('should suggest all keywords all the time', async () => {
    const result = await getProvideCompletionItems('\\');
    expect(result.suggestions.length).toBe(4);
  });
});

describe('tokenizer', () => {
  it(`should find 3 tokens in this string 'error and'`, () => {
    const tokens: Token[] = Prism.tokenize('error and', tokenizer) as any;
    expect(tokens).toHaveLength(3);
    expect(tokens[0].type).toBe('function');
    expect(tokens[2].type).toBe('logicalOperator');
  });
  it(`should handle http.s as one token`, () => {
    const tokens: Token[] = Prism.tokenize('http.s', tokenizer) as any;
    expect(tokens).toHaveLength(1);
  });
  it(`should handle trace ids as one token`, () => {
    const tokens: Token[] = Prism.tokenize('1-5f0c749d-ed77ad44e0ecad58ce19e689', tokenizer) as any;
    expect(tokens).toHaveLength(1);
  });
});

/**
 * Get suggestion items based on query. Use `\\` to mark position of the cursor.
 */
function getProvideCompletionItems(query: string): Promise<TypeaheadOutput> {
  const provider = new XRayLanguageProvider({} as any);
  const cursorOffset = query.indexOf('\\');
  const queryWithoutCursor = query.replace('\\', '');
  let tokens: Token[] = Prism.tokenize(queryWithoutCursor, tokenizer) as any;
  tokens = addTokenMetadata(tokens);
  const value = new ValueMock(tokens, cursorOffset);
  return provider.provideCompletionItems({ value } as any);
}

class ValueMock {
  selection: Value['selection'];
  data: Value['data'];

  constructor(tokens: Array<string | Token>, cursorOffset: number) {
    this.selection = {
      start: {
        offset: cursorOffset,
      },
    } as any;

    this.data = {
      get() {
        return tokens;
      },
    } as any;
  }
}

/**
 * Adds some Slate specific metadata
 * @param tokens
 */
function addTokenMetadata(tokens: Array<string | Token>): Token[] {
  let prev = undefined as any;
  let offset = 0;
  return tokens.reduce((acc, token) => {
    let newToken: any;
    if (typeof token === 'string') {
      newToken = {
        content: token,
        // Not sure what else could it be here, probably if we do not match something
        types: ['whitespace'],
      };
    } else {
      newToken = { ...token };
      newToken.types = [token.type];
    }
    newToken.prev = prev;
    if (newToken.prev) {
      newToken.prev.next = newToken;
    }
    const end = offset + token.length;
    newToken.offsets = {
      start: offset,
      end,
    };
    prev = newToken;
    offset = end;
    return [...acc, newToken];
  }, [] as Token[]);
}
