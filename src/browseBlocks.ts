import { Roster, WebSocketAdapter } from '@dedis/cothority/network';
import { SkipBlock } from '@dedis/cothority/skipchain';
import { WebSocketConnection } from '@dedis/cothority/network/connection';
import { ByzCoinRPC, Instruction, Argument } from '@dedis/cothority/byzcoin';
import { PaginateResponse, PaginateRequest } from '@dedis/cothority/byzcoin/proto/stream';
import { Subject } from 'rxjs';
import { DataBody } from '@dedis/cothority/byzcoin/proto';
import { Observable } from 'rxjs';
import * as d3 from 'd3';

export class BrowseBlocks {

    blocksDataset: any

    svgWidth: number
    svgHeight: number

    blockPadding: number
    blockWidth: number
    blockHeight: number

    textColor: string
    blockColor: string
    validColor: string
    invalidColor: string

    lastBlockIndex: number

    windowWidth: number
    nbBlocksUpdate: number

    indexFirstBlockToDisplay: number
    
    constructor() {
        
        this.blocksDataset = [{'block_id': 0, 'valid': 1, 'date': '2020-01-01', 'hash': '9jZPAyiIzf3XfBcT8WaG'},
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

        this.svgWidth = window.innerWidth
        this.svgHeight = 400

        this.blockPadding = 10
        this.blockWidth = 300
        this.blockHeight = 300

        this.textColor = 'black'
        this.blockColor = '#236ddb'
        this.validColor = '#0cf01b'
        this.invalidColor = '#ed0e19'

        this.lastBlockIndex = -1

        this.windowWidth = window.screen.width
        this.nbBlocksUpdate = 10//(windowWidth/(blockWidth + blockPadding))*2

        this.indexFirstBlockToDisplay = 0
    }

    main() {
        console.log('test main browseBlocks')

        let svgBlocks = d3.select('.blocks')
                            .attr('width', this.svgWidth)
                            .attr('height', this.svgHeight)
                            .call(d3.zoom().on('zoom', function(updateBlocks: function updateBlocks1(3.event.transform.x: number, d3.event.transform.k: number) {
                                this.updateBlocks(x, k, svgBlocks)
                            }) {
                                svgBlocks.attr('transform', d3.event.transform)
                                // k is the zoom level
                                //this.updateBlocks(d3.event.transform.x, d3.event.transform.k)
                                updateBlocks1(d3.event.transform.x, d3.event.transform.k)
                            }))
                            .append("g")

        this.displayBlocks(this.blocksDataset, svgBlocks, this.blockColor, this.indexFirstBlockToDisplay, this.indexFirstBlockToDisplay + this.nbBlocksUpdate - 1)
    }

    placeText(pos: number): number {
        return 25 + pos*30
    }
    
    getBlocks(blocksDataset: any) {
        const observable = new Observable(subscriber => {
            subscriber.next(blocksDataset)
            subscriber.next(blocksDataset)
        })
        return observable
    }
    
    updateBlocks(x: number, zoom_level: number, svgBlocks: any) {
        /* TODO
        const obs = getBlocks()
        obs.subscribe({
            next: data => { console.log(data) }
        })
    */
   
        let xMax = this.lastBlockIndex*(this.blockWidth + this.blockPadding)
        xMax -= this.windowWidth + this.blockWidth
        xMax *= -zoom_level
        if(x < xMax) {
            if(this.lastBlockIndex <= this.blocksDataset.length) {
                console.log('update')
                //loaderAnimation() // TODO // enlever le loader, ajouter blocs, ajouter loader
                this.displayBlocks(this.blocksDataset, svgBlocks, this.getRandomColor(), this.lastBlockIndex + 1, this.lastBlockIndex + this.nbBlocksUpdate)
            }
        }
    }
    
    loaderAnimation(svgBlocks: any) {
        console.log('loader after block ' + this.lastBlockIndex) // TODO remove
        svgBlocks.append('rect')
            .attr('width', this.blockWidth)
            .attr('height', this.blockHeight)
            .attr('y', 25)
            .attr('transform', function (d: string) {
                let translate = [(this.lastBlockIndex + 1)*(this.blockWidth + this.blockPadding), 0]
                return 'translate('+ translate +')'
            })
            .attr('fill', this.getRandomColor())
    }
    
    /**
     * 
     * @param {*} dataset list of blocks with their attributes
     * @param {*} svgBlocks svg class that will contain the blocks
     * @param {*} blockColor color of the blocks
     * @param {*} start index of the first block to display
     * @param {*} end index of the last block to display
     */
    
    displayBlocks(blocksDataset: any, svgBlocks: any, blockColor: string, start: number, end: number) {
    
        let start_min = -1
        if(start < 0) start_min = 0
        else start_min = start
    
        let maxIndex = blocksDataset.length - 1
        let end_max = -1
        if(end < maxIndex) end_max = end
        else end_max = maxIndex
    
        for(let i = start_min; i <= end_max; ++i, ++this.lastBlockIndex) {
            
                const x_translate = (this.blockWidth + this.blockPadding)*(this.lastBlockIndex + 1)
                const block = blocksDataset[i]
                console.log('display block ' + i) // TODO remove
            
                svgBlocks.append('rect') // for each block, append it inside the svg container
                         .attr('width', this.blockWidth)
                         .attr('height', this.blockHeight)
                         .attr('y', 25)
                         .attr('transform', function (d: any) {
                             let translate = [x_translate, 0]
                             return 'translate('+ translate +')'
                         })
                         .attr('fill', blockColor)
                
                svgBlocks.append('text')
                         .attr('x', x_translate + 5)
                         .attr('y', this.placeText(1))
                         .text( 'block id: ' + block.block_id)
                         .attr('font-family', 'sans-serif')
                         .attr('font-size', '18px')
                         .attr('fill', this.textColor)
                    
                svgBlocks.append('text')
                         .attr('x', x_translate + 5)
                         .attr('y', this.placeText(2))
                         .text( function (d: any) {
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
                         .attr('fill', function (d: any) {
                            if(block.valid == 1) return this.validColor
                            else return this.invalidColor
                         })
    
                svgBlocks.append('text')
                         .attr('x', x_translate + 5)
                         .attr('y', this.placeText(3))
                         .text( function (d: any) { return 'date: ' + block.date })
                         .attr('font-family', 'sans-serif')
                         .attr('font-size', '18px')
                         .attr('fill', this.textColor)
    
                svgBlocks.append('text')
                         .attr('x', x_translate + 5)
                         .attr('y', this.placeText(4))
                         .text( function (d: any) { return 'hash: ' + block.hash })
                         .attr('font-family', 'sans-serif')
                         .attr('font-size', '18px')
                         .attr('fill', this.textColor)
        }
    }
    
    // Source: https://stackoverflow.com/a/1152508
    getRandomColor() {
        return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)
    }


    browse(pageSizeB: number,
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
            console.log("End of Blockchain")
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
      
      getNextBlocks(
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

}
