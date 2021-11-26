import fs from 'fs'
import { NFTStorage } from "https://cdn.skypack.dev/nft.storage@3.4.0"

const endpoint = 'https://api.nft.storage' // the default
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEIwOUMyNjlFYTQ3NTlENThjNjkxRjg2N2NjMTI5MUEyNWU3RWIwM2IiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzNzAwNzMxMzk5MiwibmFtZSI6InRva2VubWludCJ9.O5dbXgHEk90doDUpxl5LDPGmoXs78CFavRGcvDMNzEM"

async function main() {
  const storage = new NFTStorage({ endpoint, token })
  const metadata = await storage.store({
    name: 'nft.storage store test',
    description:
      'Using the nft.storage metadata API to create ERC-1155 compatible metadata.',
    image: new File([await fs.promises.readFile('pinpie.jpg')], 'pinpie.jpg', {
      type: 'image/jpg',
    }),
    properties: {
      custom:
        'Any custom data can appear in properties, files are automatically uploaded.',
      file: new File(
        [await fs.promises.readFile('seamonster.jpg')],
        'seamonster.jpg',
        {
          type: 'image/jpg',
        }
      ),
    },
  })
  console.log('IPFS URL for the metadata:', metadata.url)
  console.log('metadata.json contents:\n', metadata.data)
  console.log(
    'metadata.json contents with IPFS gateway URLs:\n',
    metadata.embed()
  )
}
main()