# Contributing

## Signed commits are required

> [!IMPORTANT]
> All commits must be [signed](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits) (GPG, SSH, or S/MIME) to be merged into this repository. Pull requests with unsigned commits will need to be re-committed with signatures before they can be merged.

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

## Data Source Configuration Schema

`pkg/schema/dsconfig.json` is the **single source of truth** for the data source's
configuration surface — every field a user can set, where it is stored (`root`,
`jsonData`, `secureJsonData`), its type, validation rules and UI hints. It is consumed by
provisioning tooling, documentation and automation.

The schema format is defined and documented by [`grafana/dsconfig`](https://github.com/grafana/dsconfig/tree/main/dsconfig):

- [README](https://github.com/grafana/dsconfig/tree/main/dsconfig#readme) — concepts and a worked example for each field shape (root / jsonData / secret / array / virtual), plus current gaps and limitations.
- [`schema.md`](https://github.com/grafana/dsconfig/blob/main/dsconfig/schema.md) — full property reference.
- [`schema.json`](https://github.com/grafana/dsconfig/blob/main/dsconfig/schema.json) — the JSON Schema `dsconfig.json` validates against. It is pinned via the `$schema` key at the top of our file, so editors autocomplete from it; bump that URL when you bump `github.com/grafana/dsconfig/schema` in `go.mod`.

The rest of this section covers only what is specific to this repository.

### Layout

| File in `pkg/schema/` | Description |
| --------------------- | ----------- |
| `dsconfig.json` | Source of truth — **edit this** |
| `dsconfig_test.go` | Wires the schema into the shared conformance suite; also holds `SecureKeys` |
| `*.gen.json` | Generated artifacts — **never hand-edit**; `npm run build` copies them into `dist/schema/` via `webpack.config.ts` |

### Adding a new settings option

1. **Declare the field** in `pkg/schema/dsconfig.json` under `fields`, and add its `id` to
   the appropriate `groups[].fieldRefs` entry. Field ids follow the `<target>_<key>`
   convention, e.g. `jsonData_assumeRoleARN`.
2. **Make sure the settings model has a matching field.** Unlike most plugins, this repo's
   settings model is `awsds.AWSDatasourceSettings` from
   [`grafana/grafana-aws-sdk`](https://github.com/grafana/grafana-aws-sdk), not a struct in
   this repository. The json tag must equal the schema `key`, and parity is enforced in
   both directions — a field in the schema but not the struct (or vice versa) fails the
   test suite. So a new non-secret field has to land in `grafana-aws-sdk` first, then be
   picked up here by bumping that dependency in `go.mod`. Secrets
   (`target: secureJsonData`) are the exception: they need no struct field, but their key
   must be added to `SecureKeys` in `pkg/schema/dsconfig_test.go`.
3. **Regenerate the artifacts** and commit them with your change:

   ```bash
   go generate ./pkg/schema/...
   ```

4. **Verify**:

   ```bash
   go test ./pkg/schema/...
   ```

This repo does not ship provisioning examples yet, so `settings.examples.gen.json` is
empty. To add them, set `SettingsExamples` on the `schema.PluginUnderTest` value in
`pkg/schema/dsconfig_test.go` — one worked configuration per auth type is the usual
shape. Use placeholders like `REPLACE_WITH_PASSWORD`, never real credentials.

### When the conformance suite fails

Most failures are self-explanatory from the assertion message. The three you are most
likely to hit:

- `SchemaArtifactInSync` — a `.gen.json` file has drifted. Run `go generate ./pkg/schema/...` and commit the result.
- `JSONDataMatchesStruct` / `JSONDataTypesMatchStruct` — the schema and `AWSDatasourceSettings` disagree on keys or types. Update whichever side is behind.
- `SecureValuesMatchLoadSettings` — the schema's `secureJsonData` fields and `SecureKeys` disagree.

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
