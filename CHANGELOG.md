# Change Log

All notable changes to this project will be documented in this file.

## v1.3.4

#### Bug fixes

- Add readable names for stats in service map legend [#82](https://github.com/grafana/x-ray-datasource/pull/82)
- Upgrade grafana-aws-sdk version fixing issue with assuming role [#81](https://github.com/grafana/x-ray-datasource/pull/81)

#### Other

- Bump prismjs from 1.23.0 to 1.24.0 [#80](https://github.com/grafana/x-ray-datasource/pull/80)

## v1.3.3

#### Other

- Bump grafana/aws-sdk and Grafana dependency version [#77](https://github.com/grafana/x-ray-datasource/pull/77)

## v1.3.2

#### Features / Enhancements

- Use ConnectionConfig from grafana-aws-sdk [#73](https://github.com/grafana/x-ray-datasource/pull/73)
- Bump prismjs from 1.21.0 to 1.23.0 [#70](https://github.com/grafana/x-ray-datasource/pull/70)

## v1.3.1

#### Bug fixes

- Remove usage of non backward compatible API preventing using the 1.3.0 version in Grafana before 7.4.0. [#67](https://github.com/grafana/x-ray-datasource/pull/67)

#### Other

- Locks Grafana dependencies on latest stable release preventing compilation fails in CI. [#68](https://github.com/grafana/x-ray-datasource/pull/68)

## v1.3.0

#### Features / Enhancements

- Add Service Map query type that allows visualizing service map data in similar way to X-Ray console. [#60](https://github.com/grafana/x-ray-datasource/pull/60)

## v1.2.0

#### Features / Enhancements

- Updates the authentication settings in the plugin config page to include SDK default authentication mechanism and use our Grafana specific auth SDK for AWS. [#59](https://github.com/grafana/x-ray-datasource/pull/59)

## v1.1.0

#### Features / Enhancements

- Add regions selector to the query editor. [#57](https://github.com/grafana/x-ray-datasource/pull/57)

## v1.0.1

- Version bump needed for CI automated release

## v1.0.0

- Initial Release
