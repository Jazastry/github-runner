import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createCustomRunner, initEnv } from 'nx-remotecache-custom'
import { isFeatureAvailable } from '@actions/cache'
import { cacheDir } from 'nx/src/utils/cache-directory'
import { createGithubActionsCache } from './cache'

export type TasksRunner = ReturnType<typeof createCustomRunner>

const ACTIONS_PREFIX = 'ACTIONS_'
const isActionsEnvironment = () =>
    Object.keys(process.env).some((key) => key.startsWith(ACTIONS_PREFIX))

const ensureCacheDirectory = (path: string) =>
    mkdir(path, { recursive: true }).then(() => path)

export const runner: TasksRunner = createCustomRunner(async (options) => {
    initEnv(options)
    if (!isFeatureAvailable()) {
        if (!isActionsEnvironment()) {
            return Promise.reject(
                new Error('Not running in Actions context, skipping.')
            )
        } else {
            return Promise.reject(
                new Error(
                    'Failed to detect GitHub Runtime variables. Keep in mind that @actions/cache requires crazy-max/ghaction-github-runtime@v2 to work.'
                )
            )
        }
    }

    const { cacheDirectory = resolve(cacheDir, 'remote') } = options // set to cacheDir/remote due to issues with machine id caused by nx not being able to differentiate between local and remote cache

    return createGithubActionsCache(await ensureCacheDirectory(cacheDirectory))
})
