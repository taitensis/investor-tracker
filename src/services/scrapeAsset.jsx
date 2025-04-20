if (result.fullHtml) {
    const filename = asset.name.toLowerCase().replace(/\s+/g, '_') + '-full.html'
    fs.writeFileSync(filename, result.fullHtml)
    console.log(`📄 Full HTML saved to ${filename}`)
  }
  