<div align="center" style="width: 100%; max-width: 100%;">
    <img src="./docs/ruio-banner.png" alt="ruio banner" style="width: 100%; max-width: 1200px; height: auto;"/>
</div>

<div align="center">
   <p>
    <img src="https://img.shields.io/npm/v/ruio" alt="npm version">
    <img src="https://img.shields.io/npm/dm/ruio" alt="downloads">
    <img src="https://img.shields.io/npm/l/ruio" alt="license">
  </p>
</div>

<h3>Overview</h3>

<p><strong>A developer tool to visualize and debug React component hierarchy.</strong> Helps to troubleshoot complex layout issues, understand nested structures, and refine your UI by applying dynamic styling to highlight component archtitecture.</p>

<div align="center">
  <a href="https://github.com/user-attachments/assets/1b226b6d-6bf1-43ed-b016-d685baa722b6">
    <img src="https://github.com/user-attachments/assets/9aad57f6-4df2-49b2-805c-2f9780c924a5" alt="demo gif"/>
  </a>
</div>
<br>
<div>
    <ul>
      <li>
        <span><strong>Dynamic Border Styling - </strong> Visualize borders on any element within your React app.</span>
      </li>
      <li>
        <span><strong>Element Selection Mode</strong> Mimics the hover effect of Chrome DevTools to highlight elements on the page.</span>
      </li>
      <li>
        <span><strong>Click-to-Select</strong> Make any element the new root with a click.</span>
      </li>
      <li>
        <span><strong>Toggle Logic</strong> Enable and disable border styling on the fly as well as memory of selected root element.</span>
      </li>
      <li>
        <span><strong>Reset Functionality</strong> Automatically clear all applied border styles.</span>
      </li>
      <li>
        <span><strong>Highly Configurable</strong> Works with different project structures and exists on top of any existing architectures.</span>
      </li>
    </ul>
</div>

<h2>Quick Start</h2>

<h3>Installation</h3>

<p>You can install using your preferred package manager:</p>

```bash
# npm
npm install ruio

# yarn
yarn add ruio

# bun
bun add ruio
```

<h3>Basic Usage</h3>

<p>Wrap your application with the <code>RuioContextProvider</code>:</p>

```typescript
import RuioContextProvider from 'ruio'

function App() {
  return (
    <RuioContextProvider>
      {/* Your App Components Here */}
    </RuioContextProvider>
  )
}
```

<h2>Documentation</h2>

<ul>
  <li><strong><a href="docs/INSTALLATION.md">Installation Guide</a></strong> - Setup, requirements, and troubleshooting</li>
  <li><strong><a href="docs/USAGE.md">Usage Guide</a></strong> - Feature walkthrough and workflows</li>
  <li><strong><a href="docs/CONFIGURATION.md">Configuration</a></strong> - Element exclusion, environment settings, and planned features</li>
  <li><strong><a href="docs/EXAMPLES.md">Examples</a></strong> - Working examples and common patterns</li>
  <li><strong><a href="docs/API.md">API Reference</a></strong> - PI documentation for components and hooks</li>
  <li><strong><a href="docs/CHANGELOG.md">Changelog</a></strong> - Version history and release notes</li>
  <li><strong><a href="docs/CONTRIBUTING.md">Contributions Guide</a></strong></li>
</ul>

<h2>Contributing</h2>

<p>Contributions are welcome. See <a href="docs/CONTRIBUTING.md">Contributing Guide</a> for details.</p>

<h3>License</h3>

<p><code>ruio</code> is licensed under the MIT License. See the <a href="LICENSE/">LICENSE</a> file for more details.</p>
