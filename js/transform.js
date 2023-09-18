import { NodeIO } from '@gltf-transform/core';

import { reorder, weld, quantize, resample, prune, dedup, draco, center, metalRough, textureCompress } from '@gltf-transform/functions';

import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';
import { KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { EXTMeshoptCompression } from '@gltf-transform/extensions';


import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import draco3d from 'draco3dgltf';

await MeshoptDecoder.ready;
await MeshoptEncoder.ready;

const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerExtensions([EXTMeshoptCompression ])
    .registerDependencies({
        'draco3d.decoder': await draco3d.createDecoderModule(), // Optional.
        'draco3d.encoder': await draco3d.createEncoderModule(), // Optional.
        'meshopt.decoder': MeshoptDecoder,
        'meshopt.encoder': MeshoptEncoder,
    });;

// Read.
let document;
document = await io.read('models/new/Samurai_FixedMet_7.gltf'); // → Document
// document = await io.readBinary(glb);   // Uint8Array → Document

// transform 

await document.transform(
    // Losslessly resample animation frames.
    resample(),
    // Remove unused nodes, textures, or other data.

    center(),

    metalRough(),

    prune(),

    // Remove duplicate vertex or texture data, if any.
    // dedup(),
    // Compress mesh geometry with Draco.
    // draco(),
    // Convert textures to WebP (Requires glTF Transform v3 and Node.js).
    textureCompress({
        // encoder: sharp,
        targetFormat: 'webp',
        resize: [2048, 2048],
    }),

    reorder({ encoder: MeshoptEncoder }),
    quantize()
    // Custom transform.
);

document.createExtension(EXTMeshoptCompression)
    .setRequired(true)
    .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });

// Write.
await io.write('models/new/Samurai_FixedMet_711.glb', document);      // → void
// const glb = await io.writeBinary(document); // Document → Uint8Array
