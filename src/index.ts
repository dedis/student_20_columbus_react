import { Roster, WebSocketAdapter } from '@dedis/cothority/network';
import { SkipBlock } from '@dedis/cothority/skipchain';
import { WebSocketConnection } from '@dedis/cothority/network/connection';
import { ByzCoinRPC, Instruction, Argument } from '@dedis/cothority/byzcoin';
import { PaginateResponse, PaginateRequest } from '@dedis/cothority/byzcoin/proto/stream';
import { Subject } from 'rxjs';
import { DataBody } from '@dedis/cothority/byzcoin/proto';
import * as d3 from 'd3';
import { Browse } from './browse';

var roster: Roster;
var ws: WebSocketAdapter;
const firstBlockIDStart = "9cc36071ccb902a1de7e0d21a2c176d73894b1cf88ae4cc2ba4c95cd76f474f3" //"a6ace9568618f63df1c77544fafc56037bf249e4749fb287ca82cc55edc008f8" 
              //DELETE contract: 30acb65139f5f9b479eaea33dae7ccf5704b3b0cf446dff1fb5d6b60b95caa59
const pageSize = 15 //combien de blocks je veux          Expliquer que 20/20 est bon car testé deja
const numPages = 15 //nombre de requete pour faire du streaming: 50 blocks, en 5 requete asynchrone. 
//nombre de block total: pagesize * numpages
var nextIDB: string = ""
var totalBlocks = 36650
var seenBlocks = 0
var matchfound = 0

var contractID = ""
var blocks: SkipBlock[] = []
var instanceSearch :Instruction = null

var container: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>

export function sayHi() {
  roster = Roster.fromTOML(rosterStr);
  if (!roster) {
    console.log("Roster is undefined")
    return;
  }
  document.getElementById("browse").addEventListener("click", browseClick)
  document.getElementById("show").addEventListener("click", show)
  
  container = d3.select("body").append("div").attr("id", "container")

  // Blocks UI
  Browse.main();
}

function createText(texts: string[], args?: Argument[]){/*
  var detailsHTML = container.append("details")
  // Fetch all the details element.
  const details = document.querySelectorAll("details");

  // Add the onclick listeners.
  details.forEach((targetDetail) => {
    targetDetail.addEventListener("click", () => {
      // Close all the details that are not targetDetail.
      details.forEach((detail) => {
        if (detail !== targetDetail) {
          detail.removeAttribute("open");
        }
      });
    });
  });

  detailsHTML.append("summary").text(texts[0])
  for(let i = 1; i < texts.length; i++){
    detailsHTML.append("p").text(texts[i]).on("click", () =>{
      details.forEach((detail)=>{
        detail.removeAttribute("open")
      })
    })
  }*/
}


function show(e:Event){
  console.log(seenBlocks)
  showInstance(instanceSearch)
}

function showInstance(instance : Instruction){
  console.log("Number of blocks seen: "+seenBlocks+", total should be: "+totalBlocks)
  console.log(instance)
  //browse(pageSize, numPages, firstBlockIDStart, instance)

  container.append("text").text("Instruction hash is: " +instance.hash().toString("hex"))
  container.append("text").text("Instance ID is: " +instance.instanceID.toString("hex"))
  showSpawn(instance)
  var j = showInvoke(instance)
  showDelete(instance, j)

}

function showSpawn(instance:Instruction){
  const payload = blocks[0].payload
  const body = DataBody.decode(payload)
  body.txResults.forEach((transaction) => {
    transaction.clientTransaction.instructions.forEach((instruction, j) => {
      if(instruction.instanceID.toString("hex") === instance.instanceID.toString("hex")){
        if (instruction.spawn !== null) {
          console.log("\n--- Instruction spawn")
          console.log("\n---- Hash: " + instruction.hash().toString("hex"))
          console.log("\n---- ContractID: " + instruction.spawn.contractID)
          createText(["Instruction spawn", "Hash: "+ instruction.hash().toString("hex"), "ContractID: " + instruction.spawn.contractID, 
          "Args: "], instruction.spawn.args)
        }
      }
    });
  });
}

