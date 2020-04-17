//import * as rxjs from '../node_modules/rxjs'

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
let svgBlocks = d3.select('.blocks')
                  .attr('width', svgWidth)
                  .attr('height', svgHeight)
                  .call(d3.zoom().on("zoom", function (e) {
                    svgBlocks.attr("transform", d3.event.transform)
                    // k is the zoom level
                    updateBlocks(d3.event.transform.x, d3.event.transform.k)
                 }))
                 .append("g")

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

displayBlocks(blocksDataset, svgBlocks, blockColor, indexFirstBlockToDisplay, indexFirstBlockToDisplay + nbBlocksUpdate - 1)

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
