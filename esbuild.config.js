/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require('esbuild')
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')

const argv = yargs(hideBin(process.argv)).argv

const watch = async () => {
  const context = await esbuild.context({
    entryPoints: ['src/index.tsx'],
    platform: 'node',
    bundle: true,
    outfile: 'lib/index.js',
    color: true,
    minify: argv.minify ?? false,
    plugins: [
      {
        name: 'logger',
        setup: (build) => {
          build.onEnd((result) => {
            if (result.errors.length) {
              console.error('❌ Build failed:\n', ...result.errors)
            } else {
              console.log('✅ Build succeeded')
            }
          })
        },
      },
    ],
  })

  if (argv.watch) {
    await context.watch()
  } else {
    await context.rebuild()
    context.dispose()
  }
}

watch()
