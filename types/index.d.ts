export type CoreCatalogEntry = {
  name: string;
  file: string;
  kind: 'server' | 'client';
  status: string;
};

export declare const supportedCore: Array<CoreCatalogEntry>;

declare const abCore: {
  supportedCore: Array<CoreCatalogEntry>;
};

export default abCore;
