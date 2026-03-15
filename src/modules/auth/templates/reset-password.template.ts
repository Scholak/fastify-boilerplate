import fs from 'fs'
import path from 'path'

const htmlPath = path.join(__dirname, 'reset-password.html')

export function resetPasswordTemplate(variables: { firstName: string; resetLink: string }): string {
  let html = fs.readFileSync(htmlPath, 'utf-8')
  html = html.replace(/\{\{firstName\}\}/g, variables.firstName)
  html = html.replace(/\{\{resetLink\}\}/g, variables.resetLink)
  return html
}
