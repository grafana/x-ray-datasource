# How to build X-Ray data source plugin locally

To build X-Ray data source locally you should follow the steps below.

## Frontend

1. Install dependencies

```BASH
yarn install
```

2. Build plugin in development mode or run in watch mode

```BASH
yarn dev
```

or

```BASH
yarn watch
```

3. Build plugin in production mode

```BASH
yarn build
```

## Backend

1. Update [Grafana plugin SDK for Go](https://grafana.com/docs/grafana/latest/developers/plugins/backend/grafana-plugin-sdk-for-go/) dependency to the latest minor version:

```bash
go get -u github.com/grafana/grafana-plugin-sdk-go
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

1. Add a `.env` file to the project root with `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` defined

```
AWS_ACCESS_KEY_ID="REPLACE_WITH_AWS_ACCESS_KEY_ID"
AWS_SECRET_ACCESS_KEY="REPLACE_WITH_AWS_SECRET_KEY"
```

2. Ensure you have the `AWS X-Ray E2E` data source provisioned in the `provisioning/datasources` directory

3. Start the server

```sh
yarn server
```

4. Run the tests

```sh
yarn playwright:test

# Optionally show the report, the report automatically shows if any tests fail
yarn playwright:report

```

## Learn more

- [Build a data source backend plugin tutorial](https://grafana.com/tutorials/build-a-data-source-backend-plugin)
- [Grafana documentation](https://grafana.com/docs/)
- [Grafana Tutorials](https://grafana.com/tutorials/) - Grafana Tutorials are step-by-step guides that help you make the most of Grafana
- [Grafana UI Library](https://developers.grafana.com/ui) - UI components to help you build interfaces using Grafana Design System
- [Grafana plugin SDK for Go](https://grafana.com/docs/grafana/latest/developers/plugins/backend/grafana-plugin-sdk-for-go/)
