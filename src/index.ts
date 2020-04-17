import { Roster, WebSocketAdapter } from '@dedis/cothority/network';
import { SkipBlock } from '@dedis/cothority/skipchain';
import { WebSocketConnection } from '@dedis/cothority/network/connection';
import { ByzCoinRPC, Instruction } from '@dedis/cothority/byzcoin';
import { PaginateResponse, PaginateRequest } from '@dedis/cothority/byzcoin/proto/stream';
import { Subject } from 'rxjs';
import { DataBody } from '@dedis/cothority/byzcoin/proto';
import * as d3 from 'd3';
import { schemeBrBG, svg } from 'd3';

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

var width = 1000
var height = 500
var widthText = 5
var heightText = 30
var container = null
var textHolder: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>  = null

/* ----- Blocks ----- */
let blocksDataset = [{'block_id': 0, 'valid': 1, 'date': '2020-01-01', 'hash': '9jZPAyiIzf3XfBcT8WaG'},
                     {'block_id': 1, 'valid': 1, 'date': '2020-01-02', 'hash': 'vs3H2CgTfs3qCXxiEgJA'},
                     {'block_id': 2, 'valid': 0, 'date': '2020-01-03', 'hash': 'jcfhsoj987OD4BOKNpal'},
                     {'block_id': 3, 'valid': 1, 'date': '2020-01-15', 'hash': 'c5JL5wfHvtVKWC6z2Glz'},
                     {'block_id': 4, 'valid': 0, 'date': '2020-02-07', 'hash': 'TT9x6hOX2c6uKDmP5yEB'},
                     {'block_id': 5, 'valid': 1, 'date': '2020-02-08', 'hash': 's46gqQqEibLbV6fG3xPP'},
                     {'block_id': 6, 'valid': 1, 'date': '2020-02-09', 'hash': 'prD8KYDV1lkytTOOR4Og'},
                     {'block_id': 7, 'valid': 0, 'date': '2020-02-20', 'hash': 'QrZGmXFP8fbzEr1gHYAq'},
                     {'block_id': 8, 'valid': 1, 'date': '2020-02-28', 'hash': 'Qn6kox7v9u8dRHRUqmc9'},
                     {'block_id': 9, 'valid': 0, 'date': '2020-01-03', 'hash': 'jcfhsoj987OD4BOKNpal'},
                     {'block_id': 10, 'valid': 1, 'date': '2020-01-15', 'hash': 'c5JL5wfHvtVKWC6z2Glz'},
                     {'block_id': 11, 'valid': 0, 'date': '2020-02-07', 'hash': 'TT9x6hOX2c6uKDmP5yEB'},
                     {'block_id': 12, 'valid': 1, 'date': '2020-02-08', 'hash': 's46gqQqEibLbV6fG3xPP'},
                     {'block_id': 13, 'valid': 1, 'date': '2020-02-09', 'hash': 'prD8KYDV1lkytTOOR4Og'},
                     {'block_id': 14, 'valid': 0, 'date': '2020-02-20', 'hash': 'QrZGmXFP8fbzEr1gHYAq'},
                     {'block_id': 15, 'valid': 1, 'date': '2020-02-28', 'hash': 'Qn6kox7v9u8dRHRUqmc9'},
                     {'block_id': 16, 'valid': 0, 'date': '2020-01-03', 'hash': 'jcfhsoj987OD4BOKNpal'},
                     {'block_id': 17, 'valid': 1, 'date': '2020-01-15', 'hash': 'c5JL5wfHvtVKWC6z2Glz'},
                     {'block_id': 18, 'valid': 0, 'date': '2020-02-07', 'hash': 'TT9x6hOX2c6uKDmP5yEB'},
                     {'block_id': 19, 'valid': 1, 'date': '2020-02-08', 'hash': 's46gqQqEibLbV6fG3xPP'},
                     {'block_id': 20, 'valid': 1, 'date': '2020-02-09', 'hash': 'prD8KYDV1lkytTOOR4Og'},
                     {'block_id': 21, 'valid': 0, 'date': '2020-02-20', 'hash': 'QrZGmXFP8fbzEr1gHYAq'},
                     {'block_id': 22, 'valid': 1, 'date': '2020-02-28', 'hash': 'Qn6kox7v9u8dRHRUqmc9'},
                     {'block_id': 23, 'valid': 1, 'date': '2020-03-12', 'hash': 'kUrTKHOdTe71CuHd2Pu0'}]

/* ----- Operations ----- */
// SVG
let svgWidth = window.innerWidth
let svgHeight = 400 //window.innerHeight

let blockPadding = 10
let blockWidth = 300
let blockHeight = 300

let textColor = 'black'
let blockColor = '#236ddb'
let validColor = '#0cf01b'
let invalidColor = '#ed0e19'

let lastBlockIndex = -1

let windowWidth = window.screen.width
let nbBlocksUpdate = 10//(windowWidth/(blockWidth + blockPadding))*2

let indexFirstBlockToDisplay = 0

