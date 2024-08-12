/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.120
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

import {
  PrimitivePipeline_default
} from "./chunk-VRZ46QZ5.js";
import {
  createTaskProcessorWorker_default
} from "./chunk-MMV6TO3P.js";
import "./chunk-QYQIVZBU.js";
import "./chunk-PNFHVBSF.js";
import "./chunk-J7MQUQJY.js";
import "./chunk-SAPFXU5X.js";
import "./chunk-TF776XCO.js";
import "./chunk-A5CODJ4M.js";
import "./chunk-EB7PNZTK.js";
import "./chunk-JYQNWIQQ.js";
import "./chunk-IUROUBPA.js";
import "./chunk-ELI4BUOT.js";
import "./chunk-OXALEQPI.js";
import "./chunk-FQPSOOPH.js";
import "./chunk-T6LPN7RI.js";
import "./chunk-R4OIEIPE.js";
import "./chunk-RHBWXX7C.js";
import "./chunk-ZIKGV7EL.js";
import "./chunk-BAVI3ZS2.js";
import "./chunk-TGY6H6N6.js";
import "./chunk-N4QEHO3U.js";

// packages/engine/Source/Workers/combineGeometry.js
function combineGeometry(packedParameters, transferableObjects) {
  const parameters = PrimitivePipeline_default.unpackCombineGeometryParameters(
    packedParameters
  );
  const results = PrimitivePipeline_default.combineGeometry(parameters);
  return PrimitivePipeline_default.packCombineGeometryResults(
    results,
    transferableObjects
  );
}
var combineGeometry_default = createTaskProcessorWorker_default(combineGeometry);
export {
  combineGeometry_default as default
};
