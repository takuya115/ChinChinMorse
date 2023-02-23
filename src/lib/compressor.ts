import LZString from 'lz-string'

export default class Compressor {
    compress(text: string): string {
        // uriにエンコードして圧縮
        const compressed: string = LZString.compressToEncodedURIComponent(text);
        // console.log(compressed);
        return compressed; 
    }

    decompress(text: string): string {
        const decompressed: string = LZString.decompressFromEncodedURIComponent(text);
        // console.log(decompressed);
        return decompressed;
    }
}