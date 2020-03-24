// ----- Blocks -----
// Dummy dataset of blocks
// For now, we suppose that all the blocks are all in the dataset
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

function displayBlocks(dataset, svgBlocks, blockColor) { // pour l'instant ne rajouter que des blocs à droite

    let size = svgBlocks.selectAll('rect').size();
    for(let i = 0; i < dataset.length; ++i) {
        
            const x_translate = blockWidth*(i + size)
            const block = dataset[i]
        
            svgBlocks
                .append('rect') // for each block, append it inside the svg container
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
                


    }
        
    


    
/*

        // Text // TODO is a for-loop on dataset attributes possible?
    

    let texts = svgBlocks.selectAll('text')
            .data(dataset)
            .enter()

    let textsColor = 'black'
    let validColor = '#0cf01b'
    let invalidColor = '#ed0e19'

    for(int i = 0; i < )
    svgBlocks.selectAll('rect').each(element => {
        svgBlocks.append('text')
        .attr('x', function(d, i) {
            return blockWidth*size + 5
        })
        .attr('y', placeText(1))
        .text( 'block id: ' + element.block_id )
        .attr('font-family', 'sans-serif')
        .attr('font-size', '18px')
        .attr('fill', textsColor)
    })


    /*
    texts.append('text')
            .attr('x', function(d, i) {
                return blockWidth*i + 5
            })
            .attr('y', placeText(1))
            .text( function (d) { return 'block id: ' + d.block_id })
            .attr('font-family', 'sans-serif')
            .attr('font-size', '18px')
            .attr('fill', textsColor)

    
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
            */
}

displayBlocks(dataBlocks, svgBlocks, '#236ddb')

// Update
dataBlocks = [{'block_id': 10, 'valid': 0, 'date': '2020-03-13', 'hash': '9jZPAyiIzf3XfBcT8WaG'},
                  {'block_id': 11, 'valid': 1, 'date': '2020-01-02', 'hash': 'vs3H2CgTfs3qCXxiEgJA'}]
displayBlocks(dataBlocks, svgBlocks, 'green')
