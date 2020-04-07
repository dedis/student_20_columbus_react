// ----- Blocks -----
// Dummy dataset of blocks
// For now, we suppose that all the blocks are all in the dataset
/*
let dataset = [{'block_id': 0, 'valid': 1, 'date': '2020-01-01', 'hash': '9jZPAyiIzf3XfBcT8WaG'},
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

dataset = dataset.reverse()
*/
let dataset = []

function loadBlocks(start, end) {
    d3.csv('blocks.csv').then(function(data) {
        for(let i = start; i <= end; ++i) {
            dataset[i] = data[i]
        }
        console.log(dataset)
    })
    .catch(function(error){
       // handle error   
    })
    console.log(dataset)
}

function loadAllBlocks() {
    d3.csv('blocks.csv').then(function(data) {
        for(let i = 0; i < data.length; ++i) {
            dataset[i] = data[i]
        }
        console.log(dataset[0])
    })
    .catch(function(error){
       // handle error   
    })
    console.log(dataset)
}

loadAllBlocks()
console.log(dataset[0]) // TODO
/*
// SVG
let svgWidth = window.innerWidth
let svgHeight = 400 // TODO adjust automatically
let svgBlocks = d3.select('.blocks')
                  .attr('width', svgWidth)
                  .attr('height', svgHeight)
                  .call(d3.zoom().on("zoom", function () {
                    svgBlocks.attr("transform", d3.event.transform)
                 }))
                 .append("g")

let blockPadding = 10
let blockWidth = 300
let blockHeight = 300

function placeText(pos) {
    return 25 + pos*30
}

let textsColor = 'black'
let validColor = '#0cf01b'
let invalidColor = '#ed0e19'

let loadedBlocksMin = -1
let loadedBlocksMax = -1
*/
/**
 * 
 * @param {*} dataset list of blocks with their attributes
 * @param {*} svgBlocks svg class that will contain the blocks
 * @param {*} blockColor color of the blocks
 * @param {*} start index of the first block to display
 * @param {*} end index of the last block to display
 */
/*
function displayBlocks(dataset, svgBlocks, blockColor, start, end) {

    let size = svgBlocks.selectAll('rect').size();
    let length = dataset.length

    let start_min = -1
    if(start < 0) start_min = 0
    else start_min = start

    let end_max = -1
    if(end < length) end_max = end
    else end_max = length

    for(let i = start; i <= end_max; ++i) {
        
            const x_translate = blockWidth*(i - start_min + size)
            const block = dataset[i]
        
            svgBlocks.append('rect') // for each block, append it inside the svg container
                     .attr('width', blockWidth - blockPadding)
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
                     .attr('fill', textsColor)
                
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
                     .attr('fill', textsColor)

            svgBlocks.append('text')
                     .attr('x', x_translate + 5)
                     .attr('y', placeText(4))
                     .text( function (d) { return 'hash: ' + block.hash })
                     .attr('font-family', 'sans-serif')
                     .attr('font-size', '18px')
                     .attr('fill', textsColor)

    }
}

displayBlocks(dataset, svgBlocks, '#236ddb', 0, 9)
loadedBlocksMin = 0
loadedBlocksMax = 9

// Load more blocks
displayBlocks(dataset, svgBlocks, 'green', 10, 19)
loadedBlocksMax = 19

displayBlocks(dataset, svgBlocks, 'orange', 20, 23)
loadedBlocksMax = 23
*/