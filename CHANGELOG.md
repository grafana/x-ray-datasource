# Change Log

All notable changes to this project will be documented in this file.

## 2.16.4

- Publish to every environment on Cloud and Add On-Prem promotion in [#529](https://github.com/grafana/x-ray-datasource/pull/529)
- Bump the aws-sdk-go-v2 group with 3 updates in [#500](https://github.com/grafana/x-ray-datasource/pull/500)
- Bump actions/checkout from 4 to 5 in [#454](https://github.com/grafana/x-ray-datasource/pull/454)
- Bump transitive dep brace-expansion to 1.1.12 and 2.0.2 in [#525](https://github.com/grafana/x-ray-datasource/pull/525)

## 2.16.3

- Bump transitive dep brace-expansion to 1.1.12 and 2.0.2 in [#525](https://github.com/grafana/x-ray-datasource/pull/525)
- Docs: Added missing front matter in [#523](https://github.com/grafana/x-ray-datasource/pull/523)

## 2.16.2

- Upgrade yarn to v4.10.3 [#503](https://github.com/grafana/x-ray-datasource/pull/503)
- Update gitignore for yarn files [#510](https://github.com/grafana/x-ray-datasource/pull/510)
- Chore: Move docs do docs/sources in order to publish to website [#502](https://github.com/grafana/x-ray-datasource/pull/502)
- CD: Publish Github release directly, skipping draft step [#501](https://github.com/grafana/x-ray-datasource/pull/501)
- Fix dependabot ignore location for npm dependencies [#436](https://github.com/grafana/x-ray-datasource/pull/436)
- Update workflows and templates [#486](https://github.com/grafana/x-ray-datasource/pull/486)
- Update dependabot groups [#485](https://github.com/grafana/x-ray-datasource/pull/485)
- Bump golang.org/x/text from 0.27.0 to 0.29.0 [#496](https://github.com/grafana/x-ray-datasource/pull/496)
- Bump golang.org/x/sync from 0.16.0 to 0.17.0 [#495](https://github.com/grafana/x-ray-datasource/pull/495)
- Bump github.com/stretchr/testify from 1.10.0 to 1.11.1 [#493](https://github.com/grafana/x-ray-datasource/pull/493)
- Bump github.com/grafana/grafana-aws-sdk from 1.0.5 to 1.2.0 [#494](https://github.com/grafana/x-ray-datasource/pull/494)
- Bump github.com/aws/aws-sdk-go-v2/service/xray from 1.31.7 to 1.36.2 [#492](https://github.com/grafana/x-ray-datasource/pull/492)
- Bump @playwright/test from 1.52.0 to 1.54.1 [#434](https://github.com/grafana/x-ray-datasource/pull/434)
- Bump github.com/aws/aws-sdk-go-v2/service/applicationsignals from 1.11.3 to 1.11.4 [#424](https://github.com/grafana/x-ray-datasource/pull/424)
- Bump @typescript-eslint/parser from 8.32.1 to 8.38.0 [#439](https://github.com/grafana/x-ray-datasource/pull/439)
- Bump @swc/core from 1.13.0 to 1.13.3 [#442](https://github.com/grafana/x-ray-datasource/pull/442)
- Bump golang.org/x/text from 0.26.0 to 0.27.0 [#419](https://github.com/grafana/x-ray-datasource/pull/419)

## 2.16.1

- Chore: Use CI/CD actions for e2e and update grafana version in plugin.json by @idastambuk in https://github.com/grafana/x-ray-datasource/pull/421
- Chore: Update contributing and readme by @idastambuk in https://github.com/grafana/x-ray-datasource/pull/422
- Chore: Add downstream error for unsupported query types by @ktw4071 in https://github.com/grafana/x-ray-datasource/pull/428
- Tweak dependabot schedule in [#432](https://github.com/grafana/x-ray-datasource/pull/432)
- Dependencies: Bump grafana dependencies and run create-plugin update in [#429](https://github.com/grafana/x-ray-datasource/pull/429)
- Bump eslint from 9.27.0 to 9.30.1 in [#418](https://github.com/grafana/x-ray-datasource/pull/418)
- Bump eslint-config-prettier from 10.1.5 to 10.1.8 in [#415](https://github.com/grafana/x-ray-datasource/pull/415)
- Bump webpack from 5.99.9 to 5.100.1 in [#423](https://github.com/grafana/x-ray-datasource/pull/423)
- Bump @types/node from 22.16.4 to 22.16.5 in [#430](https://github.com/grafana/x-ray-datasource/pull/430)
- Bump @grafana/eslint-config from 8.0.0 to 8.1.0 in [#416](https://github.com/grafana/x-ray-datasource/pull/416)

## 2.16.0

- Chore: Migrate to Github actions by @idastambuk in https://github.com/grafana/x-ray-datasource/pull/370
- Add variable editor for service variables by @iwysiu in https://github.com/grafana/x-ray-datasource/pull/373
- Remove Group variable until it is properly supported by @iwysiu in https://github.com/grafana/x-ray-datasource/pull/378
- Service Queries: Update queries to return dimensions correctly by @iwysiu in https://github.com/grafana/x-ray-datasource/pull/376
- Remove pr_commands by @kevinwcyu in https://github.com/grafana/x-ray-datasource/pull/379
- Add support for auto-merging dependabot updates, by @kevinwcyu in https://github.com/grafana/x-ray-datasource/pull/371
- Bump golang.org/x/text from 0.25.0 to 0.26.0 by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/386
- Bump sass from 1.89.0 to 1.89.2 by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/387
- Bump eslint-webpack-plugin from 5.0.1 to 5.0.2 by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/391
- Bump glob from 11.0.2 to 11.0.3 by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/388
- Bump the grafana-dependencies group with 4 updates by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/389
- Rename plugin from X-Ray to App Signals by @iwysiu in https://github.com/grafana/x-ray-datasource/pull/384
- Bump jest from 29.7.0 to 30.0.0 by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/394
- Add app signals services dashboard by @iwysiu in https://github.com/grafana/x-ray-datasource/pull/380
- Bump prettier from 3.5.3 to 3.6.2 by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/396
- Bump @types/node from 22.15.21 to 22.16.4 by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/400
- Bump cspell from 9.0.2 to 9.1.5 by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/398
- Bump lefthook from 1.11.13 to 1.12.2 by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/397
- Bump @swc/core from 1.11.29 to 1.12.14 by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/399
- Bump github.com/aws/aws-sdk-go-v2/service/applicationsignals from 1.11.1 to 1.11.3 by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/395
- Bump golang.org/x/sync from 0.14.0 to 0.16.0 by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/393
- Bump github.com/grafana/grafana-plugin-sdk-go from 0.277.1 to 0.278.0 by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/390
- Bump github.com/aws/aws-sdk-go-v2/service/xray from 1.31.4 to 1.31.7 by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/392
- Bump @stylistic/eslint-plugin-ts from 4.4.0 to 4.4.1 by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/401
- Bump @eslint/js from 9.27.0 to 9.31.0 by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/403
- Bump jest and @types/jest by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/402
- Bump jest-environment-jsdom from 29.7.0 to 30.0.4 by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/405
- Update docs for Application Signals services by @iwysiu in https://github.com/grafana/x-ray-datasource/pull/382
- Remove @types/glob by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/404
- Bump @grafana/plugin-ui from 0.10.6 to 0.10.7 by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/406
- Bump @swc/jest from 0.2.38 to 0.2.39 by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/408
- Bump @types/lodash from 4.17.17 to 4.17.20 by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/407
- Bump @babel/core from 7.27.1 to 7.28.0 by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/409
- Bump @swc/core from 1.12.14 to 1.13.0 by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/410
- Bump github.com/grafana/grafana-aws-sdk from 0.38.4 to 1.0.5 by @dependabot[bot] in https://github.com/grafana/x-ray-datasource/pull/385
- Cleanup the remaining X-rays by @iwysiu in https://github.com/grafana/x-ray-datasource/pull/411

## 2.15.0

- Bump the all-go-dependencies group across 1 directory with 3 updates in [#360](https://github.com/grafana/x-ray-datasource/pull/360)
- Bump the all-node-dependencies group across 1 directory with 18 updates in [#359](https://github.com/grafana/x-ray-datasource/pull/359)
- App Signals: Implement List Service Level Objectives query in [#361](https://github.com/grafana/x-ray-datasource/pull/361)
- App Signals: Implement ListServiceDependencies in [#356](https://github.com/grafana/x-ray-datasource/pull/356)
- Update for grafana-aws-sdk new style v2 authentication in [#336](https://github.com/grafana/x-ray-datasource/pull/336)

## 2.14.0

- Feat: Auto convert w3c trace format (#184) in [#332](https://github.com/grafana/x-ray-datasource/pull/332)
- Actions: Do not use hashes for grafana/ actions in [#352](https://github.com/grafana/x-ray-datasource/pull/352)
- Github actions: Add token permissions in [#351](https://github.com/grafana/x-ray-datasource/pull/351)
- Implement listServiceOperations in [#349](https://github.com/grafana/x-ray-datasource/pull/349)
- add zizmor ignore rule in [#350](https://github.com/grafana/x-ray-datasource/pull/350)
- use vault token instead of github in [#348](https://github.com/grafana/x-ray-datasource/pull/348)
- use vault for e2e secrets in [#346](https://github.com/grafana/x-ray-datasource/pull/346)
- Update github actions files in [#345](https://github.com/grafana/x-ray-datasource/pull/345)
- Create App Signals dropdown and ListServices query in [#338](https://github.com/grafana/x-ray-datasource/pull/338)
- Update for aws-sdk-go-v2 in [#305](https://github.com/grafana/x-ray-datasource/pull/305)
- Chore: add label to external contributions in [#310](https://github.com/grafana/x-ray-datasource/pull/310)
- Bump the all-node-dependencies group across 1 directory with 42 updates in [#343](https://github.com/grafana/x-ray-datasource/pull/343)
- Bump the all-go-dependencies group across 1 directory with 7 updates in [#342](https://github.com/grafana/x-ray-datasource/pull/342)
- Bump golang.org/x/net from 0.34.0 to 0.36.0 in the go_modules group in [#325](https://github.com/grafana/x-ray-datasource/pull/325)
- Bump dompurify from 3.2.3 to 3.2.4 in the npm_and_yarn group in [#319](https://github.com/grafana/x-ray-datasource/pull/319)

## 2.13.2

- Update github.com/grafana/grafana-plugin-sdk-go to v0.265.0 in [#313](https://github.com/grafana/x-ray-datasource/pull/313)
- Bump the all-go-dependencies group across 1 directory with 3 updates in [#307](https://github.com/grafana/x-ray-datasource/pull/307)
- Chore: update e2e tests workflow in [#303](https://github.com/grafana/x-ray-datasource/pull/303)
- Bump golang.org/x/crypto from 0.30.0 to 0.31.0 in the go_modules group in [#288](https://github.com/grafana/x-ray-datasource/pull/288)

## 2.13.1

- Update readme to include info on Compatibility in [#301](https://github.com/grafana/x-ray-datasource/pull/301)

## 2.13.0

- Add PDC support in [#282](https://github.com/grafana/x-ray-datasource/pull/282)
- Replace @grafana/experimental with @grafana/plugin-ui in [#292](https://github.com/grafana/x-ray-datasource/pull/292)

## 2.12.0

- Bump the all-node-dependencies group with 19 updates in [#289](https://github.com/grafana/x-ray-datasource/pull/289)
- Bump the all-go-dependencies group across 1 directory with 4 updates in [#283](https://github.com/grafana/x-ray-datasource/pull/283)
- Add start time to response in [#286](https://github.com/grafana/x-ray-datasource/pull/275)

## 2.11.0

- Bump the all-node-dependencies group across 1 directory with 31 updates in [#275](https://github.com/grafana/x-ray-datasource/pull/275)
- Bump nanoid from 3.3.7 to 3.3.8 in the npm_and_yarn group in [#274](https://github.com/grafana/x-ray-datasource/pull/274)
- Bump the all-go-dependencies group across 1 directory with 4 updates in [#269](https://github.com/grafana/x-ray-datasource/pull/269)
- Bump cross-spawn from 7.0.3 to 7.0.6 in the npm_and_yarn group in [#271](https://github.com/grafana/x-ray-datasource/pull/271)
- Bump path-to-regexp from 1.8.0 to 1.9.0 in the npm_and_yarn group in [#260](https://github.com/grafana/x-ray-datasource/pull/260)
- Bump the all-go-dependencies group across 1 directory with 3 updates in [#262](https://github.com/grafana/x-ray-datasource/pull/262)
- Bump micromatch from 4.0.7 to 4.0.8 in the npm_and_yarn group in [#259](https://github.com/grafana/x-ray-datasource/pull/259)
- Bump the all-github-action-dependencies group with 2 updates in [#255](https://github.com/grafana/x-ray-datasource/pull/255)
- Bump webpack from 5.93.0 to 5.94.0 in the npm_and_yarn group in [#258](https://github.com/grafana/x-ray-datasource/pull/258)
- Upgrade grafana-plugin-sdk-go (deps): Bump github.com/grafana/grafana-plugin-sdk-go from 0.252.0 to 0.255.0 in [#252](https://github.com/grafana/x-ray-datasource/pull/252)
- Chore: bump dependencies in [#251](https://github.com/grafana/x-ray-datasource/pull/251)
- Chore: Update plugin.json keywords in [#250](https://github.com/grafana/x-ray-datasource/pull/250)
- Update plugin name to match Amazon convention in [#247](https://github.com/grafana/x-ray-datasource/pull/247)

## 2.10.1

- chore: add errorsource in [#245](https://github.com/grafana/x-ray-datasource/pull/245)
- Chore: Rename datasource file in [#243](https://github.com/grafana/x-ray-datasource/pull/243)
- Add pre-commit hook with lint and spellcheck [#242](https://github.com/grafana/x-ray-datasource/pull/242)
- Use yarn instead of cspell for precommit hook [#246](https://github.com/grafana/x-ray-datasource/pull/246)

## 2.10.0

- Chore: update dependencies in [#240](https://github.com/grafana/x-ray-datasource/pull/240)

## 2.9.1

- Migrate to new form styling in config and query editors by @idastambuk in [#235](https://github.com/grafana/x-ray-datasource/pull/235)

## 2.9.0

- Fix: pass empty array to query all columns by @kevinwcyu in [#228](https://github.com/grafana/x-ray-datasource/pull/228)
- add stalebot for issues by @katebrenner in [#226](https://github.com/grafana/x-ray-datasource/pull/226)
- Update to use datasource.Manage and sessions.GetSessionWithAuthSettings by @iwysiu in [#232](https://github.com/grafana/x-ray-datasource/pull/232)
- Fix: use ReadAuthSettings to get authSettings in [#236 ](https://github.com/grafana/x-ray-datasource/pull/236)

## 2.8.3

- Update CONTRIBUTING.md to include release instructions
- Bring in [security fixes in go 1.21.8](https://groups.google.com/g/golang-announce/c/5pwGVUPoMbg)

## 2.8.2

- Update grafana/aws-sdk-go to 0.20.0 in https://github.com/grafana/x-ray-datasource/pull/220

## 2.8.1

- Bump go.opentelemetry.io/contrib/instrumentation/net/http/httptrace/otelhttptrace from 0.37.0 to 0.44.0 by @dependabot in https://github.com/grafana/x-ray-datasource/pull/208
- Bump google.golang.org/grpc from 1.58.2 to 1.58.3 by @dependabot in https://github.com/grafana/x-ray-datasource/pull/212
- Bump go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc from 0.45.0 to 0.46.0 by @dependabot in https://github.com/grafana/x-ray-datasource/pull/218
- Upgrade underscore, d3-color, debug, cosmiconfig, yaml dependencies by @fridgepoet in https://github.com/grafana/x-ray-datasource/pull/217

**Full Changelog**: https://github.com/grafana/x-ray-datasource/compare/v2.8.0...v2.8.1

## 2.8.0

- Migrate ConfigEditor and QueryEditor to the new form styling [#211](https://github.com/grafana/x-ray-datasource/pull/211)

- Bump google.golang.org/grpc from 1.54.0 to 1.56.3 in [#210](https://github.com/grafana/x-ray-datasource/pull/210)

- Support Node 18 in [201](https://github.com/grafana/x-ray-datasource/pull/201)

## 2.7.2

- Fix X-Ray Service Map filter trace list query by @jamesrwhite in https://github.com/grafana/x-ray-datasource/pull/203

## 2.7.1

- Update @grafana/aws-sdk to fix a bug in temporary credentials

## 2.7.0

- Update grafana-aws-sdk to v0.19.1 to add `il-central-1` to the opt-in region list

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