export function sayHi() {
  roster = Roster.fromTOML(rosterStr);
  if (!roster) {
    console.log("Roster is undefined")
    return;
  }
  document.getElementById("browse").addEventListener("click", browseClick)
  document.getElementById("show").addEventListener("click", show)
  // div#container
  container = d3.select('body').append('div').attr('id','container');
  // svg#sky
  textHolder = container.append('svg').attr('id', 'textHolder');
  console.log(document)

  document.getElementById("btnrot").addEventListener("click", function(){
    document.getElementById("btnrot").classList.toggle("down")
  })
  var newBut = document.createElement('btnrot')
  textHolder.append('btnrot').attr('id', 'newBut').attr("x", 10).attr("y", 10)

  // -----------------------------------------------------------------------------

  let svgBlocks = d3.select('.blocks')
                  .attr('width', svgWidth)
                  .attr('height', svgHeight)
                  .call(d3.zoom().on("zoom", function (e) {
                    svgBlocks.attr("transform", d3.event.transform)
                    // k is the zoom level
                    updateBlocks(d3.event.transform.x, d3.event.transform.k)
                 }))
                 .append("g")

  displayBlocks(blocksDataset, svgBlocks, blockColor, indexFirstBlockToDisplay, indexFirstBlockToDisplay + nbBlocksUpdate - 1)
}

/* ----- Functions ----- */
function placeText(pos) {
  return 25 + pos*30
}

function getBlocks() {
  const observable = new Observable(subscriber => {
      subscriber.next(blocksDataset)
      subscriber.next(blocksDataset)
  })
  return observable
}

function updateBlocks(x, zoom_level) {
  /* TODO
  const obs = getBlocks()
  obs.subscribe({
      next: data => { console.log(data) }
  })
*/
  let xMax = lastBlockIndex*(blockWidth + blockPadding)
  xMax -= windowWidth + blockWidth
  xMax *= -zoom_level
  if(x < xMax) {
      if(lastBlockIndex <= blocksDataset.length) {
          console.log('update')
          loaderAnimation() // TODO // enlever le loader, ajouter blocs, ajouter loader
          displayBlocks(blocksDataset, svgBlocks, getRandomColor(), lastBlockIndex + 1, lastBlockIndex + nbBlocksUpdate)
      }
  }
}

function loaderAnimation() {
  console.log('loader after block ' + lastBlockIndex) // TODO remove
  svgBlocks.append('rect')
      .attr('width', blockWidth)
      .attr('height', blockHeight)
      .attr('y', 25)
      .attr('transform', function (d) {
          let translate = [(lastBlockIndex + 1)*(blockWidth + blockPadding), 0]
          return 'translate('+ translate +')'
      })
      .attr('fill', getRandomColor())
}

/**
* 
* @param {*} dataset list of blocks with their attributes
* @param {*} svgBlocks svg class that will contain the blocks
* @param {*} blockColor color of the blocks
* @param {*} start index of the first block to display
* @param {*} end index of the last block to display
*/
function displayBlocks(blocksDataset, svgBlocks, blockColor, start, end) {

  let start_min = -1
  if(start < 0) start_min = 0
  else start_min = start

  let maxIndex = blocksDataset.length - 1
  let end_max = -1
  if(end < maxIndex) end_max = end
  else end_max = maxIndex

  for(let i = start_min; i <= end_max; ++i, ++lastBlockIndex) {
      
          const x_translate = (blockWidth + blockPadding)*(lastBlockIndex + 1)
          const block = blocksDataset[i]
          console.log('display block ' + i) // TODO remove
      
          svgBlocks.append('rect') // for each block, append it inside the svg container
                   .attr('width', blockWidth)
                   .attr('height', blockHeight)
                   .attr('y', 25)
                   .attr('transform', function (d) {
                       let translate = [x_translate, 0]
                       return 'translate('+ translate +')'
                   })
                   .attr('fill', blockColor)
          
          svgBlocks.append('text')
                   .attr('x', x_translate + 5)
                   .attr('y', placeText(1))
                   .text( 'block id: ' + block.block_id)
                   .attr('font-family', 'sans-serif')
                   .attr('font-size', '18px')
                   .attr('fill', textColor)
              
          svgBlocks.append('text')
                   .attr('x', x_translate + 5)
                   .attr('y', placeText(2))
                   .text( function (d) {
                      let str = ''
                      if(block.valid == 1) {
                          str = 'true'
                      } else {
                          str = 'false'
                      }
                      return 'valid: ' + str
                   })
                   .attr('font-family', 'sans-serif')
                   .attr('font-size', '18px')
                   .attr('fill', function (d) {
                      if(block.valid == 1) return validColor
                      else return invalidColor
                   })

          svgBlocks.append('text')
                   .attr('x', x_translate + 5)
                   .attr('y', placeText(3))
                   .text( function (d) { return 'date: ' + block.date })
                   .attr('font-family', 'sans-serif')
                   .attr('font-size', '18px')
                   .attr('fill', textColor)

          svgBlocks.append('text')
                   .attr('x', x_translate + 5)
                   .attr('y', placeText(4))
                   .text( function (d) { return 'hash: ' + block.hash })
                   .attr('font-family', 'sans-serif')
                   .attr('font-size', '18px')
                   .attr('fill', textColor)
  }
}

