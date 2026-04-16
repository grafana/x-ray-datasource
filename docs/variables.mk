# List of projects to provide to the make-docs script.
#
# Format: <project>[:<version>[:<repo>[:<dir>]]]
# - project: the plugin slug used in the published docs URL
# - version: leave empty to use the default
# - repo:    the local directory name of this repository under REPOS_PATH
#            (default REPOS_PATH is ~/repos)
# - dir:     path to the docs sources inside this repository
#
# Without <repo> and <dir>, make-docs assumes plugins/* projects live in the
# plugins-private monorepo, which fails for standalone plugin repos.
PROJECTS := plugins/grafana-x-ray-datasource::x-ray-datasource:docs/sources
