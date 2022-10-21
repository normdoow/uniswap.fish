export interface Network {
  id: string;
  name: string;
  desc: string;
  logoURI: string;
  disabled?: boolean;
  isNew?: boolean;
  subgraphEndpoint: string;
}
