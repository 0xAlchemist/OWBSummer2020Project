import * as fcl from "@onflow/fcl";
import * as sdk from "@onflow/sdk";

export const setupCustomerAccount = async () => {
  const { authorization } = fcl.currentUser();
  const tx = await fcl.send([
    fcl.transaction`
    import FanCoin from 0xe03daebed8ca0615
    import Toke from 0xf3fcd2c1a78f5eee

    // This transaction sets up the user account who is going to mint /buy / sell the admin's mementos

    //Signed by the user
    transaction {
        prepare(acct: AuthAccount) {

        let FanBoard <- FanCoin.createEmptyUserLeaderBoard()
        let TokeUser <- Toke.createEmptyCollection() as! @Toke.Collection

        acct.save<@FanCoin.LeaderBoardManager>(<-FanBoard, to: /storage/FanBoard)
        acct.save<@Toke.Collection>(<-TokeUser,to: /storage/TokeCollection)

        //Create the capability to the collection in storage
        acct.link<&{Toke.MementoCollectionPublic}>(/public/TokeCollection, target: /storage/TokeCollection)

        log("User account initialized")
      }
    }
    `,
    sdk.payer(authorization),
    sdk.proposer(authorization),
    sdk.authorizations([authorization]),
    sdk.limit(100),
  ]);

  console.log({ tx });
}