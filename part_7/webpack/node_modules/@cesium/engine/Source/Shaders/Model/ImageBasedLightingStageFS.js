//This file is automatically rebuilt by the Cesium build process.
export default "/**\n\
 * Compute some metrics for a procedural sky lighting model\n\
 *\n\
 * @param {vec3} positionWC The position of the fragment in world coordinates.\n\
 * @param {vec3} reflectionWC A unit vector in the direction of the reflection, in world coordinates.\n\
 * @return {vec3} The dot products of the horizon and reflection directions with the nadir, and an atmosphere boundary distance.\n\
 */\n\
vec3 getProceduralSkyMetrics(vec3 positionWC, vec3 reflectionWC)\n\
{\n\
    // Figure out if the reflection vector hits the ellipsoid\n\
    float horizonDotNadir = 1.0 - min(1.0, czm_ellipsoidRadii.x / length(positionWC));\n\
    float reflectionDotNadir = dot(reflectionWC, normalize(positionWC));\n\
    float atmosphereHeight = 0.05;\n\
    float smoothstepHeight = smoothstep(0.0, atmosphereHeight, horizonDotNadir);\n\
    return vec3(horizonDotNadir, reflectionDotNadir, smoothstepHeight);\n\
}\n\
\n\
/**\n\
 * Compute the diffuse irradiance for a procedural sky lighting model.\n\
 *\n\
 * @param {vec3} skyMetrics The dot products of the horizon and reflection directions with the nadir, and an atmosphere boundary distance.\n\
 * @return {vec3} The computed diffuse irradiance.\n\
 */\n\
vec3 getProceduralDiffuseIrradiance(vec3 skyMetrics)\n\
{\n\
    vec3 blueSkyDiffuseColor = vec3(0.7, 0.85, 0.9); \n\
    float diffuseIrradianceFromEarth = (1.0 - skyMetrics.x) * (skyMetrics.y * 0.25 + 0.75) * skyMetrics.z;  \n\
    float diffuseIrradianceFromSky = (1.0 - skyMetrics.z) * (1.0 - (skyMetrics.y * 0.25 + 0.25));\n\
    return blueSkyDiffuseColor * clamp(diffuseIrradianceFromEarth + diffuseIrradianceFromSky, 0.0, 1.0);\n\
}\n\
\n\
/**\n\
 * Compute the specular irradiance for a procedural sky lighting model.\n\
 *\n\
 * @param {vec3} reflectionWC The reflection vector in world coordinates.\n\
 * @param {vec3} skyMetrics The dot products of the horizon and reflection directions with the nadir, and an atmosphere boundary distance.\n\
 * @param {float} roughness The roughness of the material.\n\
 * @return {vec3} The computed specular irradiance.\n\
 */\n\
vec3 getProceduralSpecularIrradiance(vec3 reflectionWC, vec3 skyMetrics, float roughness)\n\
{\n\
    // Flipping the X vector is a cheap way to get the inverse of czm_temeToPseudoFixed, since that's a rotation about Z.\n\
    reflectionWC.x = -reflectionWC.x;\n\
    reflectionWC = -normalize(czm_temeToPseudoFixed * reflectionWC);\n\
    reflectionWC.x = -reflectionWC.x;\n\
\n\
    float inverseRoughness = 1.0 - roughness;\n\
    inverseRoughness *= inverseRoughness;\n\
    vec3 sceneSkyBox = czm_textureCube(czm_environmentMap, reflectionWC).rgb * inverseRoughness;\n\
\n\
    // Compute colors at different angles relative to the horizon\n\
    vec3 belowHorizonColor = mix(vec3(0.1, 0.15, 0.25), vec3(0.4, 0.7, 0.9), skyMetrics.z);\n\
    vec3 nadirColor = belowHorizonColor * 0.5;\n\
    vec3 aboveHorizonColor = mix(vec3(0.9, 1.0, 1.2), belowHorizonColor, roughness * 0.5);\n\
    vec3 blueSkyColor = mix(vec3(0.18, 0.26, 0.48), aboveHorizonColor, skyMetrics.y * inverseRoughness * 0.5 + 0.75);\n\
    vec3 zenithColor = mix(blueSkyColor, sceneSkyBox, skyMetrics.z);\n\
\n\
    // Compute blend zones\n\
    float blendRegionSize = 0.1 * ((1.0 - inverseRoughness) * 8.0 + 1.1 - skyMetrics.x);\n\
    float blendRegionOffset = roughness * -1.0;\n\
    float farAboveHorizon = clamp(skyMetrics.x - blendRegionSize * 0.5 + blendRegionOffset, 1.0e-10 - blendRegionSize, 0.99999);\n\
    float aroundHorizon = clamp(skyMetrics.x + blendRegionSize * 0.5, 1.0e-10 - blendRegionSize, 0.99999);\n\
    float farBelowHorizon = clamp(skyMetrics.x + blendRegionSize * 1.5, 1.0e-10 - blendRegionSize, 0.99999);\n\
\n\
    // Blend colors\n\
    float notDistantRough = (1.0 - skyMetrics.x * roughness * 0.8);\n\
    vec3 specularIrradiance = mix(zenithColor, aboveHorizonColor, smoothstep(farAboveHorizon, aroundHorizon, skyMetrics.y) * notDistantRough);\n\
    specularIrradiance = mix(specularIrradiance, belowHorizonColor, smoothstep(aroundHorizon, farBelowHorizon, skyMetrics.y) * inverseRoughness);\n\
    specularIrradiance = mix(specularIrradiance, nadirColor, smoothstep(farBelowHorizon, 1.0, skyMetrics.y) * inverseRoughness);\n\
\n\
    return specularIrradiance;\n\
}\n\
\n\
#ifdef USE_SUN_LUMINANCE\n\
float clampedDot(vec3 x, vec3 y)\n\
{\n\
    return clamp(dot(x, y), 0.001, 1.0);\n\
}\n\
/**\n\
 * Sun luminance following the \"CIE Clear Sky Model\"\n\
 * See page 40 of https://3dvar.com/Green2003Spherical.pdf\n\
 *\n\
 * @param {vec3} positionWC The position of the fragment in world coordinates.\n\
 * @param {vec3} normalEC The surface normal in eye coordinates.\n\
 * @param {vec3} lightDirectionEC Unit vector pointing to the light source in eye coordinates.\n\
 * @return {float} The computed sun luminance.\n\
 */\n\
float getSunLuminance(vec3 positionWC, vec3 normalEC, vec3 lightDirectionEC)\n\
{\n\
    vec3 normalWC = normalize(czm_inverseViewRotation * normalEC);\n\
    vec3 lightDirectionWC = normalize(czm_inverseViewRotation * lightDirectionEC);\n\
    vec3 vWC = -normalize(positionWC);\n\
\n\
    // Angle between sun and zenith.\n\
    float LdotZenith = clampedDot(lightDirectionWC, vWC);\n\
    float S = acos(LdotZenith);\n\
    // Angle between zenith and current pixel\n\
    float NdotZenith = clampedDot(normalWC, vWC);\n\
    // Angle between sun and current pixel\n\
    float NdotL = clampedDot(normalEC, lightDirectionEC);\n\
    float gamma = acos(NdotL);\n\
\n\
    float numerator = ((0.91 + 10.0 * exp(-3.0 * gamma) + 0.45 * NdotL * NdotL) * (1.0 - exp(-0.32 / NdotZenith)));\n\
    float denominator = (0.91 + 10.0 * exp(-3.0 * S) + 0.45 * LdotZenith * LdotZenith) * (1.0 - exp(-0.32));\n\
    return model_luminanceAtZenith * (numerator / denominator);\n\
}\n\
#endif\n\
\n\
/**\n\
 * Compute the light contribution from a procedural sky model\n\
 *\n\
 * @param {vec3} positionEC The position of the fragment in eye coordinates.\n\
 * @param {vec3} normalEC The surface normal in eye coordinates.\n\
 * @param {vec3} lightDirectionEC Unit vector pointing to the light source in eye coordinates.\n\
 * @param {czm_modelMaterial} The material properties.\n\
 * @return {vec3} The computed HDR color\n\
 */\n\
 vec3 proceduralIBL(\n\
    vec3 positionEC,\n\
    vec3 normalEC,\n\
    vec3 lightDirectionEC,\n\
    czm_modelMaterial material\n\
) {\n\
    vec3 viewDirectionEC = -normalize(positionEC);\n\
    vec3 positionWC = vec3(czm_inverseView * vec4(positionEC, 1.0));\n\
    vec3 reflectionWC = normalize(czm_inverseViewRotation * reflect(viewDirectionEC, normalEC));\n\
    vec3 skyMetrics = getProceduralSkyMetrics(positionWC, reflectionWC);\n\
\n\
    float roughness = material.roughness;\n\
    vec3 f0 = material.specular;\n\
\n\
    vec3 specularIrradiance = getProceduralSpecularIrradiance(reflectionWC, skyMetrics, roughness);\n\
    float NdotV = abs(dot(normalEC, viewDirectionEC)) + 0.001;\n\
    vec2 brdfLut = texture(czm_brdfLut, vec2(NdotV, roughness)).rg;\n\
    vec3 specularColor = czm_srgbToLinear(f0 * brdfLut.x + brdfLut.y);\n\
    vec3 specularContribution = specularIrradiance * specularColor * model_iblFactor.y;\n\
    #ifdef USE_SPECULAR\n\
        specularContribution *= material.specularWeight;\n\
    #endif\n\
\n\
    vec3 diffuseIrradiance = getProceduralDiffuseIrradiance(skyMetrics);\n\
    vec3 diffuseColor = material.diffuse;\n\
    vec3 diffuseContribution = diffuseIrradiance * diffuseColor * model_iblFactor.x;\n\
\n\
    vec3 iblColor = specularContribution + diffuseContribution;\n\
\n\
    #ifdef USE_SUN_LUMINANCE\n\
        iblColor *= getSunLuminance(positionWC, normalEC, lightDirectionEC);\n\
    #endif\n\
\n\
    return iblColor;\n\
}\n\
\n\
#ifdef DIFFUSE_IBL\n\
vec3 computeDiffuseIBL(vec3 cubeDir)\n\
{\n\
    #ifdef CUSTOM_SPHERICAL_HARMONICS\n\
        return czm_sphericalHarmonics(cubeDir, model_sphericalHarmonicCoefficients); \n\
    #else\n\
        return czm_sphericalHarmonics(cubeDir, czm_sphericalHarmonicCoefficients); \n\
    #endif\n\
}\n\
#endif\n\
\n\
#ifdef SPECULAR_IBL\n\
vec3 sampleSpecularEnvironment(vec3 cubeDir, float roughness)\n\
{\n\
    #ifdef CUSTOM_SPECULAR_IBL\n\
        float maxLod = model_specularEnvironmentMapsMaximumLOD;\n\
        float lod = roughness * maxLod;\n\
        return czm_sampleOctahedralProjection(model_specularEnvironmentMaps, model_specularEnvironmentMapsSize, cubeDir, lod, maxLod);\n\
    #else\n\
        float maxLod = czm_specularEnvironmentMapsMaximumLOD;\n\
        float lod = roughness * maxLod;\n\
        return czm_sampleOctahedralProjection(czm_specularEnvironmentMaps, czm_specularEnvironmentMapSize, cubeDir, lod, maxLod);\n\
    #endif\n\
}\n\
vec3 computeSpecularIBL(vec3 cubeDir, float NdotV, vec3 f0, float roughness)\n\
{\n\
    // see https://bruop.github.io/ibl/ at Single Scattering Results\n\
    // Roughness dependent fresnel, from Fdez-Aguera\n\
    vec3 f90 = max(vec3(1.0 - roughness), f0);\n\
    vec3 F = fresnelSchlick2(f0, f90, NdotV);\n\
\n\
    vec2 brdfLut = texture(czm_brdfLut, vec2(NdotV, roughness)).rg;\n\
    vec3 specularSample = sampleSpecularEnvironment(cubeDir, roughness);\n\
\n\
    return specularSample * (F * brdfLut.x + brdfLut.y);\n\
}\n\
#endif\n\
\n\
#if defined(DIFFUSE_IBL) || defined(SPECULAR_IBL)\n\
/**\n\
 * Compute the light contributions from environment maps and spherical harmonic coefficients\n\
 *\n\
 * @param {vec3} viewDirectionEC Unit vector pointing from the fragment to the eye position\n\
 * @param {vec3} normalEC The surface normal in eye coordinates\n\
 * @param {vec3} lightDirectionEC Unit vector pointing to the light source in eye coordinates.\n\
 * @param {czm_modelMaterial} The material properties.\n\
 * @return {vec3} The computed HDR color\n\
 */\n\
vec3 textureIBL(\n\
    vec3 viewDirectionEC,\n\
    vec3 normalEC,\n\
    vec3 lightDirectionEC,\n\
    czm_modelMaterial material\n\
) {\n\
    #ifdef DIFFUSE_IBL\n\
        vec3 normalMC = normalize(model_iblReferenceFrameMatrix * normalEC);\n\
        vec3 diffuseContribution = computeDiffuseIBL(normalMC) * material.diffuse;\n\
    #else\n\
        vec3 diffuseContribution = vec3(0.0); \n\
    #endif\n\
\n\
    #ifdef USE_ANISOTROPY\n\
        // Bend normal to account for anisotropic distortion of specular reflection\n\
        vec3 anisotropyDirection = material.anisotropicB;\n\
        vec3 anisotropicTangent = cross(anisotropyDirection, viewDirectionEC);\n\
        vec3 anisotropicNormal = cross(anisotropicTangent, anisotropyDirection);\n\
        float bendFactor = 1.0 - material.anisotropyStrength * (1.0 - material.roughness);\n\
        float bendFactorPow4 = bendFactor * bendFactor * bendFactor * bendFactor;\n\
        vec3 bentNormal = normalize(mix(anisotropicNormal, normalEC, bendFactorPow4));\n\
        vec3 reflectEC = reflect(-viewDirectionEC, bentNormal);\n\
    #else\n\
        vec3 reflectEC = reflect(-viewDirectionEC, normalEC);\n\
    #endif\n\
\n\
    #ifdef SPECULAR_IBL\n\
        vec3 reflectMC = normalize(model_iblReferenceFrameMatrix * reflectEC);\n\
        float NdotV = clamp(dot(normalEC, viewDirectionEC), 0.0, 1.0);\n\
        vec3 f0 = material.specular;\n\
        vec3 specularContribution = computeSpecularIBL(reflectMC, NdotV, f0, material.roughness);\n\
    #else\n\
        vec3 specularContribution = vec3(0.0); \n\
    #endif\n\
\n\
    #ifdef USE_SPECULAR\n\
        specularContribution *= material.specularWeight;\n\
    #endif\n\
\n\
    return diffuseContribution + specularContribution;\n\
}\n\
#endif\n\
";
