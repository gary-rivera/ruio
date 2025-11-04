// CSS module mock pattern from Jest docs and identity-obj-proxy
// See: https://jestjs.io/docs/webpack
// https://jestjs.io/docs/webpack
// https://github.com/keyz/identity-obj-proxy/issues/8#issuecomment-430241345

/**
 * Returns className as-is (e.g., styles['ruio-btn'] returns 'ruio-btn')
 */
export default new Proxy(
  {},
  {
    get: (_target, prop) => {
      return prop.toString()
    },
  },
)
