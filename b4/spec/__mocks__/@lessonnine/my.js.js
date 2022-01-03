module.exports = {
  getMyEnv: jest.fn().mockImplementation(() => ({
    locale: 'en',
    assetUrl: '/',
    myBaseUrl: 'https://my.babbel.cn',
    homeBaseUrl: 'https://home.babbel.cn',
    apigatewayBaseUrl: 'https://api.babbel-staging.io/gamma',
    signInUrl: 'https://accounts.babbel.cn/en/accounts/sign_in',
    staticBaseUrlTemplate: 'https://%{subdomain}.babbel.cn',
    baseImagesUrl: 'https://images.babbel.com/v1.0.0/images',
    baseSoundsUrl: 'https://sounds.babbel.com/v1.0.0/sounds',
    uuid: 'YOUR_UUID',
    rollbarAccessToken: 'FOOBARBAZ',
    client: {
      appName: null,
      appVersion: null,
      appVendorOrAppStore: null,
      appInAppPurchaseStore: null,
      browserName: null,
      browserVersion: null,
      osName: null,
      osVersion: null,
      deviceManufacturer: null,
      deviceName: null
    },
    geoData: {
      city: 'Berlin',
      countryCode3: 'DEU',
      region: 'BE'
    },
    main: ''
  }))
};

