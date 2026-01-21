await Bun.build({
    entrypoints: ['bin/busca'],
    target: 'bun',
    compile: true,
    outdir: './dist'
})

await Bun.build({
    entrypoints: ['bin/server'],
    target: 'bun',
    compile: true,
    outdir: './dist'
})