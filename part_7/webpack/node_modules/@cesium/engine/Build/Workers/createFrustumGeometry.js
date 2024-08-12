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
  FrustumGeometry_default
} from "./chunk-2GEAGYUY.js";
import "./chunk-LSSWVB2X.js";
import "./chunk-A5CODJ4M.js";
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
import {
  defined_default
} from "./chunk-N4QEHO3U.js";

// packages/engine/Source/Workers/createFrustumGeometry.js
function createFrustumGeometry(frustumGeometry, offset) {
  if (defined_default(offset)) {
    frustumGeometry = FrustumGeometry_default.unpack(frustumGeometry, offset);
  }
  return FrustumGeometry_default.createGeometry(frustumGeometry);
}
var createFrustumGeometry_default = createFrustumGeometry;
export {
  createFrustumGeometry_default as default
};
