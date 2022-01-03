declare module "@lessonnine/my.js" {
  export interface MyEnvironment {
    locale: string
    assetUrl: string
    myBaseUrl: string
    homeBaseUrl: string
    apigatewayBaseUrl: string
    awsSessionEndpoint: string
    awsSessionMethod: string
    signInUrl: string
    staticBaseUrlTemplate: string
    baseImagesUrl: string
    baseSoundsUrl: string
    uuid: string
    rollbarAccessToken: string
    client: {
      appName: string
      appVersion: string
      appVendorOrAppStore: string
      appInAppPurchaseStore: string
      browserName: string
      browserVersion: string
      osName: string
      osVersion: string
      deviceManufacturer: string
      deviceName: string
    },
    geoData: {
      city: string
      countryCode3: string
      region: string
    }
  }
  export function getMyEnv(): MyEnvironment;
}
