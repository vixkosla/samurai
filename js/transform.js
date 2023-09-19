import { NodeIO } from '@gltf-transform/core';

import { generateTangents } from 'mikktspace';

import sharp from 'sharp';

import { PropertyType } from '@gltf-transform/core';

import { unweld, textureCompress, tangents, sparse, simplify, join, instance, flatten, reorder, weld, quantize, resample, prune, dedup, draco, center, metalRough } from '@gltf-transform/functions';

import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
// import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';
// import { KHRTextureBasisu } from '@gltf-transform/extensions';
import { KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { EXTMeshoptCompression } from '@gltf-transform/extensions';


import { MeshoptDecoder, MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import draco3d from 'draco3dgltf';

await MeshoptDecoder.ready;
await MeshoptEncoder.ready;

const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)

    // .registerExtensions(KHRONOS_EXTENSIONS)
// .registerExtensions(KHRONOS_EXTENSIONS)
// .registerExtensions([EXTMeshoptCompression, KHRTextureBasisu])
// .registerExtensions([EXTMeshoptCompression])
.registerExtensions([KHRDracoMeshCompression])
.registerDependencies({
'draco3d.decoder': await draco3d.createDecoderModule(), // Optional.
'draco3d.encoder': await draco3d.createEncoderModule(), // Optional.
'meshopt.decoder': MeshoptDecoder,
'meshopt.encoder': MeshoptEncoder,
});;

// Read.
let document;
document = await io.read('models/new/KATANA_v3.glb'); // → Document
// document = await io.readBinary(glb);   // Uint8Array → Document

// document.getRoot().listMeshes(); // → [Mesh, Mesh, Mesh]



// transform 

await document.transform(
    // Losslessly resample animation frames.
    // resample(),
    // Remove unused nodes, textures, or other data.

    center({pivot: 'below'}),

    unweld({ tolerance: 0.0001, toleranceNormal: 0.5 }),
    
    tangents({generateTangents}),
    // metalRough(),
    

    prune(),

    weld({ tolerance: 0.0001, toleranceNormal: 0.5 }),
    // quantize(),
    simplify({ simplifier: MeshoptSimplifier, ratio: 0.5, error: 0.0001 }),

    // sparse({ratio: 1 / 10}),
    // reorder({encoder: MeshoptEncoder, level: 'high'}),
    // dedup({propertyTypes: [PropertyType.MESH]}),
    // Remove duplicate vertex or texture data, if any.
    // dedup({ propertyTypes: [PropertyType.MATERIAL, PropertyType.MESH] }),
    // instance({min: 2}),
    // join({ keepNamed: false }),

    // Compress mesh geometry with Draco.
    // draco(),
    // Convert textures to WebP (Requires glTF Transform v3 and Node.js).
    textureCompress({
        encoder: sharp,
        targetFormat: 'webp',
        slots: /^(?!normalTexture).*$/, // exclude normal maps,
        resize: [512, 512]
    }),

    reorder({ encoder: MeshoptEncoder, level: 'high' }),
    quantize({ pattern: /^(POSITION|TEXCOORD|JOINTS|WEIGHTS)(_\d+)?$/ }),


    // flatten(),
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
    // .setRequired(true)
    // .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.FILTER });

// document.createExtension(KHRTextureBasisu)
//     .setRequired(true);

// document.createExtension(KHRDracoMeshCompression)
//     .setRequired(true)
//     .setEncoderOptions({
//         method: KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER,
//         encodeSpeed: 5,
//         decodeSpeed: 5,
//     });

// Write.
await io.write('models/new/SHOGUN_v511.glb', document);      // → void
// const glb = await io.writeBinary(document); // Document → Uint8Array
