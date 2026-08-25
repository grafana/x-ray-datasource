import { test, expect } from '@grafana/plugin-e2e';
import type { Page } from '@playwright/test';
import { QueryMode, XrayQueryType } from '../src/types';

const PLUGIN_TYPE = 'grafana-x-ray-datasource';
const isCloudRun = !!process.env.GRAFANA_URL;
const DATA_SOURCE_UID = process.env.DS_E2E_UID || (isCloudRun ? 'xray-ds-m' : 'x-ray-e2e');

test.describe.configure({ timeout: 60_000 });

// Grafana 10.4 gives PanelChrome neither of the hooks that panel-level locators rely on: it
// renders a plain div rather than a labelled section, so there is no region landmark, and it
// only emits the panel test id when the title is a string, which Explore breaks by passing a
// React element for any named data frame. Both locators below target markup that is unchanged
// from 10.4 through 13.x.
function columnHeaders(page: Page) {
  return page.getByRole('columnheader');
}

function serviceMapNodes(page: Page) {
  return page.locator('[data-testid^="node-circle-"]');
}

function exploreUrl(query: Record<string, unknown>) {
  const panes = JSON.stringify({
    xray: {
      datasource: DATA_SOURCE_UID,
      queries: [
        {
          refId: 'A',
          datasource: { type: PLUGIN_TYPE, uid: DATA_SOURCE_UID },
          queryMode: QueryMode.xray,
          region: 'default',
          group: { GroupARN: 'default', GroupName: 'Default' },
          ...query,
        },
      ],
      range: { from: 'now-6h', to: 'now' },
    },
  });
  return `/explore?orgId=1&schemaVersion=1&panes=${encodeURIComponent(panes)}`;
}

async function openExploreQuery(page: Page, query: Record<string, unknown>) {
  await page.goto(exploreUrl(query));
}

test('data query is successful when `Trace List` query is valid', { tag: '@aws' }, async ({ page }) => {
  const query = 'service("PetSite")';
  await openExploreQuery(page, { queryType: XrayQueryType.getTraceSummaries, query });

  const queryParam = new URLSearchParams({ filter: query }).toString();
  await expect(page.getByRole('button', { name: 'Trace List' })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole('link', { name: 'Open in X-Ray Traces console' })).toHaveAttribute(
    'href',
    new RegExp(`[?&]${queryParam}(?:&|$)`)
  );
  await expect(columnHeaders(page)).toContainText(
    ['Id', 'Start Time', 'Method', 'Response', 'Response Time', 'URL', 'Client IP'],
    { timeout: 30_000 }
  );
});

test('data query is successful when `Trace Statistics` query is valid', { tag: '@aws' }, async ({ page }) => {
  await openExploreQuery(page, {
    queryType: XrayQueryType.getTimeSeriesServiceStatistics,
    query: 'service("PetSite")',
    columns: ['TotalCount'],
  });

  await expect(page.getByRole('button', { name: 'Trace Statistics' })).toBeVisible({ timeout: 30_000 });
  await expect(columnHeaders(page)).toHaveText(['Time', 'Total Count'], { timeout: 30_000 });
});

test('data query is successful when `Trace Analytics` query is valid', { tag: '@aws' }, async ({ page }) => {
  await openExploreQuery(page, {
    queryType: XrayQueryType.getAnalyticsStatusCode,
    query: 'service("PetSite")',
  });

  await expect(page.getByRole('button', { name: 'HTTP status code' })).toBeVisible({ timeout: 30_000 });
  await expect(columnHeaders(page)).toHaveText(['Status Code', 'Count', 'Percent'], { timeout: 30_000 });
});

test('data query is successful when `Service Map` query is valid', { tag: '@aws' }, async ({ page }) => {
  await openExploreQuery(page, {
    queryType: XrayQueryType.getServiceMap,
    query: 'service("PetSite")',
  });

  await expect(page.getByRole('button', { name: 'Service Map' })).toBeVisible({ timeout: 30_000 });
  await expect(serviceMapNodes(page).first()).toBeVisible({ timeout: 30_000 });
});

test('data query fails when query is invalid', { tag: '@aws' }, async ({ page }) => {
  await openExploreQuery(page, { queryType: XrayQueryType.getTraceSummaries, query: 'PetSite' });

  await expect(page.getByText(/InvalidRequestException/)).toBeVisible({ timeout: 30_000 });
});
