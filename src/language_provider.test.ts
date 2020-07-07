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
