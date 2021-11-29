# tokenmint-ipfs

## blockchain-developer-bootcamp-final-project

## Deployed url
https://lukeyounge.github.io/tokenmint-ipfs/

## Intro
Businesses want to acknowledge staff and other stakeholders, and often use corporate gifts to achieve this. Staff members may recieve ornaments, pens, caps, tee-shirts, etc. Sometimes these products are useful, often they gather dust and are a waste of resources.

I'd like to create a simple DIY app for an organisation to mint their own NFTs. 

## Basic Use Flow
- Web front end that allows someone to upload image and basic metadata, plus number of NFTs required. 
  -- bonus points if I can provide some randomisation of the artwork, like different colour backgrounds for a PNG with alpha, or randomisation of a collection of files uploaded)
- Mint NFTs gaslessly (on a PoS chain like xDAI, maybe Matic)
- Distribute to their user's wallets (via a link or QR)
  -- bonus points if I can retain a fee for the mint to protocol 
- Ideally a very basic but good looking simple wallet for the user to claim via and see their NFTs

## Pseudocode

### Flow Option 1 (Beneficiary claims token)

Web front end (I may need to leave this out for now)
- User creates account
- User signs in
- User uploads artwork

Contract
- Contract lazy mints n copies, 
- Creates unique URLs for claiming
- Creates QR codes from the URL

Claim
- At the unique URL beneficiary inputs their address
- contract sends the NFT to their address


### Flow Option 2 (User mints all tokens and transfers)

Web front end
- User connects wallet
- User uploads artwork
- Artwork sent to IPFS
- User enters Title, and optional details
- User enters number of NFTs to mint
- User signs txn to mint
- User pays fee per NFT (optional)

Contract
- Contract creates a batch of NFTS 
- Transfers them all to beneficiary wallets (using ConsecutiveTransfer)


## Resources
Proof of Attendance Protocol. In many ways my project will share features with POAP, differing mainly in the intent (acknowledgment, recognition for achievemnets, contributions rather than proving attendance)

Rainbow. Rainbow wallet has a sleek and simple interface for NFTs which is also an inspiration.

Scaffold-Eth. Scaffold eth is a really useful framework that I may lean on to get something working.

Cargo. Cargo is doing batch minting, so that will be a resource for me to learn

[Consecutive Transfer](https://eips.ethereum.org/EIPS/eip-2309)