function showInvoke(instance:Instruction){
  var j = 0

  for(let i = 0; i < blocks.length; i++){
    const payload = blocks[i].payload
    const body = DataBody.decode(payload)
    body.txResults.forEach((transaction) => {
      transaction.clientTransaction.instructions.forEach((instruction) => {
        if(instruction.instanceID.toString("hex") === instance.instanceID.toString("hex")){
          matchfound++
          if (instruction.invoke !== null) {
            console.log("\n--- Instruction invoke :" + j++)
            console.log("\n---- Hash: " + instruction.hash().toString("hex"))
            console.log("\n---- ContractID: " + instruction.invoke.contractID)
            createText(["Instruction invoke", "Hash: "+ instruction.hash().toString("hex"), "ContractID: " + instruction.invoke.contractID, 
            "Args: "], instruction.invoke.args)
          }
        }
      });
    });
  }
  return j
}

function showDelete(instance:Instruction, j:number){
  const payload = blocks[blocks.length-1].payload
  const body = DataBody.decode(payload)
  body.txResults.forEach((transaction) => {
    transaction.clientTransaction.instructions.forEach((instruction) => {
      if(instruction.instanceID.toString("hex") === instance.instanceID.toString("hex")){
        if (instruction.delete !== null) {
          console.log("\n--- Instruction delete 1")
          console.log("\n---- Hash: " + instruction.hash().toString("hex"))
          console.log("\n---- Instance ID: " + instruction.instanceID.toString("hex"))
        }
      }
    });
  });
}

function printdataConsole(block: SkipBlock, pageNum: number) {
  const payload = block.payload
  const body = DataBody.decode(payload)
  console.log("- block: " + seenBlocks + ", page " + pageNum + ", hash: " + block.hash.toString(
    "hex"))
  body.txResults.forEach((transaction, i) => {
    console.log("\n-- Transaction: " + i)
    transaction.clientTransaction.instructions.forEach((instruction, j) => {
      console.log("\n--- Instruction " + j)
      console.log("\n---- Hash: " + instruction.hash().toString("hex"))
      console.log("\n---- Instance ID: " + instruction.instanceID.toString("hex"))
      if (instruction.spawn !== null) {
        console.log("\n---- spawn")

      }
      if (instruction.invoke !== null) {
        console.log("\n---- invoke")
      }
    });
  });
  return 0
}

