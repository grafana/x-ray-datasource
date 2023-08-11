# Change Log

All notable changes to this project will be documented in this file.

## 2.7.0

- Update grafana-aws-sdk to v0.19.0 to add `il-central-1` to the opt-in region list

## 2.6.2

- Bump grafana/aws-sdk-react dependency [#191](https://github.com/grafana/grafana-aws-sdk/pull/191)
- Remove code coverage workflow [#188](https://github.com/grafana/grafana-aws-sdk/pull/188)

## 2.6.1

- Update grafana-aws-sdk version to include new region in opt-in region list https://github.com/grafana/grafana-aws-sdk/pull/80 
- Security: Upgrade Go in build process to 1.20.4
- Update grafana-plugin-sdk-go version to 0.161.0 to avoid a potential http header problem. https://github.com/grafana/athena-datasource/issues/233

## 2.6.0

- Update backend dependencies

## 2.5.0

- Add SQL to trace by @kevinwcyu in https://github.com/grafana/x-ray-datasource/pull/173

## 2.4.0

- Add spellcheck and fix misspellings by @sunker in https://github.com/grafana/x-ray-datasource/pull/158
- Migrate to create-plugin by @iwysiu in https://github.com/grafana/x-ray-datasource/pull/148
- Update code coverage workflow by @idastambuk in https://github.com/grafana/x-ray-datasource/pull/162
- Update @grafana/aws-sdk by @kevinwcyu in https://github.com/grafana/x-ray-datasource/pull/164
- Dependencies: Update @grafana dependencies to 9.3.2 by @idastambuk in https://github.com/grafana/x-ray-datasource/pull/167
- Small Refactor: Do not fetch account id if not on service map page by @sarahzinger in https://github.com/grafana/x-ray-datasource/pull/169
- Upgrade grafana-aws-sdk to v0.12.0 by @fridgepoet in https://github.com/grafana/x-ray-datasource/pull/171

**Full Changelog**: https://github.com/grafana/x-ray-datasource/compare/v2.2.0...v2.4.0****

## 2.3.0

- Feature: Make it possible to filter on account id in https://github.com/grafana/x-ray-datasource/pull/157

## 2.2.0

- Make properties of `SummaryStatistics` optional

## 2.1.2

- Security: Upgrade Go in build process to 1.19.3

## 2.1.1

- Security: Upgrade Go in build process to 1.19.2

## 2.1.0

- Bump terser from 4.8.0 to 4.8.1 by @dependabot in https://github.com/grafana/x-ray-datasource/pull/130
- Fix Trace List with variable by @iwysiu in https://github.com/grafana/x-ray-datasource/pull/132
- Upgrade to grafana-aws-sdk v0.11.0 by @fridgepoet in https://github.com/grafana/x-ray-datasource/pull/139

Full Changelog: https://github.com/grafana/x-ray-datasource/compare/v2.0.1...v2.1.0

## v.2.0.1

- Bug fix for auth with keys: https://github.com/grafana/x-ray-datasource/pull/128
- Code Coverage Changes
- Code owners changes

## v2.0.0

#### What's Changed

- Stopping support for Grafana versions under `8.0.0` by @yaelleC in https://github.com/grafana/x-ray-datasource/pull/122

#### Bug fixes

- Update minimum IAM policy by @iwysiu in https://github.com/grafana/x-ray-datasource/pull/115
- Fix deprecated use of strings.Title by @fridgepoet in https://github.com/grafana/x-ray-datasource/pull/119

#### Other

- Update grafana-aws-sdk by @andresmgot in https://github.com/grafana/x-ray-datasource/pull/121

## v1.4.0

#### Bug fixes

- Use non opt-in region when obtaining tokens for assumed roles
- Fix wrong start and end times [#89](https://github.com/grafana/x-ray-datasource/pull/89)
- Fix time durations after format change [#88](https://github.com/grafana/x-ray-datasource/pull/88)
- Avoid error if the URL in tags cannot be parsed [#84](https://github.com/grafana/x-ray-datasource/pull/84)

#### Other

- Modify the User-Agent for requests. Now it will follow this form: `"aws-sdk-go/$aws-sdk-version ($go-version; $OS;) X-ray/$X-ray-version-$git-hash Grafana/$grafana-version"`

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
