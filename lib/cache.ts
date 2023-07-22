import { open, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { restoreCache, saveCache } from '@actions/cache'
import { RemoteCacheImplementation } from 'nx-remotecache-custom'
import { bound } from './bound'
import { cacheDir } from '@nx/devkit'

export class GithubActionsCache implements RemoteCacheImplementation {
    name: 'Github Actions Cache'

    constructor(private cacheDirectory: string = cacheDir) {}

    @bound()
    fileExists(filename: string) {
        return restoreCache([this.cacheDirectory], filename, undefined, {
            lookupOnly: true,
        }).then(Boolean)
    }

    @bound()
    retrieveFile(filename) {
        return restoreCache([this.cacheDirectory], filename).then((key) =>
            open(join(this.cacheDirectory, key)).then((fd) =>
                fd.createReadStream()
            )
        )
    }

    @bound()
    storeFile(filename, buffer) {
        return writeFile(join(this.cacheDirectory, filename), buffer).then(() =>
            saveCache([this.cacheDirectory], filename)
        )
    }
}