function printdataBox(block: SkipBlock, pageNum: number){

  var detailsHTML = container.append("details")
  detailsHTML.attr("id", "detailsChanged")
  const payload = block.payload
  const body = DataBody.decode(payload)
  body.txResults.forEach((transaction, i)=>{
    transaction.clientTransaction.instructions.forEach((instruction, j)=>{
      


      if (instruction.spawn !== null) {
        detailsHTML.append("summary").text("Spawn with instanceID: "+instruction.instanceID.toString("hex") + ", and Hash is: "+instruction.hash().toString("hex"))
        detailsHTML.append("p").text("ContractID: "+instruction.spawn.contractID)
        var argsDetails = detailsHTML.append("details")
        argsDetails.append("summary").text("args are:")
        var my_list = argsDetails.append("ul")
        instruction.spawn.args.forEach((arg, _) => {
          my_list.append("li").text("Arg name : " +arg.name)
          my_list.append("li").text("Arg value : " +arg.value)
        });
      }


      else if (instruction.invoke !== null) {
        detailsHTML.append("summary").text("Invoke with instanceID: "+instruction.instanceID.toString("hex") + ", and Hash is: "+instruction.hash().toString("hex"))
        detailsHTML.append("p").text("ContractID: "+instruction.invoke.contractID)
        var argsDetails = detailsHTML.append("details")
        argsDetails.append("summary").text("args are:")
        var my_list = argsDetails.append("ul")
        instruction.invoke.args.forEach((arg, _) => {
          my_list.append("li").text("Arg name : " +arg.name)
          my_list.append("li").text("Arg value : " +arg.value)
        });
      }
      else if(instruction.delete !== null){
        detailsHTML.append("summary").text("Delete with instanceID: "+instruction.instanceID.toString("hex") + ", and Hash is: "+instruction.hash().toString("hex"))
        detailsHTML.append("p").text("ContractID: "+instruction.delete.contractID)
      }

      var verifiersHTML = detailsHTML.append("details")
      verifiersHTML.append("summary").text("Verifiers: "+block.verifiers.length)
      block.verifiers.forEach((uid, j) => {
        verifiersHTML.append("p").text("Verifier: "+j+" ID: "+uid.toString("hex"))
      });
      var backlinkHTML = detailsHTML.append("details")
      backlinkHTML.append("summary").text("Backlinks: "+block.backlinks.length)
      block.backlinks.forEach((value, j) => {
        backlinkHTML.append("p").text("Backlink: "+j+" Value: "+value.toString("hex"))
      });

      var forwardlinkHTML = detailsHTML.append("details")
      forwardlinkHTML.append("summary").text("ForwardLinks: "+block.forwardLinks.length)
      block.forwardLinks.forEach((fl, j) => {
        forwardlinkHTML.append("p").text("ForwardLink: "+j)
        forwardlinkHTML.append("p").text("From: "+fl.from.toString("hex")+" Hash: "+fl.hash().toString("hex"))
        forwardlinkHTML.append("p").text("signature: + " + fl.signature.sig.toString("hex"))
      });
    })
  })

    // Fetch all the details element.
    const details = document.querySelectorAll("detailsChanged");

    // Add the onclick listeners.
    details.forEach((targetDetail) => {
      targetDetail.addEventListener("click", () => {
        // Close all the details that are not targetDetail.
        details.forEach((detail) => {
          
          if (detail !== targetDetail) {
            detail.removeAttribute("open");
          }
        });
      });
    });
}

function browseClick(e: Event) {
  ws = undefined
  nextIDB = ""
  seenBlocks = 0
  matchfound = 0
     
  contractID = ""
  blocks = []
  var inst = null
  browse(pageSize, numPages, firstBlockIDStart, inst)
}

function browse(pageSizeB: number,
  numPagesB: number, firstBlockID: string, instance: Instruction) {
  instanceSearch = instance
  var subjectBrowse = new Subject<[number, SkipBlock]>();
  var pageDone = 0;
  contractID = (document.getElementById("contractID") as HTMLInputElement).value
  subjectBrowse.subscribe({
    next: ([i, skipBlock]) => {
      if (i == pageSizeB) {
        pageDone++;
        if (pageDone == numPagesB && seenBlocks < 4000) {
          if (skipBlock.forwardLinks.length != 0 ) {
            nextIDB = skipBlock.forwardLinks[0].to.toString("hex");
            pageDone = 0;
            getNextBlocks(nextIDB, pageSizeB, numPagesB, subjectBrowse);
          } else {
            subjectBrowse.complete()
          }
        }
      }
    },
    complete: () => {
      console.log("Fin de la Blockchain")
      console.log("closed")
      showInstance(instanceSearch)
    },
    error: (err: any) => {
      console.log("error: ", err);
      if (err === 1) {
        console.log("Browse recall: " + 1)
        ws = undefined //To reset the websocket, create a new handler for the next function (of getnextblock)
        browse(1, 1, nextIDB, instanceSearch)
      }
    }
  });
  getNextBlocks(firstBlockID, pageSizeB, numPagesB, subjectBrowse);
  console.log(blocks)
  return subjectBrowse
}

