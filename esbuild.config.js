// eslint-disable-next-line @typescript-eslint/no-var-requires
const esbuild = require('esbuild')

esbuild.build({
  entryPoints: ['src/index.tsx'],
  platform: 'node',
  bundle: true,
  outfile: 'build/out.js',
  color: true,
  watch: {
    onRebuild(error, result) {
      if (error) console.error('❌ Watch build failed:\n', error)
      else console.log('✅ Watch build succeeded:\n', result)
    },
  },
})
