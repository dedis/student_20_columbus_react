declare let blocksDataset: {
    block_id: number;
    valid: number;
    date: string;
    hash: string;
}[];
declare let svgWidth: number;
declare let svgHeight: number;
declare let svgBlocks: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
declare let blockPadding: number;
declare let blockWidth: number;
declare let blockHeight: number;
declare let textColor: string;
declare let blockColor: string;
declare let validColor: string;
declare let invalidColor: string;
declare let lastBlockIndex: number;
declare let windowWidth: number;
declare let nbBlocksUpdate: number;
declare let indexFirstBlockToDisplay: number;
declare function placeText(pos: any): number;
declare function getBlocks(): any;
declare function updateBlocks(x: any, zoom_level: any): void;
declare function loaderAnimation(): void;
/**
 *
 * @param {*} dataset list of blocks with their attributes
 * @param {*} svgBlocks svg class that will contain the blocks
 * @param {*} blockColor color of the blocks
 * @param {*} start index of the first block to display
 * @param {*} end index of the last block to display
 */
declare function displayBlocks(blocksDataset: any, svgBlocks: any, blockColor: any, start: any, end: any): void;
declare function getRandomColor(): string;
