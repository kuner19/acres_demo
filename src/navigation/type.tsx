export type RootStackParamList = {
  Home: undefined;
  Funding: {deviceUUID:string,from:string,rssi:any,
    connectedDevice:any;
  };
  FundGameplay: {connectedDevice:any}
  WithdrawGameplay: {connectedDevice:any}
};
