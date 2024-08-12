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
  EllipseOutlineGeometry_default
} from "./chunk-65MZOUNU.js";
import "./chunk-D4K27X2M.js";
import "./chunk-GNHZH7HP.js";
import "./chunk-EB7PNZTK.js";
import "./chunk-JYQNWIQQ.js";
import "./chunk-IUROUBPA.js";
import "./chunk-ELI4BUOT.js";
import "./chunk-OXALEQPI.js";
import "./chunk-FQPSOOPH.js";
import {
  Cartesian3_default,
  Ellipsoid_default
} from "./chunk-T6LPN7RI.js";
import "./chunk-R4OIEIPE.js";
import "./chunk-RHBWXX7C.js";
import "./chunk-ZIKGV7EL.js";
import "./chunk-BAVI3ZS2.js";
import "./chunk-TGY6H6N6.js";
import {
  defined_default
} from "./chunk-N4QEHO3U.js";

// packages/engine/Source/Workers/createEllipseOutlineGeometry.js
function createEllipseOutlineGeometry(ellipseGeometry, offset) {
  if (defined_default(offset)) {
    ellipseGeometry = EllipseOutlineGeometry_default.unpack(ellipseGeometry, offset);
  }
  ellipseGeometry._center = Cartesian3_default.clone(ellipseGeometry._center);
  ellipseGeometry._ellipsoid = Ellipsoid_default.clone(ellipseGeometry._ellipsoid);
  return EllipseOutlineGeometry_default.createGeometry(ellipseGeometry);
}
var createEllipseOutlineGeometry_default = createEllipseOutlineGeometry;
export {
  createEllipseOutlineGeometry_default as default
};
