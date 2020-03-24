// ----- Blocks -----
// Dummy dataset of blocks
let dataBlocks = [{'block_id': 0, 'valid': 1, 'date': '2020-01-01', 'hash': '9jZPAyiIzf3XfBcT8WaG'},
                  {'block_id': 1, 'valid': 1, 'date': '2020-01-02', 'hash': 'vs3H2CgTfs3qCXxiEgJA'},
                  {'block_id': 2, 'valid': 0, 'date': '2020-01-03', 'hash': 'jcfhsoj987OD4BOKNpal'},
                  {'block_id': 3, 'valid': 1, 'date': '2020-01-15', 'hash': 'c5JL5wfHvtVKWC6z2Glz'},
                  {'block_id': 4, 'valid': 0, 'date': '2020-02-07', 'hash': 'TT9x6hOX2c6uKDmP5yEB'},
                  {'block_id': 5, 'valid': 1, 'date': '2020-02-08', 'hash': 's46gqQqEibLbV6fG3xPP'},
                  {'block_id': 6, 'valid': 1, 'date': '2020-02-09', 'hash': 'prD8KYDV1lkytTOOR4Og'},
                  {'block_id': 7, 'valid': 0, 'date': '2020-02-20', 'hash': 'QrZGmXFP8fbzEr1gHYAq'},
                  {'block_id': 8, 'valid': 1, 'date': '2020-02-28', 'hash': 'Qn6kox7v9u8dRHRUqmc9'},
                  {'block_id': 9, 'valid': 1, 'date': '2020-03-12', 'hash': 'kUrTKHOdTe71CuHd2Pu0'}]

dataBlocks = dataBlocks.reverse()

// SVG
let svgWidth = window.innerWidth
let svgHeight = 400 // TODO adjust automatically
let svgBlocks = d3.select('.blocks')
                  .attr('width', svgWidth)
                  .attr('height', svgHeight)

let blockPadding = 10
let blockWidth = 300
let blockHeight = 300

// Rectangles
svgBlocks.selectAll('rect')
         .data(dataBlocks)
         .enter()
         .append('rect') // for each block, append it inside the svg container
         .attr('width', blockWidth - blockPadding)
         .attr('height', blockHeight)
         .attr('y', 25)
         .attr('transform', function (d, i) {
            let translate = [blockWidth*i, 0]
            return 'translate('+ translate +')'
         })
         .attr('fill', '#236ddb')

// Text // TODO is a for-loop on dataset attributes possible?
function placeText(pos) {
    return 25 + pos*30
}

let texts = svgBlocks.selectAll('text')
         .data(dataBlocks)
         .enter()

let textsColor = 'black'
texts.append('text')
         .attr('x', function(d, i) {
             return blockWidth*i + 5
         })
         .attr('y', placeText(1))
         .text( function (d) { return 'block id: ' + d.block_id })
         .attr('font-family', 'sans-serif')
         .attr('font-size', '18px')
         .attr('fill', textsColor)

let validColor = '#0cf01b'
let invalidColor = '#ed0e19'
texts.append('text')
         .attr('x', function(d, i) {
             return blockWidth*i + 5
         })
         .attr('y', placeText(2))
         .text( function (d) {
             let str = ''
             if(d.valid == 1) {
                 str = 'true'
             } else {
                 str = 'false'
             }
             return 'valid: ' + str
         })
         .attr('font-family', 'sans-serif')
         .attr('font-size', '18px')
         .attr('fill', function (d) {
             if(d.valid == 1) return validColor
             else return invalidColor
         })

texts.append('text')
         .attr('x', function(d, i) {
             return blockWidth*i + 5
         })
         .attr('y', placeText(3))
         .text( function (d) { return 'date: ' + d.date })
         .attr('font-family', 'sans-serif')
         .attr('font-size', '18px')
         .attr('fill', textsColor)

texts.append('text')
         .attr('x', function(d, i) {
             return blockWidth*i + 5
         })
         .attr('y', placeText(4))
         .text( function (d) { return 'hash: ' + d.hash })
         .attr('font-family', 'sans-serif')
         .attr('font-size', '18px')
         .attr('fill', textsColor)
