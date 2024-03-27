import { open, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { Stream } from 'node:stream'
import { restoreCache, saveCache } from '@actions/cache'
import { RemoteCacheImplementation } from 'nx-remotecache-custom'

const PREFIX = 'nx'

const prefix = (filename: string) => `${PREFIX}-${filename}`

function streamToString(stream: Stream): Promise<Buffer> {
    const chunks = []
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
        stream.on('error', (err) => reject(err))
        stream.on('end', () => resolve(Buffer.concat(chunks)))
    })
}

export const createGithubActionsCache = (
    path: string
): RemoteCacheImplementation => ({
    name: 'Github Actions Cache',

    fileExists: (filename: string) =>
        restoreCache([path], prefix(filename)).then(Boolean),

    retrieveFile: async (filename: string) =>
        open(resolve(path, prefix(filename))).then((fd) =>
            fd.createReadStream()
        ),

    storeFile: async (filename: string, data: Stream) => {
        const d = await streamToString(data)
        writeFile(resolve(path, prefix(filename)), d).then(() =>
            saveCache([path], prefix(filename))
        )
    },
})
