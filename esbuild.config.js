const esbuild = require('esbuild')

esbuild.build({
  entryPoints: ['src/index.tsx'],
  platform: 'node',
  bundle: true,
  outfile: 'build/out.js',
  watch: {
    onRebuild (error, result) {
      if (error) console.error('watch build failed:', error)
      else console.log('watch build succeeded:', result)
    }
  }
})
