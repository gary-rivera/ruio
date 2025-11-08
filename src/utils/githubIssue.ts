import packageJson from '@root/../package.json'

export interface RuioState {
  ruioEnabled: boolean
  depth: number
  currentColorPalette: string
  rootElement: HTMLElement | null
  isElementPickerActive: boolean
}

/**
 * Generates a GitHub issue URL with pre-filled environment information and ruio state
 */
export const generateGitHubIssueUrl = (ruioState: RuioState): string => {
  const repoUrl = 'https://github.com/gary-rivera/ruio'

  // Get environment information
  const ruioVersion = packageJson.version
  const reactVersion = (typeof window !== 'undefined' && (window as any).React?.version) || 'Unknown'
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'

  // Parse browser info from user agent
  const getBrowserInfo = () => {
    if (typeof navigator === 'undefined') return 'Unknown'

    const ua = navigator.userAgent
    let browser = 'Unknown'

    if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome'
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari'
    else if (ua.includes('Firefox')) browser = 'Firefox'
    else if (ua.includes('Edg')) browser = 'Edge'

    return browser
  }

  const browser = getBrowserInfo()

  // Format root element info
  const getRootElementInfo = () => {
    if (!ruioState.rootElement) return 'None selected'

    const element = ruioState.rootElement
    const tagName = element.tagName.toLowerCase()
    const id = element.id ? `#${element.id}` : ''
    const className = element.className ? `.${element.className.split(' ')[0]}` : ''
    const selector = id || className || tagName

    return `${tagName}${id}${className} (${selector})`
  }

  // Create the issue template
  const title = encodeURIComponent('[Bug Report] ')

  const body = encodeURIComponent(`## Environment

- **Ruio Version:** ${ruioVersion}
- **React Version:** ${reactVersion}
- **Browser:** ${browser}
- **User Agent:** ${userAgent}

## Description
<!-- the more details the better :) -->


## Steps to Reproduce
1.
2.
3.

## Expected Behavior

## Additional Context

## Debugging Stats (\`ruio\` state):

- **Enabled:** ${ruioState.ruioEnabled ? 'Yes' : 'No'}
- **Depth:** ${ruioState.depth}
- **Color Palette:** ${ruioState.currentColorPalette}
- **Root Element:** ${getRootElementInfo()}
- **Element Picker Mode Active:** ${ruioState.isElementPickerActive ? 'Yes' : 'No'}

`)

  return `${repoUrl}/issues/new?title=${title}&body=${body}`
}
