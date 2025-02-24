export interface SspAssetStaticFixtures {
    asset: SspAsset;
    defaultPassword: string;
}

export interface SspAssetDynamicFixtures {
    customer: Customer
}

export interface SspAsset {
    name: string;
}

export interface Customer {
    email: string;
}
