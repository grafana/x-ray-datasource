import { queryTypeOptionToQueryType } from './QueryEditorForm';
import { queryTypeOptions } from './constants';
import { XrayQueryType } from '../../types';

describe('QueryEditor', () => {
  it('sets the query type to getTrace if query is a traceID', () => {
    const queryType = queryTypeOptionToQueryType([queryTypeOptions[0].value], '1-5f048fc1-4f1c9b022d6233dacd96fb84');
    expect(queryType).toBe(XrayQueryType.getTrace);
  });
});
