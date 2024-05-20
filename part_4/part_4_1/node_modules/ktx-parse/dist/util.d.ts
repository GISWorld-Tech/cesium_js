import { vec3 } from './constants-internal.js';
import { VKFormat } from './constants.js';
import type { KTX2Container } from './container.js';
/** Encodes text to an ArrayBuffer. */
export declare function encodeText(text: string): Uint8Array;
/** Decodes an ArrayBuffer to text. */
export declare function decodeText(buffer: Uint8Array): string;
/** Concatenates N ArrayBuffers. */
export declare function concat(buffers: (ArrayBuffer | Uint8Array)[]): Uint8Array;
/** Returns the least common multiple (LCM) for two positive integers. */
export declare function leastCommonMultiple(a: number, b: number): number;
/**
 * Returns amount of padding, in bytes, required to pad a value V to N-byte
 * boundaries. Both V and N must be positive integers.
 */
export declare function getPadding(v: number, n?: number): number;
/** Returns byte length per texel block. */
export declare function getBlockByteLength(container: KTX2Container): number;
/**
 * Returns total number of blocks for given level. For VK_FORMAT_UNDEFINED, DFD is required.
 *
 * References:
 * - https://github.khronos.org/KTX-Specification/ktxspec.v2.html#levelImages
 */
export declare function getBlockCount(container: KTX2Container, levelIndex: number): number;
/**
 * Given a KTX2 container, returns block dimensions as [width, height, depth]. Requires valid DFD.
 */
export declare function getBlockDimensions(container: KTX2Container): vec3;
/**
 * Given `vkFormat`, returns block dimensions as [width, height, depth]. Does not support
 * VK_FORMAT_UNDEFINED.
 *
 * References:
 * - https://github.khronos.org/KTX-Specification/ktxspec.v2.html#_mippadding
 * - https://registry.khronos.org/vulkan/specs/1.2-extensions/html/vkspec.html#formats-compatibility
 */
export declare function getBlockDimensionsByVKFormat(vkFormat: VKFormat): vec3;
