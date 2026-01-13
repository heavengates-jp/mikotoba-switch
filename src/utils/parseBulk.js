export const parseBulkInput = (raw) => {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  const entries = []
  const errors = []

  lines.forEach((line, index) => {
    const parts = line.split('|').map((part) => part.trim())
    const reference = parts[0] || ''
    const text = parts[1] || ''
    const note = parts[2] || ''
    const tagsRaw = parts[3] || ''

    if (!reference || !text) {
      errors.push({
        line: index + 1,
        input: line,
        message: 'reference と text は必須です。',
      })
      return
    }

    const tags = tagsRaw
      ? tagsRaw.split(',').map((tag) => tag.trim()).filter(Boolean)
      : []

    entries.push({ reference, text, note, tags })
  })

  return { entries, errors }
}