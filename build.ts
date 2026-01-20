await Bun.build({
    entrypoints: ['bin/busca.ts'],
    compile: true,
    target: 'bun',
    minify: true,
    outdir: 'dist'
})