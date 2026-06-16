import { QueryEditorHelpProps } from '@grafana/data';
import { css } from '@emotion/css';
import React from 'react';
import { XrayQuery, XrayQueryType } from 'types';

function renderExpression(expr: string, onClickExample: QueryEditorHelpProps<XrayQuery>['onClickExample']) {
  return (
    <div
      className="cheat-sheet-item__example"
      key={expr}
      onClick={() =>
        onClickExample({ refId: 'A', query: expr, queryType: XrayQueryType.getTraceSummaries } as XrayQuery)
      }
    >
      <code>{expr}</code>
    </div>
  );
}

export default function CheatSheet({ onClickExample }: QueryEditorHelpProps<XrayQuery>) {
  return (
    <div>
      <h2>X-Ray Cheat Sheet</h2>
      <div className="cheat-sheet-item">
        <p>
          <span>Use the search bar to display traces for a service, trace ID, or filter expression.</span>
          <a target="_blank" rel="noreferrer" href="https://docs.aws.amazon.com/console/xray/xray-filter-expressions">
            Learn more
          </a>
        </p>
        <div className="cheat-sheet-item__title">Filter expressions</div>
        <div>You can use custom expressions to narrow down your search.</div>
        <div>Traces where response time was more than 5 seconds:</div>
        {renderExpression('responsetime > 5', onClickExample)}
        <div>Traces where the total duration was 5 to 8 seconds:</div>
        <div>{renderExpression('duration > 5 AND duration < 8', onClickExample)}</div>
        <div>
          Traces that included a call to &apos;api.example.com&apos; with a fault (500 series error) or response time
          above 2.5 seconds, and with one or more segments having an annotation named &apos;account&apos; with value
          &apos;12345&apos;:
        </div>
        <div>{renderExpression('service("api.example.com") AND annotation.account = "12345"', onClickExample)}</div>
        <div>
          Traces where the service &apos;api.example.com&apos; made a call to &apos;backend.example.com&apos; that
          failed with a fault:
        </div>
        <div>{renderExpression('edge("api.example.com", "backend.example.com")', onClickExample)}</div>
        <div>
          Traces where the URL begins with &apos;http://api.example.com/&apos; and contains &apos;/v2/&apos; but does
          not reach a service named &apos;api.example.com&apos;:
        </div>
        <div>
          {renderExpression(
            'http.url BEGINSWITH "http://api.example.com/" AND http.url CONTAINS "/v2/" AND !service("api.example.com")',
            onClickExample
          )}
        </div>
        <div>Traces that completed successfully in under 3 seconds, including all downstream calls:</div>
        <div>{renderExpression('ok !partial duration < 3', onClickExample)}</div>
        <div>
          If you have multiple services with the same name but different types, you can use an ID function to
          distinguish between them in a service or edge filter expression:
        </div>
        <div>
          {renderExpression('service(id(name: "api.example.com", type: "AWS::EC2::Instance"))', onClickExample)}
        </div>
        <div className="cheat-sheet-item">
          <div className="cheat-sheet-item__title">Filter keywords</div>
          <table
            className={css`
              td {
                padding: 5px 10px 5px 10px;
              }
            `}
          >
            <thead>
              <tr>
                <th>Attribute</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ok</td>
                <td>Boolean</td>
                <td>Response status code was 2XX Success.</td>
              </tr>
              <tr>
                <td>error</td>
                <td>Boolean</td>
                <td>Response status code was 4XX Client Error.</td>
              </tr>
              <tr>
                <td>fault</td>
                <td>Boolean</td>
                <td>Response status code was 5XX Server Error.</td>
              </tr>
              <tr>
                <td>partial</td>
                <td>Boolean</td>
                <td>Request has incomplete segments.</td>
              </tr>
              <tr>
                <td>responsetime</td>
                <td>Number</td>
                <td>Time that the server took to send a response.</td>
              </tr>
              <tr>
                <td>duration</td>
                <td>Number</td>
                <td>Total request duration including all downstream calls.</td>
              </tr>
              <tr>
                <td>http.status</td>
                <td>Number</td>
                <td>Response status code.</td>
              </tr>
              <tr>
                <td>http.url</td>
                <td>String</td>
                <td>Request URL.</td>
              </tr>
              <tr>
                <td>http.method</td>
                <td>String</td>
                <td>Request method.</td>
              </tr>
              <tr>
                <td>http.useragent</td>
                <td>String</td>
                <td>Request user agent string.</td>
              </tr>
              <tr>
                <td>http.clientip</td>
                <td>String</td>
                <td>Requestor&apos;s IP address.</td>
              </tr>
              <tr>
                <td>user</td>
                <td>String</td>
                <td>Value of user field on any segment in the trace.</td>
              </tr>
              <tr>
                <td>annotation.*key*</td>
                <td>String</td>
                <td>Value of annotation with field *key*.</td>
              </tr>
              <tr>
                <td>service(*name*) {}</td>
                <td>Complex</td>
                <td>
                  Service with name *name*. Optional curly braces can contain a filter expression that applies to
                  segments created by the service.
                </td>
              </tr>
              <tr>
                <td>edge(*source*, *destination*) {}</td>
                <td>Complex</td>
                <td>
                  Connection between services *source* and *destination*. Optional curly braces can contain a filter
                  expression that applies to segments on this connection.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
