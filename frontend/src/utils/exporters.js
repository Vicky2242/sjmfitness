const downloadBlob = (filename, content, mimeType) => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export const exportToCsv = (filename, rows) => {
  if (!rows?.length) return

  const headers = Object.keys(rows[0])
  const escapeValue = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escapeValue(row[header])).join(',')),
  ].join('\n')

  downloadBlob(filename, csvContent, 'text/csv;charset=utf-8;')
}

export const exportToPdfLikeText = (filename, title, lines) => {
  const content = [
    `${title}`,
    '====================================',
    ...lines,
  ].join('\n')

  downloadBlob(filename, content, 'application/pdf')
}
