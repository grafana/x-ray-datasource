# How to build X-Ray data source plugin locally

To build X-Ray data source locally you should follow the steps below.

## Frontend

1. Install dependencies

```BASH
yarn install
```

2. Build plugin in development mode with watch

```BASH
yarn dev
```

3. Build plugin in production mode

```BASH
yarn build
```

## Backend

1. Update the dependency files:

```BASH
go mod tidy
```

2. Build backend plugin binaries for Linux, Windows and Darwin:

```BASH
mage -v
```

3. List all available Mage targets for additional commands:

```BASH
mage -l
```

4. Watch all go sources, rebuild on change and reload plugin in running Grafana (need [Bra installed](https://github.com/unknwon/bra)):

```BASH
bra run
```

## Testing

### E2E Tests

1. Ensure you have the `AWS X-Ray E2E` data source provisioned in the `provisioning/datasources` directory

2. Start the server

```sh
yarn server
```

3. Run the tests

```sh
yarn e2e

# Optionally show the report, the report automatically shows if any tests fail
yarn e2e:report

```

## Building a release

You need to have commit rights to the GitHub repository to publish a release.

1. Update the version number in the `package.json` file.
2. Update the `CHANGELOG.md` by copy and pasting the relevant PRs from [Github's Release drafter interface](https://github.com/grafana/x-ray-datasource/releases/new) or by running `yarn generate-release-notes` (you'll need to install the [gh cli](https://cli.github.com/) and [jq](https://jqlang.github.io/jq/) to run this command).
3. PR the changes.
4. Once merged, follow the release process that you can find [here](https://enghub.grafana-ops.net/docs/default/component/grafana-plugins-platform/plugins-ci-github-actions/010-plugins-ci-github-actions/#cd_1)

## Learn more

- [Build a data source backend plugin tutorial](https://grafana.com/tutorials/build-a-data-source-backend-plugin)
- [Grafana documentation](https://grafana.com/docs/)
- [Grafana Tutorials](https://grafana.com/tutorials/) - Grafana Tutorials are step-by-step guides that help you make the most of Grafana
- [Grafana UI Library](https://developers.grafana.com/ui) - UI components to help you build interfaces using Grafana Design System
- [Grafana plugin SDK for Go](https://grafana.com/docs/grafana/latest/developers/plugins/backend/grafana-plugin-sdk-for-go/)
