export const VIETMAP_ROUTE = {
  FIND_ROUTE: 'https://maps.vietmap.vn/api/route',
  AUTO_COMPLETE: 'https://maps.vietmap.vn/api/autocomplete',
};

export const GOONG_ROUTE = {
  direction: (
    startDestination: string,
    endDestination: string,
    apiKey: string,
  ) =>
    `https://rsapi.goong.io/Direction?origin=${startDestination}&destination=${endDestination}&api_key=${apiKey}`,
};