// Source: https://stackoverflow.com/a/1152508
function getRandomColor() {
  return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)
}

// ---------------------------------------------------------------------------------------

function expandTextHolder(i : number){
  var currentheight = parseInt(d3.select("svg").style("height"),10)
  d3.select("svg").style("height", currentheight + i * heightText)
}

function show(e:Event){
  console.log(seenBlocks)
  showInstance(instanceSearch)
}

function showInstance(instance : Instruction){
  console.log("Number of blocks seen: "+seenBlocks+", total should be: "+totalBlocks)
  console.log(instance)
  //browse(pageSize, numPages, firstBlockIDStart, instance)
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
          console.log("\n---- Instance ID: " + instruction.instanceID.toString("hex"))
          expandTextHolder(2)
          d3.select('svg').append("form")
          textHolder.append("text").attr("x", widthText).attr("y", 0).text("InstanceID: "+instance.instanceID.toString("hex"))
          textHolder.append("text").attr("x", widthText).attr("y", heightText).text("Spawn: BLASLABNLABR")
        }
      }
    });
  });
}

function showInvoke(instance:Instruction){
  expandTextHolder(1)
  textHolder.append("text").attr("x", widthText).attr("y", 2*heightText).text("Invoke: BLABRFJEWIOFWEö")
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
            console.log("\n---- Instance ID: " + instruction.instanceID.toString("hex"))
            expandTextHolder(1)
            textHolder.append("text").attr("x", widthText).attr("y", (j+2)*heightText).text("InstanceID: "+instance.instanceID.toString("hex")).on("click", function(d){
              textHolder.append("text").attr
              console.log("TU AS CLIQUé "+instruction.hash().toString("hex"))
            })
          }
        }
      });
    });
  }
  return j
}

function showDelete(instance:Instruction, j:number){
  expandTextHolder(1)
  textHolder.append("text").attr("x", widthText).attr("y", (j+3)*heightText).text("Delete: BLABRFJEWIOFWEö")
  textHolder.attr("x", width *2).attr("y", height *2)
  
  const payload = blocks[blocks.length-1].payload
  const body = DataBody.decode(payload)
  body.txResults.forEach((transaction) => {
    transaction.clientTransaction.instructions.forEach((instruction) => {
      if(instruction.instanceID.toString("hex") === instance.instanceID.toString("hex")){
        if (instruction.delete !== null) {
          console.log("\n--- Instruction delete 1")
          console.log("\n---- Hash: " + instruction.hash().toString("hex"))
          console.log("\n---- Instance ID: " + instruction.instanceID.toString("hex"))
          expandTextHolder(1)
          textHolder.append("text").attr("x", widthText).attr("y", (j+4)*heightText).text(" InstanceID: "+instance.instanceID.toString("hex"))
        }
      }
    });
  });
  for(let i = 0; i < 10; i++){
    expandTextHolder(1)
    textHolder.append("svg").html(`
    <g transform="matrix(5.13774e-17,0.839057,-0.839057,5.13774e-17,449.703,40.2358)">
        <path d="M0,500L250,0L500,500" style="fill:none;stroke:black;stroke-width:99.65px;"/>
    </g>
`).attr("x", widthText).attr("y", (i+j+5)*heightText-20).attr("width", 15).attr("height", heightText).attr("viewBox", "0 0 500 500")
    textHolder.append("text").attr("x", widthText+20).attr("y", (i+j+5)*heightText).text("YOLLETST + " +  i+ "  : "+instance.instanceID.toString("hex"))
  }
}

function printdata(block: SkipBlock, pageNum: number) {
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
        if (pageDone == numPagesB) {
          if (skipBlock.forwardLinks.length != 0 && seenBlocks < 5) {
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
          printdata(block, data.pagenumber)
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
Public = "93296a1867581d66916e3959ac3df13aefb417dee040f6c109efe05b6edb5d53"
Description = "New cothority"
[servers.Services]
  [servers.Services.ByzCoin]
    Public = "8776ab90a551c9512db721d1ee3854b989eb3d6cfb24f20bab6e825b0db57d33025bb41c8f8a90069f5fea116fa9bc8a7e2b915c9c0d14297cc7a0d686da70cb87f02e12193f0fd3567e649d108d204b87fae890b5ec674cd3a123a014dbf2a676ead95a96003abaf2b13cfaa9ec2527906e334d35959972e82c2ebeb4c57410"
    Suite = "bn256.adapter"
  [servers.Services.Skipchain]
    Public = "17f144552679e389b44ce0cc24b6e5780557520dd5e97eb1fa5b4019cf30fff30f750f140d7054a207d37cd6bbb02b6144a528ff6bb6d70fd9881e7d52630c82115c12d7c78f6a288eaf6ca46aaa87d4436e86b947574196c651c5dffc94cc038e1f69c58901ce07a298a9e318f494aaf21336ebf8efc748006f047d94d6d9ab"
    Suite = "bn256.adapter"`;
