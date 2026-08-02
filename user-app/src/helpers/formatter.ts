export function stripPhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/[^0-9]+/g, '')
}

export function removeTags(html: string) {
  // Remove HTML tags
  const withoutTags = html?.replace(/<[^>]*>/g, '')

  // Remove inline styles
  const withoutStyles = withoutTags?.replace(/style="[^"]*"/g, '')

  return withoutStyles
}
