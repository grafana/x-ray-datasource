import { queryTypeOptionToQueryType } from './QueryEditorForm';
import { queryTypeOptions } from './constants';
import { XrayQueryType } from '../../types';
import { TemplateSrv } from '@grafana/runtime';
import { ScopedVars, VariableModel } from '@grafana/data';

jest.mock('@grafana/runtime', () => {
  const runtime = jest.requireActual('@grafana/runtime');
  return {
    __esModule: true,
    ...runtime,
    // We need to mock DataSourceWithBackend.query as we extend it and call super(). At the same time doing
    // query = jest.fn() would be harder to access due to how that is transpiled
    DataSourceWithBackend: class DataSourceWithBackendMock extends runtime.DataSourceWithBackend {
      mockQuery = jest.fn();
      query(...args: any[]) {
        return this.mockQuery(...args);
      }
    },
    getTemplateSrv(): TemplateSrv {
      return {
        getVariables(): VariableModel[] {
          return [];
        },
        replace(target?: string, scopedVars?: ScopedVars, format?: string | Function): string {
          if (!target) {
            return '';
          }
          const vars: Record<string, { value: any }> = {
            ...scopedVars,
            someVar: {
              value: '200',
            },
          };
          for (const key of Object.keys(vars)) {
            target = target!.replace(`\$${key}`, vars[key].value);
            target = target!.replace(`\${${key}}`, vars[key].value);
          }
          return target!;
        },
      };
    },
  };
});

describe('QueryEditor', () => {
  it('sets the query type to getTrace if query is a traceID', () => {
    const queryType = queryTypeOptionToQueryType([queryTypeOptions[0].value], '1-5f048fc1-4f1c9b022d6233dacd96fb84');
    expect(queryType).toBe(XrayQueryType.getTrace);
  });
  it('sets the query type to getTraceSummaries if query is not a traceID', () => {
    const queryType = queryTypeOptionToQueryType([queryTypeOptions[0].value], 'foo');
    expect(queryType).toBe(XrayQueryType.getTraceSummaries);
  });
  it('sets the query type to getTrace if query is variable for a traceID', () => {
    const queryType = queryTypeOptionToQueryType([queryTypeOptions[0].value], '$variable', {
      variable: { text: '1-5f048fc1-4f1c9b022d6233dacd96fb84', value: '1-5f048fc1-4f1c9b022d6233dacd96fb84' },
    });
    expect(queryType).toBe(XrayQueryType.getTrace);
  });
});
