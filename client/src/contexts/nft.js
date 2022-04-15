import React from "react";
const NftContext = React.createContext({
    web3: null,
    contract: null,
    accounts: null,
    todolists: null
});

export const NFTProvider = NftContext.Provider
export default NftContext