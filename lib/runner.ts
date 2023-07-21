import { createCustomRunner } from 'nx-remotecache-custom';
import { isFeatureAvailable } from '@actions/cache';
import { GithubActionsCache } from "./cache";

export type TasksRunner = ReturnType<typeof createCustomRunner>

const ACTIONS_PREFIX = 'ACTIONS_';
const isActionsEnvironment = () => Object.keys(process.env).some((key) => key.startsWith(ACTIONS_PREFIX))

export const runner: TasksRunner = createCustomRunner(async ({ cacheDirectory }) => {
    if (!isFeatureAvailable()) {
        if (!isActionsEnvironment()) {
            return Promise.reject(new Error('Not running in Actions context, skipping.'))
        } else {
            return Promise.reject(new Error('Failed to detect GitHub Runtime variables. Keep in mind that @actions/cache requires crazy-max/ghaction-github-runtime@v2 to work.'))
        }
    }

    return new GithubActionsCache(cacheDirectory)
})
