import { NodeIO } from '@gltf-transform/core';

import { reorder, weld, quantize, resample, prune, dedup, draco, center, metalRough } from '@gltf-transform/functions';

import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';
// import { KHRTextureBasisu } from '@gltf-transform/extensions';
// import { KHRDracoMeshCompression } from '@gltf-transform/extensions';
// import { EXTMeshoptCompression } from '@gltf-transform/extensions';


import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import draco3d from 'draco3dgltf';

// await MeshoptDecoder.ready;
// await MeshoptEncoder.ready;

const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
// .registerExtensions(KHRONOS_EXTENSIONS)
// .registerExtensions([EXTMeshoptCompression, KHRTextureBasisu])
// .registerDependencies({
// 'draco3d.decoder': await draco3d.createDecoderModule(), // Optional.
// 'draco3d.encoder': await draco3d.createEncoderModule(), // Optional.
// 'meshopt.decoder': MeshoptDecoder,
// 'meshopt.encoder': MeshoptEncoder,
// });;

// Read.
let document;
document = await io.read('./models/new/KATANA_v3.gltf'); // → Document
// document = await io.readBinary(glb);   // Uint8Array → Document




// transform 

await document.transform(
    // Losslessly resample animation frames.
    // resample(),
    // Remove unused nodes, textures, or other data.

    // center(),

    // metalRough(),

    prune(),

    // weld(),
    // quantize(),
    // dedup(),

    // Remove duplicate vertex or texture data, if any.
    // dedup(),
    // Compress mesh geometry with Draco.
    // draco(),
    // Convert textures to WebP (Requires glTF Transform v3 and Node.js).
    // textureCompress({
    // encoder: sharp,
    // targetFormat: 'ktx2',
    // resize: [512, 512],
    // }),

    // reorder({ encoder: MeshoptEncoder }),
    // quantize({ pattern: /^(POSITION|TEXCOORD|JOINTS|WEIGHTS)(_\d+)?$/ }),

    // draco()
    // Custom transform.

    // backfaceCulling({ cull: true }),
);

// function backfaceCulling(options) {
//     return (document) => {
//         for (const material of document.getRoot().listMaterials()) {
//             material.setDoubleSided(!options.cull);
//         }
//     };
// }

// document.createExtension(EXTMeshoptCompression)
//     .setRequired(true)
//     .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.FILTER });

// document.createExtension(KHRTextureBasisu)
//     .setRequired(true);

// Write.
await io.write('models/new/KATANA_v311.glb', document);      // → void
// const glb = await io.writeBinary(document); // Document → Uint8Array
