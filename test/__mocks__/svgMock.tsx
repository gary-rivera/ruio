// Mock for SVG imports in tests
// Pattern from SVGR documentation: https://react-svgr.com/docs/jest/
import React from 'react'

const SvgMock = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="svg-mock" {...props} />

export default SvgMock
export { SvgMock as ReactComponent }