function getNextBlocks(
  nextID: string,
  pageSizeNB: number,
  numPagesNB: number,
  subjectBrowse: Subject<[number, SkipBlock]>) {
  var bid: Buffer;
  nextIDB = nextID
  try {
    bid = hex2Bytes(nextID);
  } catch (error) {
    console.log("failed to parse the block ID: ", error);
    return;
  }

  try {
    var conn = new WebSocketConnection(
      roster.list[0].getWebSocketAddress(),
      ByzCoinRPC.serviceName
    );
  } catch (error) {
    console.log("error creating conn: ", error);
    return;
  }
  if (ws !== undefined) {
    const message = new PaginateRequest({
      startid: bid,
      pagesize: pageSizeNB,
      numpages: numPagesNB,
      backward: false
    });

    const messageByte = Buffer.from(message.$type.encode(message).finish());
    ws.send(messageByte);  //fetch next block

  } else {

    conn.sendStream<PaginateResponse>(  //fetch next block
      new PaginateRequest({
        startid: bid,
        pagesize: pageSizeNB,
        numpages: numPagesNB,
        backward: false
      }),
      PaginateResponse).subscribe({
        // ws callback "onMessage":
        next: ([data, ws]) => {
          var ret = handlePageResponse(data, ws, subjectBrowse)
          if (ret == 1) {
            console.log("Error Handling with a return 1")
            subjectBrowse.error(1)
          }
        },
        complete: () => {
          console.log("closed");
        },
        error: (err: Error) => {
          console.log("error: ", err);
          ws = undefined;
        }
      });
  }
}

function handlePageResponse(data: PaginateResponse, localws: WebSocketAdapter, subjectBrowse: Subject<[number, SkipBlock]>) {
  if (data.errorcode != 0) {
    console.log(
      `got an error with code ${data.errorcode} : ${data.errortext}`
    );
    return 1;
  }
  if (localws !== undefined) {
    ws = localws
  }
  var runCount = 0;
  for (var i = 0; i < data.blocks.length; i++) {
    seenBlocks++
    runCount++;
    var block = data.blocks[i]
    subjectBrowse.next([runCount, data.blocks[i]]);
    const payload = block.payload
    const body = DataBody.decode(payload)
    body.txResults.forEach((transaction) => {
      transaction.clientTransaction.instructions.forEach((instruction) => {
        if (instruction.instanceID.toString("hex") === contractID) {
          console.log("*****************Contract match found*****************")
          if(!blocks.includes(data.blocks[i])){
            instanceSearch = instruction
            blocks.push(data.blocks[i])
          }
          printdataConsole(block, data.pagenumber)
          printdataBox(block, data.pagenumber)
        }
      })
    })
  }
  return 0;
}

function hex2Bytes(hex: string) {
  if (!hex) {
    return Buffer.allocUnsafe(0);
  }

  return Buffer.from(hex, "hex");
}

const rosterStr = `[[servers]]
Address = "tls://127.0.0.1:7770"
Suite = "Ed25519"
Public = "dde71927c99730adfe1b1147771c2d682140289d5293e7c1c4bcba75a6307120"
Description = "New cothority"
[servers.Services]
  [servers.Services.ByzCoin]
    Public = "1f2278346c191ba958c8ba93f31c7d6bba34a888c83eb118f45864970683f41461894c2bb275dcb1997599f3b807e503b571b3eb47e80ed04c75e1350c5fbc6f00acebf5dfad3453c3df9bd67b839062b6c4b546764ccff55a8cbf432c69ef9352d16f2ae381befd8d872a0687ae216c431d4a9e2c5c09a2858b0cbb5ee79139"
    Suite = "bn256.adapter"
  [servers.Services.Skipchain]
    Public = "8e9d46ae873a0d5d3065f27695c31175fd74f7fd1174c808cea9dd2eba3494e25b44b7ce1187d8e01be0904c11f156c4bbf1cbe863b625279fbdeec9aff763135858a29b3115488d0fe8c15647031f338382e355a2ed04109553c407478ae17a03e4ca539a06594d3d7d71e9b9ad7374552b23a7cd7dc7a8770b5d4e8b41a03a"
    Suite = "bn256.adapter"`;
