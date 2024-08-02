import { LanguageProvider } from '@grafana/data';
import { XrayDataSource } from 'XRayDataSource';
import { TypeaheadInput, TypeaheadOutput } from '@grafana/ui';
import { BOOLEAN_KEYWORDS, NUMBER_KEYWORDS, STRING_KEYWORDS, COMPLEX_KEYWORDS } from 'syntax';

const booleanKeyWords = { prefixMatch: true, label: 'Boolean Keywords', items: BOOLEAN_KEYWORDS };
const numberKeyWords = { prefixMatch: true, label: 'Number Keywords', items: NUMBER_KEYWORDS };
const stringKeyWords = { prefixMatch: true, label: 'String Keywords', items: STRING_KEYWORDS };
const complexKeyWords = { prefixMatch: true, label: 'Complex Keywords', items: COMPLEX_KEYWORDS };

export class XRayLanguageProvider extends LanguageProvider {
  datasource: XrayDataSource;

  constructor(dataSource: XrayDataSource, initialValues?: any) {
    super();
    this.datasource = dataSource;

    Object.assign(this, initialValues);
  }

  request = async () => {
    return Promise.resolve();
  };

  start = async () => {
    return [];
  };

  /**
   * Return suggestions based on input that can be then plugged into a type ahead dropdown.
   */
  async provideCompletionItems({ value }: TypeaheadInput): Promise<TypeaheadOutput> {
    if (!value) {
      return { suggestions: [] };
    }

    // Get all the keyword for now every time
    return this.getAllKeywords();
  }

  private getAllKeywords = (): TypeaheadOutput => {
    return { suggestions: [booleanKeyWords, numberKeyWords, stringKeyWords, complexKeyWords] };
  };
}
