# github-runner
NX Tasks runner for github actions

## Usage

### Dependency
- crazy-max/ghaction-github-runtime@v2 - https://github.com/crazy-max/ghaction-github-runtime

github-runner uses @actions/cache for managing Actions Cache, and @actions/cache requires Github Runtime to be exposed.

The above action needs to be used prior to invoking nx command(s) using github-runner as tasks runner.

### .github/workflows/[workflow].yml
```yaml
- uses: crazy-max/ghaction-github-runtime@v2
- run: |
    nx run-many -t [target] --runner=github-runner
```
### nx.json
```json
{
   "tasksRunnerOptions": {
    "github-runner": {
      "runner": "@raegen/github-runner",
      "options": {
        "cacheableOperations": ["build"]
      }
    }
  },
}
```
or
```bash
$ nx [command] --runner=github-runner
```
