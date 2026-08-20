const APP_VERSION = "0.148";
const FEET_PER_METER = 3.28084;
const SPL_REFERENCE_DISTANCE_FT = 3.28084;
const MIN_LISTENER_DISTANCE_FT = 0.5;
const HIGH_AMBIENT_NOISE_DB = 65;
const NARROW_BEAM_MIN_LISTENER_DIST_FT = 14;
const NARROW_BEAM_ANGLE = 80;
const NARROW_BEAM_MAX_SPEAKER_COUNT = 21;
const SMALL_ROOM_4IN_SQFT = 200;
const PAGING_4IN_SQFT = 350;
const UTILITY_4IN_SQFT = 500;
const BACKGROUND_8IN_SQFT = 1000;
const GENERAL_8IN_SQFT = 1200;
const BACKSTOP_8IN_SQFT = 2500;
const CLOSE_LISTENER_CEILING_FT = 15;
const TAP_SAFETY_MARGIN = 1.25;
const SEATED_EAR_HEIGHT_FT = 4;
const STANDING_EAR_HEIGHT_FT = 5.5;

const HEADROOM_BY_APPLICATION = {
  general: 12,
  paging: 10,
  background: 15,
  foreground: 20,
  utility: 6,
  speech: 12,
};

const SHEET_ID = "1EvpyoSXjFs0ZCxZ_fTZVOYadRyAoiPpu9hEwUiYxhEg";
const SHEET_BASE = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=`;

const FALLBACK_USE_CASES = {
  foreground: { label: "Hlavní hudební ozvučení", targetSPL: 85, snrAboveAmbient: 10, ampHeadroomFactor: 1.15 },
  speech: { label: "Zesílení řeči", targetSPL: 78, snrAboveAmbient: 15, ampHeadroomFactor: 1.25 },
  paging: { label: "Hlášení / oznámení", targetSPL: 80, snrAboveAmbient: 15, ampHeadroomFactor: 1.20 },
  general: { label: "Univerzální ozvučení", targetSPL: 80, snrAboveAmbient: 12, ampHeadroomFactor: 1.20 },
  background: { label: "Hudba na pozadí", targetSPL: 75, snrAboveAmbient: 6, ampHeadroomFactor: 1.10 },
  utility: { label: "Jednoduché užitkové ozvučení", targetSPL: 70, snrAboveAmbient: 5, ampHeadroomFactor: 1.05 },
};

const FALLBACK_COVERAGE_MODES = {
  "center-to-center": { multiplier: 0.5, variation: 1, label: "Střed ke středu" },
  "min-overlap": { multiplier: 0.707, variation: 2, label: "Minimální překrytí" },
  "balanced": { multiplier: 0.85, variation: 3, label: "Vyvážené překrytí" },
  "edge-to-edge": { multiplier: 1, variation: 4, label: "Hrana k hraně" },
  "extended": { multiplier: 1.4, variation: 7, label: "Rozšířené rozestupy" }
};

const FALLBACK_SPEAKERS = [{"active":true,"avCode":"SNC.PS-C41RT.W","manufacturer":"Sonance","model":"PS-C41RT","type":"Ceiling","recommendationClass":"Standard 4″","wooferSize":4.0,"sensitivity":87.0,"coverageAngle":120.0,"maxPower":60.0,"taps":[3.125,6.25,12.5,25.0],"taps100":[6.25,12.5,25.0],"freqLow":95.0,"freqHigh":20000.0,"impedance":"8Ω","productNo":"45165.0","url":"https://sonance.com/products/45165"},{"active":true,"avCode":"SNC.PS-C61RT.W","manufacturer":"Sonance","model":"PS-C61RT","type":"Ceiling","recommendationClass":"Standard 6″","wooferSize":6.0,"sensitivity":91.0,"coverageAngle":120.0,"maxPower":100.0,"taps":[4.0,8.0,16.0,32.0],"taps100":[8.0,16.0,32.0],"freqLow":83.0,"freqHigh":20000.0,"impedance":"8Ω","productNo":"45166.0","url":"https://sonance.com/products/45166"},{"active":true,"avCode":"SNC.PS-C43RT.W","manufacturer":"Sonance","model":"PS-C43RT","type":"Ceiling","recommendationClass":"Standard 4″","wooferSize":4.0,"sensitivity":87.0,"coverageAngle":120.0,"maxPower":60.0,"taps":[3.75,7.5,15.0,30.0],"taps100":[7.5,15.0,30.0],"freqLow":75.0,"freqHigh":20000.0,"impedance":"8Ω","productNo":"45130.0","url":"https://sonance.com/products/45130"},{"active":true,"avCode":"SNC.PS-C43RTLPEA.W","manufacturer":"Sonance","model":"PS-C43RTLP","type":"Ceiling","recommendationClass":"Standard 4″","wooferSize":4.0,"sensitivity":87.0,"coverageAngle":120.0,"maxPower":60.0,"taps":[3.75,7.5,15.0,30.0],"taps100":[7.5,15.0,30.0],"freqLow":75.0,"freqHigh":20000.0,"impedance":"8Ω","productNo":"45181.0","url":"https://sonance.com/products/45181"},{"active":true,"avCode":"SNC.PS-C63RT.W","manufacturer":"Sonance","model":"PS-C63RT","type":"Ceiling","recommendationClass":"Standard 6″","wooferSize":6.0,"sensitivity":91.0,"coverageAngle":120.0,"maxPower":120.0,"taps":[7.5,15.0,30.0,60.0],"taps100":[15.0,30.0,60.0],"freqLow":65.0,"freqHigh":20000.0,"impedance":"8Ω","productNo":"45131.0","url":"https://sonance.com/products/45131"},{"active":true,"avCode":"SNC.PS-C63RTLPEA.W","manufacturer":"Sonance","model":"PS-C63RTLP","type":"Ceiling","recommendationClass":"Standard 6″","wooferSize":6.0,"sensitivity":91.0,"coverageAngle":120.0,"maxPower":120.0,"taps":[7.5,15.0,30.0,60.0],"taps100":[15.0,30.0,60.0],"freqLow":65.0,"freqHigh":20000.0,"impedance":"8Ω","productNo":"45182.0","url":"https://sonance.com/products/45182"},{"active":true,"avCode":"SNC.PS-C83RT.W","manufacturer":"Sonance","model":"PS-C83RT","type":"Ceiling","recommendationClass":"Standard 8″","wooferSize":8.0,"sensitivity":91.0,"coverageAngle":120.0,"maxPower":160.0,"taps":[7.5,15.0,30.0,60.0],"taps100":[15.0,30.0,60.0],"freqLow":55.0,"freqHigh":20000.0,"impedance":"8Ω","productNo":"45132.0","url":"https://sonance.com/products/45132"},{"active":true,"avCode":"SNC.PS-C83RWT.W","manufacturer":"Sonance","model":"PS-C83RWT","type":"Woofer","recommendationClass":"Woofer","wooferSize":8.0,"sensitivity":89.0,"coverageAngle":180.0,"maxPower":200.0,"taps":[15.0,30.0,60.0,120.0],"taps100":[30.0,60.0,120.0],"freqLow":50.0,"freqHigh":150.0,"impedance":"8Ω","productNo":"40133.0","url":"https://sonance.com/products/40133"},{"active":true,"avCode":"","manufacturer":"Sonance","model":"PS-C85RT (Horn)","type":"Ceiling","recommendationClass":"High-output 8″ horn","wooferSize":8.0,"sensitivity":93.0,"coverageAngle":80.0,"maxPower":300.0,"taps":[15.0,30.0,60.0,120.0],"taps100":[30.0,60.0,120.0],"freqLow":53.0,"freqHigh":25000.0,"impedance":"8Ω","productNo":"","url":"https://sonance.com/products/40229"},{"active":true,"avCode":"","manufacturer":"Sonance","model":"PS-C85RT (Collar)","type":"Ceiling","recommendationClass":"High-output 8″ wide","wooferSize":8.0,"sensitivity":93.0,"coverageAngle":120.0,"maxPower":300.0,"taps":[15.0,30.0,60.0,120.0],"taps100":[30.0,60.0,120.0],"freqLow":53.0,"freqHigh":25000.0,"impedance":"8Ω","productNo":"","url":"https://sonance.com/products/40229"},{"active":true,"avCode":"","manufacturer":"Sonance","model":"PS-C85RTBF (Horn)","type":"Ceiling","recommendationClass":"High-output 8″ horn","wooferSize":8.0,"sensitivity":91.0,"coverageAngle":80.0,"maxPower":300.0,"taps":[15.0,30.0,60.0,120.0],"taps100":[30.0,60.0,120.0],"freqLow":41.0,"freqHigh":20000.0,"impedance":"8Ω","productNo":"","url":"https://sonance.com/products/40231"},{"active":true,"avCode":"","manufacturer":"Sonance","model":"PS-C85RTBF (Collar)","type":"Ceiling","recommendationClass":"High-output 8″ wide","wooferSize":8.0,"sensitivity":91.0,"coverageAngle":120.0,"maxPower":300.0,"taps":[15.0,30.0,60.0,120.0],"taps100":[30.0,60.0,120.0],"freqLow":41.0,"freqHigh":20000.0,"impedance":"8Ω","productNo":"","url":"https://sonance.com/products/40231"},{"active":true,"avCode":"","manufacturer":"Sonance","model":"PSXT-C63RT","type":"Ceiling","recommendationClass":"Weather 6″","wooferSize":6.0,"sensitivity":88.0,"coverageAngle":134.0,"maxPower":120.0,"taps":[7.5,15.0,30.0,60.0],"taps100":[15.0,30.0,60.0],"freqLow":72.0,"freqHigh":20000.0,"impedance":"8Ω","productNo":"","url":""},{"active":true,"avCode":"","manufacturer":"Sonance","model":"PSXT-C83RT","type":"Ceiling","recommendationClass":"Weather 8″","wooferSize":8.0,"sensitivity":90.0,"coverageAngle":125.0,"maxPower":160.0,"taps":[10.0,20.0,40.0,80.0],"taps100":[20.0,40.0,80.0],"freqLow":59.0,"freqHigh":20000.0,"impedance":"8Ω","productNo":"","url":""},{"active":true,"avCode":"SNC.PS-P43T.W","manufacturer":"Sonance","model":"PS-P43T","type":"Pendant","recommendationClass":"Standard 4″","wooferSize":4.0,"sensitivity":87.0,"coverageAngle":120.0,"maxPower":60.0,"taps":[3.75,7.5,15.0,30.0],"taps100":[7.5,15.0,30.0],"freqLow":75.0,"freqHigh":20000.0,"impedance":"8Ω","productNo":"45134.0","url":"https://sonance.com/products/45138"},{"active":true,"avCode":"SNC.PS-P63T.W","manufacturer":"Sonance","model":"PS-P63T","type":"Pendant","recommendationClass":"Standard 6″","wooferSize":6.0,"sensitivity":88.0,"coverageAngle":120.0,"maxPower":120.0,"taps":[7.5,15.0,30.0,60.0],"taps100":[15.0,30.0,60.0],"freqLow":65.0,"freqHigh":20000.0,"impedance":"8Ω","productNo":"45135.0","url":"https://sonance.com/products/45139"},{"active":true,"avCode":"SNC.PS-P83T.W","manufacturer":"Sonance","model":"PS-P83T","type":"Pendant","recommendationClass":"Standard 8″","wooferSize":8.0,"sensitivity":90.0,"coverageAngle":120.0,"maxPower":160.0,"taps":[7.5,15.0,30.0,60.0],"taps100":[15.0,30.0,60.0],"freqLow":55.0,"freqHigh":20000.0,"impedance":"8Ω","productNo":"45136.0","url":"https://sonance.com/products/45140"},{"active":true,"avCode":"SNC.PS-P83WT.W","manufacturer":"Sonance","model":"PS-P83WT","type":"Woofer","recommendationClass":"Woofer","wooferSize":8.0,"sensitivity":89.0,"coverageAngle":180.0,"maxPower":300.0,"taps":[15.0,30.0,60.0,120.0],"taps100":[30.0,60.0,120.0],"freqLow":50.0,"freqHigh":150.0,"impedance":"8Ω","productNo":"40137.0","url":"https://sonance.com/products/40141"},{"active":true,"avCode":"","manufacturer":"Sonance","model":"PS-P85T (Horn)","type":"Pendant","recommendationClass":"High-output 8″ horn","wooferSize":8.0,"sensitivity":88.0,"coverageAngle":80.0,"maxPower":300.0,"taps":[15.0,30.0,60.0,120.0],"taps100":[30.0,60.0,120.0],"freqLow":41.0,"freqHigh":20000.0,"impedance":"8Ω","productNo":"","url":"https://sonance.com/products/40234"},{"active":true,"avCode":"","manufacturer":"Sonance","model":"PS-P85T (Collar)","type":"Pendant","recommendationClass":"High-output 8″ wide","wooferSize":8.0,"sensitivity":88.0,"coverageAngle":120.0,"maxPower":300.0,"taps":[15.0,30.0,60.0,120.0],"taps100":[30.0,60.0,120.0],"freqLow":41.0,"freqHigh":20000.0,"impedance":"8Ω","productNo":"","url":"https://sonance.com/products/40234"},{"active":true,"avCode":"SNC.PS-S210SUBT","manufacturer":"Sonance","model":"PS-S210SUBT","type":"Woofer","recommendationClass":"Subwoofer","wooferSize":10.0,"sensitivity":94.0,"coverageAngle":180.0,"maxPower":500.0,"taps":[75.0,150.0,300.0],"taps100":[150.0,300.0],"freqLow":44.0,"freqHigh":132.0,"impedance":"8Ω","productNo":"40192.0","url":"https://sonance.com/products/40192"}];
const FALLBACK_AMPLIFIERS = [{"active":true,"avCode":"SNC.BLAZEPZ252","manufacturer":"Blaze","model":"PowerZone 252","series":"PowerZone","channels":2,"effectiveZones":2,"totalPower":250.0,"powerPerZone":125.0,"supports70V":true,"supports100V":true,"hasDSP":false,"bridgedMode":false,"channelsPerZone":1,"lowZ8":125.0,"lowZ4":125.0,"hasDante":false,"networking":"","recommendedFor":"Two small zones | Basic installations","productNo":"UBX-888-001","url":"https://www.sonance.com/commercial/amplifiers/powerzone/powerzone-252"},{"active":true,"avCode":"SNC.BLAZEPZ504","manufacturer":"Blaze","model":"PowerZone 504","series":"PowerZone","channels":4,"effectiveZones":4,"totalPower":500.0,"powerPerZone":125.0,"supports70V":true,"supports100V":true,"hasDSP":false,"bridgedMode":false,"channelsPerZone":1,"lowZ8":125.0,"lowZ4":125.0,"hasDante":false,"networking":"","recommendedFor":"Up to 4 zones | Medium spaces | Cost-effective installations","productNo":"UBX-888-002","url":"https://www.sonance.com/commercial/amplifiers/powerzone/powerzone-504"},{"active":true,"avCode":"SNC.BLAZEPZ1004","manufacturer":"Blaze","model":"PowerZone 1004","series":"PowerZone","channels":4,"effectiveZones":4,"totalPower":1000.0,"powerPerZone":250.0,"supports70V":true,"supports100V":true,"hasDSP":false,"bridgedMode":false,"channelsPerZone":1,"lowZ8":250.0,"lowZ4":250.0,"hasDante":false,"networking":"","recommendedFor":"Up to 4 high-power zones | High SPL | Larger spaces","productNo":"UBX-888-003","url":""},{"active":true,"avCode":"SNC.BLAZEPZC122","manufacturer":"Blaze","model":"PowerZone Connect 122","series":"PowerZone Connect","channels":2,"effectiveZones":1,"totalPower":125.0,"powerPerZone":125.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":true,"channelsPerZone":2,"lowZ8":60.0,"lowZ4":60.0,"hasDante":false,"networking":"","recommendedFor":"Small single zone | DSP required | Network control","productNo":"UBX-888-004","url":"https://www.sonance.com/commercial/amplifiers/powerzone-connect/powerzone-connect-122"},{"active":true,"avCode":"SNC.BLAZEPZC252","manufacturer":"Blaze","model":"PowerZone Connect 252","series":"PowerZone Connect","channels":2,"effectiveZones":1,"totalPower":250.0,"powerPerZone":250.0,"supports70V":true,"supports100V":true,"hasDSP":false,"bridgedMode":true,"channelsPerZone":2,"lowZ8":125.0,"lowZ4":125.0,"hasDante":false,"networking":"","recommendedFor":"Single zone | Medium power | Basic DSP","productNo":"UBX-888-006","url":"https://www.sonance.com/commercial/amplifiers/powerzone-connect/powerzone-connect-252"},{"active":true,"avCode":"SNC.BLAZEPZC254","manufacturer":"Blaze","model":"PowerZone Connect 254","series":"PowerZone Connect","channels":4,"effectiveZones":2,"totalPower":250.0,"powerPerZone":125.0,"supports70V":true,"supports100V":true,"hasDSP":false,"bridgedMode":true,"channelsPerZone":2,"lowZ8":60.0,"lowZ4":60.0,"hasDante":false,"networking":"","recommendedFor":"Dual zone | Medium spaces | Power sharing","productNo":"UBX-888-005","url":""},{"active":true,"avCode":"SNC.BLAZEPZC504","manufacturer":"Blaze","model":"PowerZone Connect 504","series":"PowerZone Connect","channels":4,"effectiveZones":2,"totalPower":500.0,"powerPerZone":250.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":true,"channelsPerZone":2,"lowZ8":125.0,"lowZ4":125.0,"hasDante":false,"networking":"","recommendedFor":"Dual zone with DSP | Network control | Advanced tuning","productNo":"UBX-888-007","url":"https://www.sonance.com/commercial/amplifiers/powerzone-connect/powerzone-connect-504"},{"active":true,"avCode":"SNC.BLAZEPZC508","manufacturer":"Blaze","model":"PowerZone Connect 508","series":"PowerZone Connect","channels":8,"effectiveZones":4,"totalPower":500.0,"powerPerZone":125.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":true,"channelsPerZone":2,"lowZ8":60.0,"lowZ4":60.0,"hasDante":false,"networking":"","recommendedFor":"Multi-zone with DSP | Up to 4 zones | Network control","productNo":"UBX-888-024","url":"https://www.sonance.com/commercial/amplifiers/powerzone-connect/powerzone-connect-508"},{"active":true,"avCode":"SNC.BLAZEPZC1008","manufacturer":"Blaze","model":"PowerZone Connect 1008","series":"PowerZone Connect","channels":8,"effectiveZones":4,"totalPower":1000.0,"powerPerZone":250.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":true,"channelsPerZone":2,"lowZ8":125.0,"lowZ4":125.0,"hasDante":false,"networking":"","recommendedFor":"High power 4 zones | Large spaces | Foreground music","productNo":"UBX-888-025","url":""},{"active":true,"avCode":"SNC.BLAZEPZC2004","manufacturer":"Blaze","model":"PowerZone Connect 2004","series":"PowerZone Connect","channels":4,"effectiveZones":2,"totalPower":2000.0,"powerPerZone":1000.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":true,"channelsPerZone":2,"lowZ8":500.0,"lowZ4":500.0,"hasDante":false,"networking":"","recommendedFor":"High power 2 zones | Large spaces | Foreground music","productNo":"LBX-888-003","url":"https://www.sonance.com/commercial/amplifiers/powerzone-connect/powerzone-connect-2004"},{"active":true,"avCode":"SNC.BLAZEPZC3004","manufacturer":"Blaze","model":"PowerZone Connect 3004","series":"PowerZone Connect","channels":4,"effectiveZones":2,"totalPower":3000.0,"powerPerZone":1500.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":true,"channelsPerZone":2,"lowZ8":750.0,"lowZ4":750.0,"hasDante":false,"networking":"","recommendedFor":"Very high power 2 zones | Premium installations | Foreground music","productNo":"LBX-888-004","url":""},{"active":true,"avCode":"SNC.BLAZEPZC4008","manufacturer":"Blaze","model":"PowerZone Connect 4008","series":"PowerZone Connect","channels":8,"effectiveZones":4,"totalPower":4000.0,"powerPerZone":1000.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":true,"channelsPerZone":2,"lowZ8":500.0,"lowZ4":500.0,"hasDante":false,"networking":"","recommendedFor":"Multi-zone high power | Up to 4 zones | Large installations","productNo":"LBX-888-010","url":""},{"active":true,"avCode":"SNC.BLAZEPZC6008","manufacturer":"Blaze","model":"PowerZone Connect 6008","series":"PowerZone Connect","channels":8,"effectiveZones":4,"totalPower":6000.0,"powerPerZone":1500.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":true,"channelsPerZone":2,"lowZ8":750.0,"lowZ4":750.0,"hasDante":false,"networking":"","recommendedFor":"Largest multi-zone | Maximum power | Entertainment venues","productNo":"LBX-888-009","url":""},{"active":true,"avCode":"SNC.BLAZEPZC504D","manufacturer":"Blaze","model":"PowerZone Connect 504 Dante","series":"PowerZone Connect","channels":4,"effectiveZones":2,"totalPower":500.0,"powerPerZone":250.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":true,"channelsPerZone":2,"lowZ8":125.0,"lowZ4":125.0,"hasDante":true,"networking":"Dante, AES67","recommendedFor":"Dual zone with DSP | Network audio | Dante infrastructure","productNo":"UBX-888-029","url":"https://www.sonance.com/commercial/amplifiers/powerzone-connect/powerzone-connect-504"},{"active":true,"avCode":"SNC.BLAZEPZC1008D","manufacturer":"Blaze","model":"PowerZone Connect 1008 Dante","series":"PowerZone Connect","channels":8,"effectiveZones":4,"totalPower":1000.0,"powerPerZone":250.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":true,"channelsPerZone":2,"lowZ8":125.0,"lowZ4":125.0,"hasDante":true,"networking":"Dante, AES67","recommendedFor":"Multi-zone Dante | Network audio | Large installations","productNo":"UBX-888-031","url":""},{"active":true,"avCode":"","manufacturer":"Blaze","model":"PowerZone Connect 4008 Dante","series":"PowerZone Connect","channels":8,"effectiveZones":4,"totalPower":4000.0,"powerPerZone":1000.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":true,"channelsPerZone":2,"lowZ8":500.0,"lowZ4":500.0,"hasDante":true,"networking":"Dante, AES67","recommendedFor":"Multi-zone high power Dante | Network audio | Large installations","productNo":"","url":""},{"active":true,"avCode":"SNC.BLAZEPZC6008D","manufacturer":"Blaze","model":"PowerZone Connect 6008 Dante","series":"PowerZone Connect","channels":8,"effectiveZones":4,"totalPower":6000.0,"powerPerZone":1500.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":true,"channelsPerZone":2,"lowZ8":750.0,"lowZ4":750.0,"hasDante":true,"networking":"Dante, AES67","recommendedFor":"Largest multi-zone Dante | Maximum power | Premium Dante installations","productNo":"LBX-888-011","url":""},{"active":true,"avCode":"","manufacturer":"Blaze","model":"PowerZone Connect PRO 300.2","series":"PowerZone Connect PRO","channels":2,"effectiveZones":2,"totalPower":300.0,"powerPerZone":150.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":false,"channelsPerZone":1,"lowZ8":150.0,"lowZ4":150.0,"hasDante":false,"networking":"","recommendedFor":"2-zone Hi-Z | Background/foreground music | DSP zone control","productNo":"","url":""},{"active":true,"avCode":"","manufacturer":"Blaze","model":"PowerZone Connect PRO 600.2","series":"PowerZone Connect PRO","channels":2,"effectiveZones":2,"totalPower":600.0,"powerPerZone":300.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":false,"channelsPerZone":1,"lowZ8":300.0,"lowZ4":300.0,"hasDante":false,"networking":"","recommendedFor":"2-zone Hi-Z high power | Foreground music | DSP zone control","productNo":"","url":""},{"active":true,"avCode":"","manufacturer":"Blaze","model":"PowerZone Connect PRO 600.4","series":"PowerZone Connect PRO","channels":4,"effectiveZones":4,"totalPower":600.0,"powerPerZone":150.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":false,"channelsPerZone":1,"lowZ8":150.0,"lowZ4":150.0,"hasDante":false,"networking":"","recommendedFor":"4-zone Hi-Z | Multi-zone background/foreground music | DSP zone control","productNo":"","url":""},{"active":true,"avCode":"","manufacturer":"Blaze","model":"PowerZone Connect PRO 1200.4","series":"PowerZone Connect PRO","channels":4,"effectiveZones":4,"totalPower":1200.0,"powerPerZone":300.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":false,"channelsPerZone":1,"lowZ8":300.0,"lowZ4":300.0,"hasDante":false,"networking":"","recommendedFor":"4-zone Hi-Z high power | Multi-zone foreground music | DSP zone control","productNo":"","url":""},{"active":true,"avCode":"","manufacturer":"Blaze","model":"PowerZone Connect PRO 2000.2","series":"PowerZone Connect PRO","channels":2,"effectiveZones":2,"totalPower":2000.0,"powerPerZone":1000.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":false,"channelsPerZone":1,"lowZ8":1000.0,"lowZ4":1000.0,"hasDante":false,"networking":"","recommendedFor":"2-zone Hi-Z very high power | Large venue foreground music | DSP zone control","productNo":"","url":""},{"active":true,"avCode":"","manufacturer":"Blaze","model":"PowerZone Connect PRO 4000.4","series":"PowerZone Connect PRO","channels":4,"effectiveZones":4,"totalPower":4000.0,"powerPerZone":1000.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":false,"channelsPerZone":1,"lowZ8":1000.0,"lowZ4":1000.0,"hasDante":false,"networking":"","recommendedFor":"4-zone Hi-Z very high power | Large venue multi-zone | DSP zone control","productNo":"","url":""},{"active":true,"avCode":"","manufacturer":"Blaze","model":"PowerZone Connect PRO 300.2D","series":"PowerZone Connect PRO","channels":2,"effectiveZones":2,"totalPower":300.0,"powerPerZone":150.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":false,"channelsPerZone":1,"lowZ8":150.0,"lowZ4":150.0,"hasDante":true,"networking":"Dante, AES67","recommendedFor":"2-zone Hi-Z Dante | Network audio | DSP zone control","productNo":"","url":""},{"active":true,"avCode":"","manufacturer":"Blaze","model":"PowerZone Connect PRO 600.2D","series":"PowerZone Connect PRO","channels":2,"effectiveZones":2,"totalPower":600.0,"powerPerZone":300.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":false,"channelsPerZone":1,"lowZ8":300.0,"lowZ4":300.0,"hasDante":true,"networking":"Dante, AES67","recommendedFor":"2-zone Hi-Z high power Dante | Network audio | DSP zone control","productNo":"","url":""},{"active":true,"avCode":"","manufacturer":"Blaze","model":"PowerZone Connect PRO 600.4D","series":"PowerZone Connect PRO","channels":4,"effectiveZones":4,"totalPower":600.0,"powerPerZone":150.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":false,"channelsPerZone":1,"lowZ8":150.0,"lowZ4":150.0,"hasDante":true,"networking":"Dante, AES67","recommendedFor":"4-zone Hi-Z Dante | Network audio | DSP zone control","productNo":"","url":""},{"active":true,"avCode":"","manufacturer":"Blaze","model":"PowerZone Connect PRO 1200.4D","series":"PowerZone Connect PRO","channels":4,"effectiveZones":4,"totalPower":1200.0,"powerPerZone":300.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":false,"channelsPerZone":1,"lowZ8":300.0,"lowZ4":300.0,"hasDante":true,"networking":"Dante, AES67","recommendedFor":"4-zone Hi-Z high power Dante | Network audio | DSP zone control","productNo":"","url":""},{"active":true,"avCode":"","manufacturer":"Blaze","model":"PowerZone Connect PRO 2000.2D","series":"PowerZone Connect PRO","channels":2,"effectiveZones":2,"totalPower":2000.0,"powerPerZone":1000.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":false,"channelsPerZone":1,"lowZ8":1000.0,"lowZ4":1000.0,"hasDante":true,"networking":"Dante, AES67","recommendedFor":"2-zone Hi-Z very high power Dante | Network audio | Large venues","productNo":"","url":""},{"active":true,"avCode":"","manufacturer":"Blaze","model":"PowerZone Connect PRO 4000.4D","series":"PowerZone Connect PRO","channels":4,"effectiveZones":4,"totalPower":4000.0,"powerPerZone":1000.0,"supports70V":true,"supports100V":true,"hasDSP":true,"bridgedMode":false,"channelsPerZone":1,"lowZ8":1000.0,"lowZ4":1000.0,"hasDante":true,"networking":"Dante, AES67","recommendedFor":"4-zone Hi-Z very high power Dante | Network audio | Large venues","productNo":"","url":""}];

let USE_CASES = structuredClone(FALLBACK_USE_CASES);
let COVERAGE_MODES = structuredClone(FALLBACK_COVERAGE_MODES);
let SPEAKERS = FALLBACK_SPEAKERS.filter(s => s.active);
let AMPLIFIERS = FALLBACK_AMPLIFIERS.filter(a => a.active);

let AMP_RULES = {
  AMP_HEADROOM_WITHOUT_SUBS: 1.2,
  AMP_HEADROOM_WITH_SUBS: 1.25,
  MAX_SPLIT_PER_ZONE: 5,
  MAX_AMPS_ABSOLUTE: 8,
  MAX_AMPS_VS_RECOMMENDED_RATIO: 2,
  OVER_PROVISIONED_PCT: 15,
  PRO_PREFER_ZONE_THRESHOLD: 1
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        quoted = true;
      } else if (ch === ",") {
        row.push(field);
        field = "";
      } else if (ch === "\n") {
        row.push(field.replace(/\r$/, ""));
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += ch;
      }
    }
  }

  row.push(field.replace(/\r$/, ""));
  if (row.some(v => v !== "")) rows.push(row);
  return rows;
}

function boolValue(v) {
  return ["true","pravda","ano","1","yes"].includes(String(v ?? "").trim().toLowerCase());
}

function numValue(v, fallback = 0) {
  if (typeof v === "number") return v;
  const n = Number(String(v ?? "").trim().replace(",", "."));
  return Number.isFinite(n) ? n : fallback;
}

function parseTapList(v) {
  return String(v ?? "").split(";").map(x => numValue(x.trim(), NaN)).filter(Number.isFinite);
}

function rowsToObjects(rows) {
  if (!rows.length) return [];
  let headers = rows[0].map(x => String(x ?? "").trim());
  if (headers[0] === "") {
    headers = headers.slice(1);
    rows = rows.map(r => r.slice(1));
  }
  return rows.slice(1)
    .filter(r => r.some(v => String(v ?? "").trim() !== ""))
    .map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""])));
}

function normalizeSpeakerType(v) {
  const s = String(v ?? "").trim().toLowerCase();
  if (s.startsWith("strop")) return "Ceiling";
  if (s.startsWith("záv") || s.startsWith("zav")) return "Pendant";
  return "Woofer";
}

async function fetchSheet(sheetName) {
  const url = SHEET_BASE + encodeURIComponent(sheetName) + `&_=${Date.now()}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`${sheetName}: HTTP ${response.status}`);
  return parseCsv(await response.text());
}

function applySpeakerSheet(rows) {
  const objects = rowsToObjects(rows);
  const mapped = objects.map(r => ({
    active: boolValue(r["Aktivní"]),
    avCode: r["Kód AV Integra"] || "",
    manufacturer: r["Výrobce"] || "",
    model: r["Model"] || "",
    type: normalizeSpeakerType(r["Typ instalace"]),
    recommendationClass: r["Třída doporučení"] || "",
    wooferSize: numValue(r["Měnič [palce]"]),
    sensitivity: numValue(r["Citlivost [dB]"]),
    coverageAngle: numValue(r["Vyzařovací úhel [°]"], 120),
    maxPower: numValue(r["Max. výkon [W]"]),
    taps: parseTapList(r["Tapy 70 V [W]"]),
    taps100: parseTapList(r["Tapy 100 V [W]"]),
    freqLow: numValue(r["Frekvence od [Hz]"]),
    freqHigh: numValue(r["Frekvence do [Hz]"]),
    impedance: r["Impedance"] || "",
    productNo: r["PRODUCTNO"] || "",
    url: r["URL produktu"] || "",
    image: r["Obrázky"] || r["Obrazky"] || r["Obrázek"] || r["Obrazek"] || ""
  })).filter(s => s.active && s.model && s.sensitivity && s.coverageAngle);
  if (mapped.length >= 5) SPEAKERS = mapped;
}

function applyAmplifierSheet(rows) {
  const objects = rowsToObjects(rows);
  const mapped = objects.map(r => ({
    active: boolValue(r["Aktivní"]),
    avCode: r["Kód AV Integra"] || "",
    manufacturer: r["Výrobce"] || "",
    model: r["Model"] || "",
    series: r["Řada"] || "",
    channels: numValue(r["Počet kanálů"]),
    effectiveZones: numValue(r["Efektivní počet zón"]),
    totalPower: numValue(r["Celkový výkon [W]"]),
    powerPerZone: numValue(r["Výkon na zónu [W]"]),
    supports70V: boolValue(r["70 V"]),
    supports100V: boolValue(r["100 V"]),
    hasDSP: boolValue(r["DSP"]),
    bridgedMode: boolValue(r["Bridge / BTL"]),
    channelsPerZone: numValue(r["Kanálů na zónu"], 1),
    lowZ8: numValue(r["Low-Z 8 Ω [W]"]),
    lowZ4: numValue(r["Low-Z 4 Ω [W]"]),
    hasDante: boolValue(r["Dante"]),
    networking: r["Síťové audio"] || "",
    recommendedFor: r["Doporučené použití"] || "",
    productNo: r["PRODUCTNO"] || "",
    url: r["URL produktu"] || "",
    image: r["Obrázek"] || r["Obrazek"] || r["Obrázky"] || r["Obrazky"] || ""
  })).filter(a => a.active && a.model && a.powerPerZone > 0 && a.effectiveZones > 0);
  if (mapped.length >= 5) AMPLIFIERS = mapped;
}

function applySettingsSheet(rows) {
  const useHeader = rows.findIndex(r => r.includes("Cílové SPL [dB]") && r.includes("Použití"));
  if (useHeader >= 0) {
    for (let i = useHeader + 1; i < rows.length; i++) {
      const r = rows[i];
      const key = String(r[0] ?? "").trim();
      if (!key || key === "Režimy pokrytí") break;
      if (!["background","foreground","general","speech","paging","utility"].includes(key)) continue;
      USE_CASES[key] = {
        label: String(r[1] || FALLBACK_USE_CASES[key]?.label || key),
        targetSPL: numValue(r[2], FALLBACK_USE_CASES[key]?.targetSPL || 75),
        defaultAmbient: numValue(r[3], 55),
        snrAboveAmbient: numValue(r[4], FALLBACK_USE_CASES[key]?.snrAboveAmbient || 6),
        acousticHeadroom: numValue(r[5], HEADROOM_BY_APPLICATION[key] || 10),
        crestFactor: numValue(r[6], 0),
        ampHeadroomFactor: numValue(r[7], FALLBACK_USE_CASES[key]?.ampHeadroomFactor || 1.2)
      };
      HEADROOM_BY_APPLICATION[key] = USE_CASES[key].acousticHeadroom;
    }
  }

  const covHeader = rows.findIndex(r => r.includes("Násobek rozteče") && r.some(v => String(v).includes("Odchylka SPL")));
  if (covHeader >= 0) {
    const next = {};
    for (let i = covHeader + 1; i < rows.length; i++) {
      const r = rows[i];
      const key = String(r[0] ?? "").trim();
      if (!key || key.includes("Pravidla výběru")) break;
      const mult = numValue(r[2], NaN);
      const variation = numValue(r[3], NaN);
      if (key && Number.isFinite(mult) && Number.isFinite(variation)) {
        next[key] = { multiplier: mult, variation, label: String(r[1] || key) };
      }
    }
    if (Object.keys(next).length >= 5) COVERAGE_MODES = next;
  }

  const ampHeader = rows.findIndex(r => r.includes("Použití ve výpočtu") && r.includes("Zdroj"));
  if (ampHeader >= 0) {
    for (let i = ampHeader + 1; i < rows.length; i++) {
      const key = String(rows[i][0] ?? "").trim();
      if (!key || key.includes("Prahové hodnoty")) break;
      if (Object.prototype.hasOwnProperty.call(AMP_RULES, key)) {
        AMP_RULES[key] = numValue(rows[i][1], AMP_RULES[key]);
      }
    }
  }
}

function setDataSourceStatus(mode, message = "") {
  const el = document.getElementById("dataSourceStatus");
  if (!el) return;
  el.className = "data-source-status " + (mode === "live" ? "data-live" : "data-fallback");
  el.textContent = mode === "live" ? "Databáze produktů" : "Databáze produktů – lokální záloha";
  el.title = message;
}

async function loadLiveData() {
  const results = await Promise.allSettled([
    fetchSheet("Reproduktory"),
    fetchSheet("Zesilovace"),
    fetchSheet("Nastavení")
  ]);

  const errors = [];
  if (results[0].status === "fulfilled") applySpeakerSheet(results[0].value); else errors.push("Reproduktory");
  if (results[1].status === "fulfilled") applyAmplifierSheet(results[1].value); else errors.push("Zesilovace");
  if (results[2].status === "fulfilled") applySettingsSheet(results[2].value); else errors.push("Nastavení");

  if (errors.length === 0) {
    setDataSourceStatus("live", `Načteno ${SPEAKERS.length} reproduktorů a ${AMPLIFIERS.length} zesilovačů.`);
    return true;
  }
  setDataSourceStatus("fallback", `Nepodařilo se načíst: ${errors.join(", ")}.`);
  return false;
}

function toFeet(m) {
  return m * FEET_PER_METER;
}

function getSpeaker(model) {
  return SPEAKERS.find(s => s.model === model);
}

function getSpeakerOrClosest(preferredModel, speakerType, wooferSize = null, coverageAngle = null) {
  const exact = getSpeaker(preferredModel);
  if (exact) return exact.model;
  const expectedType = speakerType === "ceiling" ? "Ceiling" : "Pendant";
  const candidates = SPEAKERS.filter(s => s.type === expectedType);
  if (!candidates.length) return SPEAKERS[0]?.model || preferredModel;
  return candidates.map(s => {
    let score = 0;
    if (wooferSize !== null) score += Math.abs(s.wooferSize - wooferSize) * 5;
    if (coverageAngle !== null) score += Math.abs(s.coverageAngle - coverageAngle) / 10;
    if (/Horn/i.test(preferredModel) && !/horn/i.test(s.recommendationClass || s.model)) score += 8;
    if (/Collar/i.test(preferredModel) && s.coverageAngle < 100) score += 5;
    return {s, score};
  }).sort((a,b) => a.score - b.score || a.s.model.localeCompare(b.s.model, "cs"))[0].s.model;
}

function getTargetSPL(ambient, useCase) {
  const uc = USE_CASES[useCase];
  return Math.max(uc.targetSPL, ambient + uc.snrAboveAmbient);
}

function isCloseListenerCapActive({application, effectiveHeightFt, ambientNoise, areaSqFt}) {
  return ["background","general","speech","utility"].includes(application)
    && effectiveHeightFt > 0
    && effectiveHeightFt <= CLOSE_LISTENER_CEILING_FT
    && ambientNoise < HIGH_AMBIENT_NOISE_DB
    && areaSqFt > 0;
}

function getDefaultSpeakerLegacy({speakerType, useCase, effectiveHeightFt, lengthFt, widthFt, ambientNoise, roomHeightFt}) {
  const ceiling = speakerType === "ceiling";
  const area = lengthFt * widthFt;

  if (effectiveHeightFt >= NARROW_BEAM_MIN_LISTENER_DIST_FT) {
    const beamDiameter = 2 * effectiveHeightFt * Math.tan((NARROW_BEAM_ANGLE * Math.PI / 180) / 2);
    const count = Math.ceil(lengthFt / beamDiameter) * Math.ceil(widthFt / beamDiameter);

    if (count <= NARROW_BEAM_MAX_SPEAKER_COUNT) {
      return ceiling ? "PS-C85RT (Horn)" : "PS-P85T (Horn)";
    }

    if (useCase === "foreground") {
      return ceiling ? "PS-C85RT (Collar)" : "PS-P85T (Collar)";
    }

    return ceiling ? "PS-C83RT" : "PS-P83T";
  }

  if (useCase === "foreground") {
    return effectiveHeightFt >= 10
      ? (ceiling ? "PS-C85RT (Collar)" : "PS-P85T (Collar)")
      : (ceiling ? "PS-C83RT" : "PS-P83T");
  }

  if (area <= SMALL_ROOM_4IN_SQFT) {
    if (ceiling && ["background","general","speech"].includes(useCase)) return "PS-C43RT";
    return ceiling ? "PS-C41RT" : "PS-P43T";
  }

  if (["paging","speech"].includes(useCase) && area <= PAGING_4IN_SQFT) {
    return ceiling ? "PS-C43RT" : "PS-P43T";
  }

  if (useCase === "utility" && area <= UTILITY_4IN_SQFT) {
    return ceiling ? "PS-C41RT" : "PS-P43T";
  }

  const closeCap = isCloseListenerCapActive({
    application: useCase,
    effectiveHeightFt: roomHeightFt,
    ambientNoise,
    areaSqFt: area
  });

  if (["background","general","speech"].includes(useCase)
      && !closeCap
      && (
        ambientNoise >= HIGH_AMBIENT_NOISE_DB
        || (useCase === "background" && area >= BACKGROUND_8IN_SQFT)
        || (["general","speech"].includes(useCase) && area >= GENERAL_8IN_SQFT)
        || area >= BACKSTOP_8IN_SQFT
      )) {
    return ceiling ? "PS-C83RT" : "PS-P83T";
  }

  if (["utility","paging"].includes(useCase)) {
    return ceiling ? "PS-C61RT" : "PS-P63T";
  }

  return ceiling ? "PS-C63RT" : "PS-P63T";
}

function getDefaultSpeaker(args) {
  const preferred = getDefaultSpeakerLegacy(args);
  const match = preferred.match(/(?:C|P)(\d)/);
  const wooferSize = match ? Number(match[1]) : null;
  const angle = /Horn/i.test(preferred) ? 80 : 120;
  return getSpeakerOrClosest(preferred, args.speakerType, wooferSize, angle);
}

function calculateCoverage({
  lengthFt,
  widthFt,
  roomHeightFt,
  pendantHeightFt,
  coverageAngle,
  listenerPosition,
  coverageDensity,
  roomCoverage = "full"
}) {
  const earHeight = listenerPosition === "standing"
    ? STANDING_EAR_HEIGHT_FT
    : SEATED_EAR_HEIGHT_FT;

  const mountingHeight = pendantHeightFt > 0 ? pendantHeightFt : roomHeightFt;
  const rawDistance = mountingHeight - earHeight;

  if (rawDistance <= 0) {
    return null;
  }

  const listenerDistance = Math.max(MIN_LISTENER_DISTANCE_FT, rawDistance);

  // SSC: coverage diameter = 2 * tan(angle/2) * listener distance
  const coverageDiameter = Math.round(
    Math.tan((coverageAngle * Math.PI / 180) / 2) * listenerDistance * 200
  ) / 100;

  const densityModes = COVERAGE_MODES;

  const density = densityModes[coverageDensity] || densityModes["min-overlap"] || Object.values(densityModes)[0];
  const targetSpacing = Math.round(coverageDiameter * density.multiplier * 100) / 100;

  const rows = roomCoverage === "full"
    ? Math.max(1, Math.ceil(lengthFt / targetSpacing))
    : Math.max(1, Math.ceil(lengthFt / targetSpacing) - 1);

  const columns = roomCoverage === "full"
    ? Math.max(1, Math.ceil(widthFt / targetSpacing))
    : Math.max(1, Math.ceil(widthFt / targetSpacing) - 1);

  const count = rows * columns;

  const spacingX = roomCoverage === "full"
    ? Math.min(targetSpacing, Math.round((widthFt / columns) * 100) / 100)
    : Math.min(targetSpacing, Math.round((widthFt / (columns + 1)) * 100) / 100);

  const spacingY = roomCoverage === "full"
    ? Math.min(targetSpacing, Math.round((lengthFt / rows) * 100) / 100)
    : Math.min(targetSpacing, Math.round((lengthFt / (rows + 1)) * 100) / 100);

  const offsetX = columns === 1
    ? widthFt / 2
    : roomCoverage === "full" ? spacingX / 2 : spacingX;

  const offsetY = rows === 1
    ? lengthFt / 2
    : roomCoverage === "full" ? spacingY / 2 : spacingY;

  return {
    listenerDistance: Math.round(listenerDistance * 100) / 100,
    coverageDiameter,
    targetSpacing,
    columns,
    rows,
    count,
    spacingX,
    spacingY,
    offsetX: Math.round(offsetX * 100) / 100,
    offsetY: Math.round(offsetY * 100) / 100,
    expectedSPLVariation: density.variation,
    densityLabel: density.label,
    roomCoverage
  };
}


function cutoutRectFromSide(spanM, depthM, side, offsetM, roomWidthM, roomLengthM) {
  const horizontal = side === "top" || side === "bottom";
  const sideLength = horizontal ? roomWidthM : roomLengthM;
  const maxDepth = horizontal ? roomLengthM : roomWidthM;

  const span = Math.min(Math.max(0.2, spanM), Math.max(0.2, sideLength - 0.2));
  const depth = Math.min(Math.max(0.2, depthM), Math.max(0.2, maxDepth - 0.2));
  const offset = Math.max(0, Math.min(offsetM, Math.max(0, sideLength - span)));

  if (side === "top") {
    return {x1: offset, y1: 0, x2: offset + span, y2: depth, side, spanM: span, depthM: depth, offsetM: offset};
  }
  if (side === "bottom") {
    return {x1: offset, y1: roomLengthM - depth, x2: offset + span, y2: roomLengthM, side, spanM: span, depthM: depth, offsetM: offset};
  }
  if (side === "left") {
    return {x1: 0, y1: offset, x2: depth, y2: offset + span, side, spanM: span, depthM: depth, offsetM: offset};
  }
  return {
    x1: roomWidthM - depth,
    y1: offset,
    x2: roomWidthM,
    y2: offset + span,
    side,
    spanM: span,
    depthM: depth,
    offsetM: offset
  };
}

function rectArea(rect) {
  return Math.max(0, rect.x2 - rect.x1) * Math.max(0, rect.y2 - rect.y1);
}

function rectIntersectionArea(a, b) {
  const w = Math.max(0, Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1));
  const h = Math.max(0, Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1));
  return w * h;
}

function pointInsideCutout(xM, yM, rect, eps = 1e-7) {
  return (
    xM >= rect.x1 - eps &&
    xM <= rect.x2 + eps &&
    yM >= rect.y1 - eps &&
    yM <= rect.y2 + eps
  );
}

function getRoomShapeConfig() {
  const shape = document.getElementById("roomShape")?.value || "rectangle";

  if (shape === "circle") {
    const diameterM = Math.max(1, numValue(document.getElementById("diameter")?.value, 8));
    return {
      shape,
      widthM: diameterM,
      lengthM: diameterM,
      diameterM,
      areaM2: Math.PI * Math.pow(diameterM / 2, 2)
    };
  }

  const widthM = Math.max(1, numValue(document.getElementById("width")?.value, 10));
  const lengthM = Math.max(1, numValue(document.getElementById("length")?.value, 5));

  if (shape === "lshape") {
    const cutouts = [];

    const side1 = document.getElementById("lCutSide")?.value || "top";
    const span1 = numValue(document.getElementById("lCutWidth")?.value, 3);
    const depth1 = numValue(document.getElementById("lCutLength")?.value, 3);
    const offset1 = numValue(document.getElementById("lCutOffset")?.value, 0);

    cutouts.push(
      cutoutRectFromSide(span1, depth1, side1, offset1, widthM, lengthM)
    );

    const secondCutEnabled = Boolean(document.getElementById("secondCutEnabled")?.checked);
    if (secondCutEnabled) {
      const side2 = document.getElementById("lCutSide2")?.value || "bottom";
      const span2 = numValue(document.getElementById("lCutWidth2")?.value, 3);
      const depth2 = numValue(document.getElementById("lCutLength2")?.value, 3);
      const offset2 = numValue(document.getElementById("lCutOffset2")?.value, 0);

      cutouts.push(
        cutoutRectFromSide(span2, depth2, side2, offset2, widthM, lengthM)
      );
    }

    let removedAreaM2 = cutouts.reduce((sum, cut) => sum + rectArea(cut), 0);
    if (cutouts.length === 2) {
      removedAreaM2 -= rectIntersectionArea(cutouts[0], cutouts[1]);
    }

    return {
      shape,
      widthM,
      lengthM,
      cutouts,
      secondCutEnabled,
      areaM2: Math.max(0.04, widthM * lengthM - removedAreaM2)
    };
  }

  return { shape: "rectangle", widthM, lengthM, areaM2: widthM * lengthM };
}

function isPointInsideRoomMeters(xM, yM, room) {
  const eps = 1e-7;

  if (room.shape === "circle") {
    const r = room.diameterM / 2;
    const dx = xM - r;
    const dy = yM - r;
    return dx * dx + dy * dy <= r * r + eps;
  }

  if (
    xM < -eps ||
    yM < -eps ||
    xM > room.widthM + eps ||
    yM > room.lengthM + eps
  ) {
    return false;
  }

  if (room.shape !== "lshape") return true;

  return !(room.cutouts || []).some(cut => pointInsideCutout(xM, yM, cut, eps));
}

function clampPointToRoomMeters(xM, yM, room) {
  xM = Math.max(0, Math.min(room.widthM, xM));
  yM = Math.max(0, Math.min(room.lengthM, yM));

  if (isPointInsideRoomMeters(xM, yM, room)) return {xM, yM};

  if (room.shape === "circle") {
    const r = room.diameterM / 2;
    const dx = xM - r;
    const dy = yM - r;
    const d = Math.hypot(dx, dy) || 1;
    const rr = Math.max(0, r - 0.01);
    return {xM: r + dx / d * rr, yM: r + dy / d * rr};
  }

  // Generic search for the nearest legal point. This supports one or two cutouts
  // without special-casing individual corners.
  const originX = xM;
  const originY = yM;
  const maxRadius = Math.hypot(room.widthM, room.lengthM);
  const step = Math.max(0.02, Math.min(room.widthM, room.lengthM) / 250);

  for (let radius = step; radius <= maxRadius; radius += step) {
    const angularSteps = 32;
    for (let i = 0; i < angularSteps; i++) {
      const angle = 2 * Math.PI * i / angularSteps;
      const cx = Math.max(0, Math.min(room.widthM, originX + Math.cos(angle) * radius));
      const cy = Math.max(0, Math.min(room.lengthM, originY + Math.sin(angle) * radius));
      if (isPointInsideRoomMeters(cx, cy, room)) {
        return {xM: cx, yM: cy};
      }
    }
  }

  return {xM: room.widthM / 2, yM: room.lengthM / 2};
}

function roomPathData(room, ox, oy, scale) {
  const x = ox;
  const y = oy;
  const w = room.widthM * scale;
  const h = room.lengthM * scale;

  let d = `M ${x} ${y} H ${x+w} V ${y+h} H ${x} Z`;

  for (const cut of room.cutouts || []) {
    const cx1 = ox + cut.x1 * scale;
    const cy1 = oy + cut.y1 * scale;
    const cx2 = ox + cut.x2 * scale;
    const cy2 = oy + cut.y2 * scale;
    d += ` M ${cx1} ${cy1} H ${cx2} V ${cy2} H ${cx1} Z`;
  }

  return d;
}

function roomSvgShape(room, ox, oy, scale) {
  if (room.shape === "circle") {
    const r = room.diameterM / 2 * scale;
    return `<circle cx="${ox+r}" cy="${oy+r}" r="${r}" fill="#111820" stroke="#7d8998" stroke-width="2"/>`;
  }

  if (room.shape === "lshape") {
    const outline = getRoomBoundarySegments(room).map(([x1,y1,x2,y2]) =>
      `<line x1="${ox+x1*scale}" y1="${oy+y1*scale}" x2="${ox+x2*scale}" y2="${oy+y2*scale}" stroke="#7d8998" stroke-width="2"/>`
    ).join("");
    return `<path d="${roomPathData(room, ox, oy, scale)}" fill="#111820" fill-rule="evenodd" stroke="none"/>${outline}`;
  }

  return `<rect x="${ox}" y="${oy}" width="${room.widthM*scale}" height="${room.lengthM*scale}" rx="4" fill="#111820" stroke="#7d8998" stroke-width="2"/>`;
}

function roomClipPath(room, ox, oy, scale, clipId) {
  if (room.shape === "circle") {
    const r = room.diameterM / 2 * scale;
    return `<clipPath id="${clipId}"><circle cx="${ox+r}" cy="${oy+r}" r="${r}"/></clipPath>`;
  }

  if (room.shape === "lshape") {
    return `<clipPath id="${clipId}"><path d="${roomPathData(room, ox, oy, scale)}" clip-rule="evenodd" fill-rule="evenodd"/></clipPath>`;
  }

  return `<clipPath id="${clipId}"><rect x="${ox}" y="${oy}" width="${room.widthM*scale}" height="${room.lengthM*scale}" rx="4"/></clipPath>`;
}


function setSelectValueIfPresent(select, value) {
  if (!select) return;
  if ([...select.options].some(o => o.value === value && !o.disabled)) {
    select.value = value;
  }
}

function syncFloorControlsFromMain() {
  const coverageMain = document.getElementById("coverageDensity");
  const coverageFloor = document.getElementById("coverageDensityFloor");
  if (coverageMain && coverageFloor) {
    setSelectValueIfPresent(coverageFloor, coverageMain.value);
  }

  const optimizationMain = document.getElementById("placementOptimization");
  const optimizationFloor = document.getElementById("placementOptimizationFloor");
  if (optimizationMain && optimizationFloor) {
    setSelectValueIfPresent(optimizationFloor, optimizationMain.value);
  }
}

function fillPlacementModeSelect(select, options, preferredValue) {
  if (!select) return;
  select.innerHTML = "";

  for (const item of options) {
    const option = document.createElement("option");
    option.value = item.value;
    option.textContent = item.label;
    select.appendChild(option);
  }

  select.value = options.some(o => o.value === preferredValue)
    ? preferredValue
    : options[0].value;
}

function updatePlacementOptimizationAvailability() {
  const shape = document.getElementById("roomShape")?.value || "rectangle";
  const main = document.getElementById("placementOptimization");
  const floor = document.getElementById("placementOptimizationFloor");
  const previous = main?.value || floor?.value || "regular";

  let options;
  let preferred = previous;

  if (shape === "rectangle") {
    // Obdélník používá výhradně referenční SSC mřížku. Volba rozmístění
    // se v UI skryje; kruh a speciální tvar si své volby ponechávají.
    options = [
      {value:"regular", label:"Mřížka"}
    ];
    preferred = "regular";
  } else if (shape === "circle") {
    options = [
      {value:"circle-aligned", label:"Zarovnaná"},
      {value:"circle-rings", label:"Kruhová"}
    ];

    if (!["circle-aligned","circle-rings"].includes(preferred)) {
      preferred =
        previous === "coverage"
          ? "circle-rings"
          : "circle-aligned";
    }
  } else {
    // L/T/U / výřezy zatím beze změny.
    options = [
      {value:"regular", label:"Pevná mřížka"},
      {value:"balanced", label:"Vyvážené – geometrie i pokrytí"},
      {value:"coverage", label:"Nejlepší pokrytí"}
    ];

    if (!options.some(o => o.value === preferred)) {
      preferred = "balanced";
    }
  }

  const mainRow = main?.closest(".placement-optimization-row");
  const floorRow = floor?.closest(".floor-plan-control");
  const hidePlacementChoice = shape === "rectangle";
  mainRow?.classList.toggle("hidden", hidePlacementChoice);
  floorRow?.classList.toggle("hidden", hidePlacementChoice);

  fillPlacementModeSelect(main, options, preferred);
  fillPlacementModeSelect(floor, options, main?.value || preferred);
}
function updateRoomShapeUi() {
  const shape = document.getElementById("roomShape")?.value || "rectangle";

  const roomGrid = document.getElementById("roomDimensionsGrid");
  const lengthRow = document.getElementById("lengthRow");
  const widthRow = document.getElementById("widthRow");
  const heightRow = document.getElementById("heightRow");
  const ambientNoiseRow = document.getElementById("ambientNoiseRow");
  const lShapeControls = document.getElementById("lShapeControls");
  const circleControls = document.getElementById("circleControls");
  const secondCutControls = document.getElementById("secondCutControls");
  const secondCutEnabled = Boolean(document.getElementById("secondCutEnabled")?.checked);

  const isCircle = shape === "circle";
  const isCutoutRoom = shape === "lshape";

  lengthRow?.classList.toggle("hidden", isCircle);
  widthRow?.classList.toggle("hidden", isCircle);
  lShapeControls?.classList.toggle("hidden", !isCutoutRoom);
  circleControls?.classList.toggle("hidden", !isCircle);
  secondCutControls?.classList.toggle("hidden", !isCutoutRoom || !secondCutEnabled);

  // Výška je vždy viditelná. U kruhu ji přesuneme vedle průměru,
  // u ostatních tvarů zpět do základní mřížky.
  if (isCircle) {
    if (heightRow && circleControls && heightRow.parentElement !== circleControls) {
      circleControls.appendChild(heightRow);
    }
  } else {
    if (heightRow && roomGrid && ambientNoiseRow && heightRow.parentElement !== roomGrid) {
      roomGrid.insertBefore(heightRow, ambientNoiseRow);
    }
  }

  updatePlacementOptimizationAvailability();
}
function calculatePlacements(coverage, room = null) {
  const points = [];
  for (let row = 0; row < coverage.rows; row++) {
    for (let col = 0; col < coverage.columns; col++) {
      const point = {x: coverage.offsetX + col * coverage.spacingX, y: coverage.offsetY + row * coverage.spacingY};
      if (!room || isPointInsideRoomMeters(point.x / FEET_PER_METER, point.y / FEET_PER_METER, room)) {
        points.push(point);
      }
    }
  }
  return points;
}



function pointSegmentDistance(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;
  const denom = abx * abx + aby * aby;
  const t = denom > 0
    ? Math.max(0, Math.min(1, (apx * abx + apy * aby) / denom))
    : 0;
  const qx = ax + t * abx;
  const qy = ay + t * aby;
  return Math.hypot(px - qx, py - qy);
}

function subtractIntervals(fullStart, fullEnd, intervals) {
  if (!intervals?.length) return [[fullStart, fullEnd]];

  const merged = intervals
    .map(([a,b]) => [Math.max(fullStart, a), Math.min(fullEnd, b)])
    .filter(([a,b]) => b > a)
    .sort((a,b) => a[0] - b[0])
    .reduce((acc, cur) => {
      if (!acc.length || cur[0] > acc[acc.length - 1][1]) {
        acc.push(cur.slice());
      } else {
        acc[acc.length - 1][1] = Math.max(acc[acc.length - 1][1], cur[1]);
      }
      return acc;
    }, []);

  const result = [];
  let cursor = fullStart;
  for (const [a,b] of merged) {
    if (a > cursor) result.push([cursor, a]);
    cursor = Math.max(cursor, b);
  }
  if (cursor < fullEnd) result.push([cursor, fullEnd]);
  return result;
}

function getRoomBoundarySegments(room) {
  if (room.shape === "circle") return [];

  if (room.shape !== "lshape") {
    return [
      [0, 0, room.widthM, 0],
      [room.widthM, 0, room.widthM, room.lengthM],
      [room.widthM, room.lengthM, 0, room.lengthM],
      [0, room.lengthM, 0, 0]
    ];
  }

  const cuts = room.cutouts || [];
  const eps = 1e-7;

  // Důležité: ořežeme vnější stěny podle každého výřezu, který se
  // dané stěny skutečně dotýká. Nejen podle hodnoty cut.side.
  // Díky tomu výřez s odsazením 0 nezanechá původní hranu uvnitř otvoru.
  const topCuts = cuts
    .filter(c => Math.abs(c.y1) <= eps)
    .map(c => [c.x1, c.x2]);

  const bottomCuts = cuts
    .filter(c => Math.abs(c.y2 - room.lengthM) <= eps)
    .map(c => [c.x1, c.x2]);

  const leftCuts = cuts
    .filter(c => Math.abs(c.x1) <= eps)
    .map(c => [c.y1, c.y2]);

  const rightCuts = cuts
    .filter(c => Math.abs(c.x2 - room.widthM) <= eps)
    .map(c => [c.y1, c.y2]);

  const segments = [];

  for (const [a,b] of subtractIntervals(0, room.widthM, topCuts)) {
    segments.push([a, 0, b, 0]);
  }
  for (const [a,b] of subtractIntervals(0, room.widthM, bottomCuts)) {
    segments.push([a, room.lengthM, b, room.lengthM]);
  }
  for (const [a,b] of subtractIntervals(0, room.lengthM, leftCuts)) {
    segments.push([0, a, 0, b]);
  }
  for (const [a,b] of subtractIntervals(0, room.lengthM, rightCuts)) {
    segments.push([room.widthM, a, room.widthM, b]);
  }

  // Vnitřní hrany výřezů. Hrana, která přesně splývá s vnější
  // stěnou místnosti, se nekreslí — jinak by při odsazení 0 vznikala
  // falešná šedá čára uvnitř vyříznuté části.
  for (const c of cuts) {
    if (c.side === "top") {
      if (c.x1 > eps) {
        segments.push([c.x1,c.y1,c.x1,c.y2]);
      }
      segments.push([c.x1,c.y2,c.x2,c.y2]);
      if (c.x2 < room.widthM - eps) {
        segments.push([c.x2,c.y2,c.x2,c.y1]);
      }
    } else if (c.side === "bottom") {
      if (c.x1 > eps) {
        segments.push([c.x1,c.y2,c.x1,c.y1]);
      }
      segments.push([c.x1,c.y1,c.x2,c.y1]);
      if (c.x2 < room.widthM - eps) {
        segments.push([c.x2,c.y1,c.x2,c.y2]);
      }
    } else if (c.side === "left") {
      if (c.y1 > eps) {
        segments.push([c.x1,c.y1,c.x2,c.y1]);
      }
      segments.push([c.x2,c.y1,c.x2,c.y2]);
      if (c.y2 < room.lengthM - eps) {
        segments.push([c.x2,c.y2,c.x1,c.y2]);
      }
    } else {
      if (c.y1 > eps) {
        segments.push([c.x2,c.y1,c.x1,c.y1]);
      }
      segments.push([c.x1,c.y1,c.x1,c.y2]);
      if (c.y2 < room.lengthM - eps) {
        segments.push([c.x1,c.y2,c.x2,c.y2]);
      }
    }
  }

  // Odstraníme nulové a duplicitní segmenty, které mohou vzniknout,
  // když výřez začíná přesně v rohu.
  const seen = new Set();
  return segments.filter(([x1,y1,x2,y2]) => {
    if (Math.hypot(x2-x1, y2-y1) < 1e-6) return false;
    const a = `${x1.toFixed(6)},${y1.toFixed(6)}`;
    const b = `${x2.toFixed(6)},${y2.toFixed(6)}`;
    const key = a < b ? `${a}|${b}` : `${b}|${a}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function distanceToRoomBoundaryMeters(xM, yM, room) {
  if (!isPointInsideRoomMeters(xM, yM, room)) return 0;

  if (room.shape === "circle") {
    const r = room.diameterM / 2;
    return Math.max(0, r - Math.hypot(xM - r, yM - r));
  }

  const segments = getRoomBoundarySegments(room);
  let best = Infinity;
  for (const [ax, ay, bx, by] of segments) {
    best = Math.min(best, pointSegmentDistance(xM, yM, ax, ay, bx, by));
  }
  return best;
}

function recommendedWallClearanceMeters(coverage, room) {
  const spacingXM = Math.max(0.1, coverage.spacingX / FEET_PER_METER);
  const spacingYM = Math.max(0.1, coverage.spacingY / FEET_PER_METER);
  const spacingM = Math.min(spacingXM, spacingYM);

  // Practical visual/acoustic margin. It scales with spacing but doesn't
  // become excessive in large halls.
  const scaled = spacingM * 0.22;
  const roomLimit = Math.max(0.25, Math.min(room.widthM, room.lengthM) * 0.12);
  return Math.max(0.45, Math.min(1.25, scaled, roomLimit));
}

function clampPointToRoomWithClearance(xM, yM, room, clearanceM) {
  const basic = clampPointToRoomMeters(xM, yM, room);
  xM = basic.xM;
  yM = basic.yM;

  if (distanceToRoomBoundaryMeters(xM, yM, room) >= clearanceM) {
    return {xM, yM};
  }

  // Search the nearest legal point. This works for the outer walls,
  // the inner corner of an L room and a circular perimeter.
  let best = null;
  let bestDistance = Infinity;
  const maxRadius = Math.max(room.widthM, room.lengthM);
  const radialStep = Math.max(0.05, clearanceM / 5);

  for (let radius = radialStep; radius <= maxRadius; radius += radialStep) {
    const angularSteps = 24;
    for (let i = 0; i < angularSteps; i++) {
      const angle = 2 * Math.PI * i / angularSteps;
      const cx = xM + Math.cos(angle) * radius;
      const cy = yM + Math.sin(angle) * radius;
      if (!isPointInsideRoomMeters(cx, cy, room)) continue;
      if (distanceToRoomBoundaryMeters(cx, cy, room) + 1e-6 < clearanceM) continue;

      const d = Math.hypot(cx - xM, cy - yM);
      if (d < bestDistance) {
        bestDistance = d;
        best = {xM: cx, yM: cy};
      }
    }
    if (best) break;
  }

  return best || basic;
}

const OPTIMIZATION_SAMPLE_CACHE = new Map();
const LAYOUT_CANDIDATE_CACHE = new Map();
const COUNT_RECOMMENDATION_CACHE = new Map();

function roomGeometryCacheKey(room) {
  const cuts = (room.cutouts || []).map(c => [
    c.side,
    Number(c.x1).toFixed(3),
    Number(c.y1).toFixed(3),
    Number(c.x2).toFixed(3),
    Number(c.y2).toFixed(3)
  ].join(":")).join("|");

  return [
    room.shape,
    Number(room.widthM).toFixed(3),
    Number(room.lengthM).toFixed(3),
    Number(room.diameterM || 0).toFixed(3),
    cuts
  ].join(";");
}

function cacheSetLimited(map, key, value, maxEntries = 80) {
  if (map.size >= maxEntries && !map.has(key)) {
    const firstKey = map.keys().next().value;
    if (firstKey !== undefined) map.delete(firstKey);
  }
  map.set(key, value);
}

function makeOptimizationSamples(room, maxPoints = 900) {
  const cacheKey = `${roomGeometryCacheKey(room)};samples=${maxPoints}`;
  const cached = OPTIMIZATION_SAMPLE_CACHE.get(cacheKey);
  if (cached) return cached;

  const aspect = Math.max(0.1, room.widthM / Math.max(0.1, room.lengthM));
  let nx = Math.max(8, Math.round(Math.sqrt(maxPoints * aspect)));
  let ny = Math.max(8, Math.round(maxPoints / nx));
  nx = Math.min(nx, 70);
  ny = Math.min(ny, 70);

  const samples = [];
  for (let iy = 0; iy < ny; iy++) {
    const yM = room.lengthM * (iy + 0.5) / ny;
    for (let ix = 0; ix < nx; ix++) {
      const xM = room.widthM * (ix + 0.5) / nx;
      if (isPointInsideRoomMeters(xM, yM, room)) {
        samples.push({xM, yM});
      }
    }
  }

  cacheSetLimited(OPTIMIZATION_SAMPLE_CACHE, cacheKey, samples, 64);
  return samples;
}

function placementGeometryScore(placements, room, samples = null, clearanceM = 0) {
  if (!placements?.length) return Infinity;

  const pts = placements.map(p => ({
    xM: p.x / FEET_PER_METER,
    yM: p.y / FEET_PER_METER
  }));
  const testPoints = samples || makeOptimizationSamples(room, 650);
  if (!testPoints.length) return Infinity;

  const distances = [];
  for (const s of testPoints) {
    let bestD2 = Infinity;
    for (const p of pts) {
      const dx = s.xM - p.xM;
      const dy = s.yM - p.yM;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestD2) bestD2 = d2;
    }
    distances.push(Math.sqrt(bestD2));
  }

  distances.sort((a,b) => a-b);
  const mean = distances.reduce((a,b) => a+b, 0) / distances.length;
  const variance = distances.reduce((sum,d) => sum + Math.pow(d - mean, 2), 0) / distances.length;
  const std = Math.sqrt(variance);
  const p90 = distances[Math.min(distances.length - 1, Math.floor(distances.length * 0.90))];
  const max = distances[distances.length - 1];

  let wallPenalty = 0;
  if (clearanceM > 0) {
    for (const p of pts) {
      const d = distanceToRoomBoundaryMeters(p.xM, p.yM, room);
      if (d < clearanceM) {
        wallPenalty += Math.pow((clearanceM - d) / Math.max(0.1, clearanceM), 2);
      }
    }
    wallPenalty /= pts.length;
  }

  // Těžiště skutečné využitelné plochy, ne obálky místnosti.
  // U L/U půdorysů tím zabráníme tomu, aby se celá sestava bez důvodu
  // posunula k jedné vnější stěně.
  const roomCx = testPoints.reduce((s,p) => s + p.xM, 0) / testPoints.length;
  const roomCy = testPoints.reduce((s,p) => s + p.yM, 0) / testPoints.length;
  const speakerCx = pts.reduce((s,p) => s + p.xM, 0) / pts.length;
  const speakerCy = pts.reduce((s,p) => s + p.yM, 0) / pts.length;
  const diag = Math.max(0.1, Math.hypot(room.widthM, room.lengthM));
  const centroidPenalty = Math.hypot(speakerCx - roomCx, speakerCy - roomCy) / diag;

  return (
    max * 0.47 +
    p90 * 0.27 +
    std * 0.11 +
    wallPenalty * 2.0 +
    centroidPenalty * 3.0
  );
}

function generateAlignedGridWithOffset(coverage, room, shiftXFt, shiftYFt, clearanceM) {
  const points = [];
  for (let row = 0; row < coverage.rows; row++) {
    for (let col = 0; col < coverage.columns; col++) {
      const x = coverage.offsetX + shiftXFt + col * coverage.spacingX;
      const y = coverage.offsetY + shiftYFt + row * coverage.spacingY;
      const xM = x / FEET_PER_METER;
      const yM = y / FEET_PER_METER;

      if (!isPointInsideRoomMeters(xM, yM, room)) continue;
      if (distanceToRoomBoundaryMeters(xM, yM, room) + 1e-6 < clearanceM) continue;
      points.push({x, y});
    }
  }
  return points;
}

function generateRegularLPlacements(basePlacements, coverage, room, clearanceM) {
  const targetCount = basePlacements.length;
  const samples = makeOptimizationSamples(room, 700);

  let best = null;
  let bestScore = Infinity;

  // Shift the whole grid as one object: rows and columns stay perfectly aligned.
  const fractions = [-0.45,-0.35,-0.25,-0.15,-0.05,0,0.05,0.15,0.25,0.35,0.45];

  for (const fx of fractions) {
    for (const fy of fractions) {
      const candidate = generateAlignedGridWithOffset(
        coverage,
        room,
        coverage.spacingX * fx,
        coverage.spacingY * fy,
        clearanceM
      );

      if (candidate.length !== targetCount) continue;

      const score = placementGeometryScore(candidate, room, samples, clearanceM);
      if (score < bestScore) {
        bestScore = score;
        best = candidate;
      }
    }
  }

  if (best) return best;

  // If the exact count cannot be achieved by a global shift, preserve the
  // original grid as much as possible and move only offending points inward.
  return basePlacements.map(p => {
    const projected = clampPointToRoomWithClearance(
      p.x / FEET_PER_METER,
      p.y / FEET_PER_METER,
      room,
      clearanceM
    );
    return {x: projected.xM * FEET_PER_METER, y: projected.yM * FEET_PER_METER};
  });
}

function generateCircularRingPlacements(count, room, clearanceM) {
  if (!count) return [];

  const r = room.diameterM / 2;
  const cx = r;
  const cy = r;
  const usableR = Math.max(0.2, r - clearanceM);

  if (count === 1) {
    return [{x: cx * FEET_PER_METER, y: cy * FEET_PER_METER}];
  }

  // Symmetric ring templates. We deliberately avoid free per-point placement.
  // The pattern remains centered around the room center.
  const points = [];

  function addRing(n, radius, phase = -Math.PI / 2) {
    for (let i = 0; i < n; i++) {
      const angle = phase + 2 * Math.PI * i / n;
      points.push({
        x: (cx + radius * Math.cos(angle)) * FEET_PER_METER,
        y: (cy + radius * Math.sin(angle)) * FEET_PER_METER
      });
    }
  }

  // Small counts: one perfectly centered regular polygon.
  if (count <= 6) {
    const radius = usableR * (count <= 2 ? 0.38 : count <= 4 ? 0.52 : 0.58);
    addRing(count, radius);
    return points;
  }

  // Medium counts: center + one ring if it creates a clean symmetric pattern.
  if ([7, 9, 11, 13].includes(count)) {
    points.push({x: cx * FEET_PER_METER, y: cy * FEET_PER_METER});
    addRing(count - 1, usableR * 0.62);
    return points;
  }

  // Two concentric symmetric rings. Inner/outer counts are chosen so both
  // rings remain close to regular polygons and the overall centroid is exact.
  let innerCount = Math.max(4, Math.round(count * 0.35));
  let outerCount = count - innerCount;

  // Avoid pathological tiny outer rings.
  if (outerCount < innerCount) {
    innerCount = Math.floor(count / 3);
    outerCount = count - innerCount;
  }

  const innerRadius = usableR * 0.36;
  const outerRadius = usableR * 0.72;

  addRing(innerCount, innerRadius, -Math.PI / 2);
  addRing(outerCount, outerRadius, -Math.PI / 2 + Math.PI / Math.max(1, outerCount));

  return points.slice(0, count);
}

function enforceCircularSymmetry(placements, room) {
  if (!placements?.length) return placements || [];

  const r = room.diameterM / 2;
  const cxFt = r * FEET_PER_METER;
  const cyFt = r * FEET_PER_METER;

  const meanX = placements.reduce((s,p) => s + p.x, 0) / placements.length;
  const meanY = placements.reduce((s,p) => s + p.y, 0) / placements.length;
  const dx = cxFt - meanX;
  const dy = cyFt - meanY;

  return placements.map(p => ({x: p.x + dx, y: p.y + dy}));
}

function optimizeCircularRadius(pattern, room, clearanceM, samples) {
  if (!pattern?.length) return pattern || [];

  const r = room.diameterM / 2;
  const cxFt = r * FEET_PER_METER;
  const cyFt = r * FEET_PER_METER;
  const maxScale = 1.16;
  const minScale = 0.78;

  let best = pattern;
  let bestScore = placementGeometryScore(pattern, room, samples, clearanceM);

  for (let scale = minScale; scale <= maxScale + 1e-9; scale += 0.04) {
    const candidate = pattern.map(p => ({
      x: cxFt + (p.x - cxFt) * scale,
      y: cyFt + (p.y - cyFt) * scale
    })).map(p => {
      const clamped = clampPointToRoomWithClearance(
        p.x / FEET_PER_METER,
        p.y / FEET_PER_METER,
        room,
        clearanceM
      );
      return {x: clamped.xM * FEET_PER_METER, y: clamped.yM * FEET_PER_METER};
    });

    const centered = enforceCircularSymmetry(candidate, room);
    const score = placementGeometryScore(centered, room, samples, clearanceM);

    if (score < bestScore) {
      best = centered;
      bestScore = score;
    }
  }

  return best;
}
function relaxPlacements(placements, room, iterations = 4, blend = 0.58, clearanceM = 0) {
  if (!placements?.length) return placements || [];

  const samples = makeOptimizationSamples(room);
  let pts = placements.map(p => ({
    xM: p.x / FEET_PER_METER,
    yM: p.y / FEET_PER_METER
  }));

  for (let iteration = 0; iteration < iterations; iteration++) {
    const accum = pts.map(() => ({x:0, y:0, n:0}));

    for (const s of samples) {
      let bestIndex = 0;
      let bestD2 = Infinity;

      for (let i = 0; i < pts.length; i++) {
        const dx = s.xM - pts[i].xM;
        const dy = s.yM - pts[i].yM;
        const d2 = dx*dx + dy*dy;
        if (d2 < bestD2) {
          bestD2 = d2;
          bestIndex = i;
        }
      }

      accum[bestIndex].x += s.xM;
      accum[bestIndex].y += s.yM;
      accum[bestIndex].n++;
    }

    pts = pts.map((p, i) => {
      if (!accum[i].n) return p;

      const targetX = accum[i].x / accum[i].n;
      const targetY = accum[i].y / accum[i].n;
      const nextX = p.xM * (1 - blend) + targetX * blend;
      const nextY = p.yM * (1 - blend) + targetY * blend;

      const clamped = clearanceM > 0
        ? clampPointToRoomWithClearance(nextX, nextY, room, clearanceM)
        : clampPointToRoomMeters(nextX, nextY, room);

      return {xM: clamped.xM, yM: clamped.yM};
    });
  }

  return pts.map(p => ({
    x: p.xM * FEET_PER_METER,
    y: p.yM * FEET_PER_METER
  }));
}

function blendPlacements(regular, optimized, room, blend, clearanceM) {
  return regular.map((p, i) => {
    const q = optimized[i] || p;
    const xM = ((p.x * (1 - blend) + q.x * blend) / FEET_PER_METER);
    const yM = ((p.y * (1 - blend) + q.y * blend) / FEET_PER_METER);
    const clamped = clampPointToRoomWithClearance(xM, yM, room, clearanceM);
    return {x: clamped.xM * FEET_PER_METER, y: clamped.yM * FEET_PER_METER};
  });
}


function roomSampleCentroid(room, samples = null) {
  const pts = samples || makeOptimizationSamples(room, 500);
  if (!pts.length) return {xM: room.widthM / 2, yM: room.lengthM / 2};
  return {
    xM: pts.reduce((s,p) => s + p.xM, 0) / pts.length,
    yM: pts.reduce((s,p) => s + p.yM, 0) / pts.length
  };
}

function dedupePlacementPoints(points, minimumDistanceM = 0.08) {
  const out = [];
  for (const p of points || []) {
    const xM = p.x / FEET_PER_METER;
    const yM = p.y / FEET_PER_METER;
    const duplicate = out.some(q =>
      Math.hypot(q.x / FEET_PER_METER - xM, q.y / FEET_PER_METER - yM) < minimumDistanceM
    );
    if (!duplicate) out.push(p);
  }
  return out;
}

function chooseSpreadSubset(points, count, room, samples = null) {
  if (!points?.length || count <= 0) return [];
  if (points.length <= count) return points.slice();

  const roomSamples = samples || makeOptimizationSamples(room, 450);
  const centroid = roomSampleCentroid(room, roomSamples);
  const remaining = points.map(p => ({...p}));
  const selected = [];

  // Začínáme bodem nejblíže těžišti skutečné plochy.
  let firstIndex = 0;
  let firstDistance = Infinity;
  for (let i = 0; i < remaining.length; i++) {
    const d = Math.hypot(
      remaining[i].x / FEET_PER_METER - centroid.xM,
      remaining[i].y / FEET_PER_METER - centroid.yM
    );
    if (d < firstDistance) {
      firstDistance = d;
      firstIndex = i;
    }
  }
  selected.push(remaining.splice(firstIndex, 1)[0]);

  // Další body vybíráme co nejdál od již zvolených bodů.
  // Malá preference odstupu od stěny zabraňuje nechtěnému "nalepení".
  while (selected.length < count && remaining.length) {
    let bestIndex = 0;
    let bestValue = -Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const p = remaining[i];
      const xM = p.x / FEET_PER_METER;
      const yM = p.y / FEET_PER_METER;
      const nearest = Math.min(...selected.map(q =>
        Math.hypot(q.x / FEET_PER_METER - xM, q.y / FEET_PER_METER - yM)
      ));
      const wall = distanceToRoomBoundaryMeters(xM, yM, room);
      const centroidDistance = Math.hypot(xM - centroid.xM, yM - centroid.yM);
      const value = nearest + Math.min(wall, 1.2) * 0.09 - centroidDistance * 0.015;

      if (value > bestValue) {
        bestValue = value;
        bestIndex = i;
      }
    }

    selected.push(remaining.splice(bestIndex, 1)[0]);
  }

  return selected;
}

function rotatePlacementPoint(xM, yM, cxM, cyM, angleDeg) {
  const a = angleDeg * Math.PI / 180;
  const dx = xM - cxM;
  const dy = yM - cyM;
  return {
    xM: cxM + dx * Math.cos(a) - dy * Math.sin(a),
    yM: cyM + dx * Math.sin(a) + dy * Math.cos(a)
  };
}

function regularGridCandidatesForCount(
  count,
  room,
  clearanceM,
  angleDeg = 0,
  staggerRows = false,
  maxCandidates = 4
) {
  if (count <= 0) return [];

  const samples = makeOptimizationSamples(room, 260);
  const centroid = roomSampleCentroid(room, samples);
  const aspect = Math.max(0.2, room.widthM / Math.max(0.2, room.lengthM));
  const approximateColumns = Math.max(1, Math.round(Math.sqrt(count * aspect)));
  const ranked = [];

  // U kruhu musí být pravidelná mřížka skutečně vystředěná.
  // U ostatních půdorysů dovolíme jen malé globální posuny.
  const phasePairs = room.shape === "circle"
    ? [[0,0]]
    : [[0,0],[-0.12,0],[0.12,0],[0,-0.12],[0,0.12]];

  // Širší rozsah okrajového odsazení je důležitý hlavně pro kruh:
  // mřížka se může stáhnout směrem ke středu místo nalepení k obvodu.
  const marginFactors = room.shape === "circle"
    ? [0.58, 0.76, 0.96, 1.16]
    : [0.52, 0.70, 0.88];

  for (
    let columns = Math.max(1, approximateColumns - 2);
    columns <= approximateColumns + 2;
    columns++
  ) {
    const rows = Math.max(1, Math.ceil(count / columns));

    for (const marginFactor of marginFactors) {
      const marginX = Math.max(
        clearanceM,
        Math.min(
          room.widthM * (room.shape === "circle" ? 0.34 : 0.27),
          room.widthM / Math.max(2, columns + 1) * marginFactor
        )
      );
      const marginY = Math.max(
        clearanceM,
        Math.min(
          room.lengthM * (room.shape === "circle" ? 0.34 : 0.27),
          room.lengthM / Math.max(2, rows + 1) * marginFactor
        )
      );

      const usableW = Math.max(0.05, room.widthM - 2 * marginX);
      const usableH = Math.max(0.05, room.lengthM - 2 * marginY);
      const stepX = columns > 1 ? usableW / (columns - 1) : 0;
      const stepY = rows > 1 ? usableH / (rows - 1) : 0;

      for (const [phaseX, phaseY] of phasePairs) {
        let lattice = [];

        for (let row = 0; row < rows; row++) {
          const rowShift = staggerRows && columns > 1 && row % 2 ? stepX * 0.5 : 0;

          for (let col = 0; col < columns; col++) {
            let xM = columns === 1
              ? centroid.xM
              : centroid.xM - usableW / 2 + col * stepX + rowShift + phaseX * stepX;
            let yM = rows === 1
              ? centroid.yM
              : centroid.yM - usableH / 2 + row * stepY + phaseY * stepY;

            const rotated = rotatePlacementPoint(
              xM, yM, centroid.xM, centroid.yM, angleDeg
            );
            xM = rotated.xM;
            yM = rotated.yM;

            if (!isPointInsideRoomMeters(xM, yM, room)) continue;
            if (distanceToRoomBoundaryMeters(xM, yM, room) < clearanceM * 0.80) continue;

            lattice.push({
              x: xM * FEET_PER_METER,
              y: yM * FEET_PER_METER
            });
          }
        }

        lattice = dedupePlacementPoints(lattice);
        if (lattice.length < count) continue;

        const selected = chooseSpreadSubset(lattice, count, room, samples);
        if (selected.length !== count) continue;

        const geometryScore = placementGeometryScore(
          selected, room, samples, clearanceM
        );
        ranked.push({placements:selected, geometryScore});
      }
    }
  }

  ranked.sort((a,b) => a.geometryScore - b.geometryScore);

  const unique = [];
  const keys = new Set();
  for (const item of ranked) {
    const key = item.placements
      .map(p => `${(p.x/FEET_PER_METER).toFixed(2)},${(p.y/FEET_PER_METER).toFixed(2)}`)
      .sort()
      .join("|");
    if (keys.has(key)) continue;
    keys.add(key);
    unique.push(item.placements);
    if (unique.length >= maxCandidates) break;
  }

  return unique;
}

function adaptiveAlignedRowsCandidate(count, room, clearanceM, vertical = false) {
  if (count <= 0) return [];

  const samples = makeOptimizationSamples(room, 700);
  const centroid = roomSampleCentroid(room, samples);

  // Vytvoříme několik vodorovných/svislých logických řad.
  // Počty prvků i rozteče v jednotlivých řadách se mohou lišit,
  // ale každá řada sama zůstává geometricky přesně zarovnaná.
  const aspect = vertical
    ? room.lengthM / Math.max(0.2, room.widthM)
    : room.widthM / Math.max(0.2, room.lengthM);

  const rowCount = Math.max(1, Math.round(Math.sqrt(count / Math.max(0.25, aspect))));
  const lineCount = Math.max(1, Math.min(count, rowCount));

  const lineCandidates = [];
  for (let line = 0; line < lineCount; line++) {
    const t = (line + 0.5) / lineCount;
    const fixed = vertical ? room.widthM * t : room.lengthM * t;
    const points = [];

    const samplesOnLine = 90;
    for (let i = 0; i < samplesOnLine; i++) {
      const along = (i + 0.5) / samplesOnLine;
      const xM = vertical ? fixed : room.widthM * along;
      const yM = vertical ? room.lengthM * along : fixed;
      if (!isPointInsideRoomMeters(xM, yM, room)) continue;
      if (distanceToRoomBoundaryMeters(xM, yM, room) < clearanceM * 0.80) continue;
      points.push({xM, yM});
    }

    if (points.length) lineCandidates.push(points);
  }

  if (!lineCandidates.length) return [];

  // Rozdělíme počet repro mezi řady podle dostupné délky.
  const weights = lineCandidates.map(line => line.length);
  const weightTotal = weights.reduce((a,b) => a+b, 0);
  const allocations = weights.map(w => Math.max(1, Math.floor(count * w / weightTotal)));

  while (allocations.reduce((a,b) => a+b, 0) > count) {
    let index = allocations.findIndex(v => v > 1);
    if (index < 0) break;
    allocations[index]--;
  }
  while (allocations.reduce((a,b) => a+b, 0) < count) {
    let bestIndex = 0;
    let bestRoom = -Infinity;
    for (let i = 0; i < allocations.length; i++) {
      const roomLeft = lineCandidates[i].length / Math.max(1, allocations[i]);
      if (roomLeft > bestRoom) {
        bestRoom = roomLeft;
        bestIndex = i;
      }
    }
    allocations[bestIndex]++;
  }

  const points = [];
  for (let lineIndex = 0; lineIndex < lineCandidates.length; lineIndex++) {
    const line = lineCandidates[lineIndex];
    const n = allocations[lineIndex];
    if (!n) continue;

    for (let j = 0; j < n; j++) {
      const index = Math.min(
        line.length - 1,
        Math.round((j + 0.5) * line.length / n - 0.5)
      );
      const p = line[index];
      points.push({
        x: p.xM * FEET_PER_METER,
        y: p.yM * FEET_PER_METER
      });
    }
  }

  if (points.length !== count) {
    return chooseSpreadSubset(
      samples.map(p => ({x:p.xM*FEET_PER_METER, y:p.yM*FEET_PER_METER})),
      count,
      room,
      samples
    );
  }

  // Jemně posuneme celou logickou strukturu k těžišti využitelné plochy,
  // ale jednotlivé řady nerozbijeme.
  const px = points.reduce((s,p) => s + p.x / FEET_PER_METER, 0) / points.length;
  const py = points.reduce((s,p) => s + p.y / FEET_PER_METER, 0) / points.length;
  const dx = centroid.xM - px;
  const dy = centroid.yM - py;

  const shifted = points.map(p => {
    const xM = p.x / FEET_PER_METER + dx;
    const yM = p.y / FEET_PER_METER + dy;
    if (!isPointInsideRoomMeters(xM, yM, room)) return p;
    if (distanceToRoomBoundaryMeters(xM, yM, room) < clearanceM * 0.78) return p;
    return {x:xM*FEET_PER_METER, y:yM*FEET_PER_METER};
  });

  return shifted;
}

function concentricCircleCandidate(count, room, clearanceM) {
  if (room.shape !== "circle" || count <= 0) return [];
  const r = room.diameterM / 2;
  const cx = r;
  const cy = r;
  const usable = Math.max(0.2, r - clearanceM);

  if (count === 1) {
    return [{x:cx*FEET_PER_METER, y:cy*FEET_PER_METER}];
  }

  const points = [];
  let remaining = count;

  // U lichých a středních počtů je často výhodné mít reproduktor ve středu.
  if (count >= 5 && count % 2 === 1) {
    points.push({x:cx*FEET_PER_METER, y:cy*FEET_PER_METER});
    remaining--;
  }

  const ringCount = remaining <= 8 ? 1 : 2;
  if (ringCount === 1) {
    const radius = usable * 0.58;
    for (let i = 0; i < remaining; i++) {
      const a = -Math.PI/2 + 2*Math.PI*i/remaining;
      points.push({
        x:(cx + radius*Math.cos(a))*FEET_PER_METER,
        y:(cy + radius*Math.sin(a))*FEET_PER_METER
      });
    }
  } else {
    const inner = Math.max(4, Math.round(remaining * 0.36));
    const outer = remaining - inner;
    for (let i=0; i<inner; i++) {
      const a = -Math.PI/2 + 2*Math.PI*i/inner;
      points.push({
        x:(cx + usable*0.34*Math.cos(a))*FEET_PER_METER,
        y:(cy + usable*0.34*Math.sin(a))*FEET_PER_METER
      });
    }
    for (let i=0; i<outer; i++) {
      const a = -Math.PI/2 + Math.PI/Math.max(1,outer) + 2*Math.PI*i/outer;
      points.push({
        x:(cx + usable*0.72*Math.cos(a))*FEET_PER_METER,
        y:(cy + usable*0.72*Math.sin(a))*FEET_PER_METER
      });
    }
  }

  return points.slice(0, count);
}

function freeCoverageSeed(count, room, clearanceM) {
  const samples = makeOptimizationSamples(room, Math.max(650, count * 18));
  const candidates = samples
    .filter(p => distanceToRoomBoundaryMeters(p.xM,p.yM,room) >= clearanceM * 0.65)
    .map(p => ({x:p.xM*FEET_PER_METER,y:p.yM*FEET_PER_METER}));
  return chooseSpreadSubset(candidates, count, room, samples);
}


function medianNumber(values) {
  if (!values?.length) return 0;
  const arr = values.slice().sort((a,b)=>a-b);
  const m = Math.floor(arr.length/2);
  return arr.length % 2 ? arr[m] : (arr[m-1]+arr[m])/2;
}

function balancedAllocationVariants(count, rows) {
  if (rows < 1 || rows > count) return [];
  const base = Math.floor(count / rows);
  const remainder = count % rows;
  if (base < 1) return [];

  if (remainder === 0) {
    return [Array(rows).fill(base)];
  }

  const variants = [];
  const center = (rows - 1) / 2;

  // Varianta A: delší řady co nejvíc symetricky kolem středu.
  const centeredOrder = [...Array(rows).keys()]
    .sort((a,b) => Math.abs(a-center)-Math.abs(b-center) || a-b);
  const centered = Array(rows).fill(base);
  centeredOrder.slice(0,remainder).forEach(i => centered[i]++);
  variants.push(centered);

  // Varianta B: delší řady rovnoměrně rozprostřené.
  const spread = Array(rows).fill(base);
  const used = new Set();
  for (let k=0; k<remainder; k++) {
    let i = Math.round((k + 0.5) * rows / remainder - 0.5);
    i = Math.max(0,Math.min(rows-1,i));
    while (used.has(i) && i < rows-1) i++;
    while (used.has(i) && i > 0) i--;
    used.add(i);
    spread[i]++;
  }
  if (spread.join(",") !== centered.join(",")) variants.push(spread);

  return variants;
}

function structuredPatternPoints(allocations, staggerRows = false, rowPitch = 1) {
  const rows = allocations.length;
  const points = [];
  const equalRows = allocations.every(v => v === allocations[0]);

  for (let r=0; r<rows; r++) {
    const n = allocations[r];
    const y = (r - (rows-1)/2) * rowPitch;
    const extraShift = staggerRows && equalRows
      ? ((r % 2) ? 0.25 : -0.25)
      : 0;

    for (let c=0; c<n; c++) {
      points.push({
        ux: c - (n-1)/2 + extraShift,
        uy: y
      });
    }
  }

  // Přesné vystředění celé struktury.
  const cx = points.reduce((s,p)=>s+p.ux,0)/points.length;
  const cy = points.reduce((s,p)=>s+p.uy,0)/points.length;
  return points.map(p => ({ux:p.ux-cx, uy:p.uy-cy}));
}

function transformedUnitPattern(pattern, angleDeg) {
  const a = angleDeg*Math.PI/180;
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  return pattern.map(p => ({
    ux:p.ux*ca-p.uy*sa,
    uy:p.ux*sa+p.uy*ca
  }));
}

function maxScaleForPattern(pattern, room, centroid, clearanceM) {
  let maxScale = Infinity;

  for (const p of pattern) {
    if (p.ux < -1e-8) {
      maxScale = Math.min(
        maxScale,
        Math.max(0,centroid.xM-clearanceM)/(-p.ux)
      );
    } else if (p.ux > 1e-8) {
      maxScale = Math.min(
        maxScale,
        Math.max(0,room.widthM-centroid.xM-clearanceM)/p.ux
      );
    }

    if (p.uy < -1e-8) {
      maxScale = Math.min(
        maxScale,
        Math.max(0,centroid.yM-clearanceM)/(-p.uy)
      );
    } else if (p.uy > 1e-8) {
      maxScale = Math.min(
        maxScale,
        Math.max(0,room.lengthM-centroid.yM-clearanceM)/p.uy
      );
    }
  }

  return Number.isFinite(maxScale) ? maxScale : 0;
}


function naturalRectangleLatticeScale(pattern, room, angleDeg, rowPitch) {
  const transformed = transformedUnitPattern(pattern,angleDeg);
  const xs = transformed.map(p=>p.ux);
  const ys = transformed.map(p=>p.uy);
  const rangeX = Math.max(...xs)-Math.min(...xs);
  const rangeY = Math.max(...ys)-Math.min(...ys);

  const a = angleDeg*Math.PI/180;
  const ca = Math.cos(a);
  const sa = Math.sin(a);

  // Obálka jedné buňky sítě. Díky jejímu přičtení zůstává mezi
  // krajním reproduktorem a stěnou přibližně polovina běžné rozteče.
  const cellEnvelopeX =
    Math.abs(ca)+Math.abs(rowPitch*sa);
  const cellEnvelopeY =
    Math.abs(sa)+Math.abs(rowPitch*ca);

  const scaleX =
    room.widthM/Math.max(0.1,rangeX+cellEnvelopeX);
  const scaleY =
    room.lengthM/Math.max(0.1,rangeY+cellEnvelopeY);

  return Math.min(scaleX,scaleY);
}

function materializeLatticePattern({
  pattern,
  room,
  clearanceM,
  fillFactor,
  angleDeg,
  method,
  alignmentWeight,
  rowPitch,
  allowNudges
}) {
  const samples = makeOptimizationSamples(room,180);
  const centroid = roomSampleCentroid(room,samples);
  const transformed = transformedUnitPattern(pattern,angleDeg);

  // Obdélník: přirozené centrování po buňkách.
  // Krajní reproduktory mají být přibližně 1/2 rozteče od stěny,
  // nikoli roztažené téměř na obvod místnosti.
  const baseScale =
    room.shape === "rectangle"
      ? naturalRectangleLatticeScale(
          pattern,room,angleDeg,rowPitch
        )
      : maxScaleForPattern(
          transformed,room,centroid,clearanceM
        );

  const scale = baseScale*fillFactor;
  if (!(scale > 0.05)) return null;

  const placements = [];
  let nudgedCount = 0;

  for (const p of transformed) {
    let xM = centroid.xM+p.ux*scale;
    let yM = centroid.yM+p.uy*scale;

    const legal =
      isPointInsideRoomMeters(xM,yM,room) &&
      distanceToRoomBoundaryMeters(xM,yM,room) >= clearanceM*0.72;

    if (!legal) {
      if (!allowNudges || room.shape === "rectangle") return null;
      if (nudgedCount >= 3) return null;

      const q = clampPointToRoomWithClearance(
        xM,yM,room,clearanceM*0.82
      );
      xM = q.xM;
      yM = q.yM;
      nudgedCount++;

      if (!isPointInsideRoomMeters(xM,yM,room)) return null;
    }

    placements.push({
      x:xM*FEET_PER_METER,
      y:yM*FEET_PER_METER
    });
  }

  const clean = dedupePlacementPoints(placements,0.18);
  if (clean.length !== placements.length) return null;

  const latticeRatio = Math.max(
    Math.abs(rowPitch),
    1/Math.max(0.01,Math.abs(rowPitch))
  );

  return {
    placements:clean,
    method:nudgedCount
      ? `${method} • ${nudgedCount} lokální korekce`
      : method,
    alignmentWeight,
    clearanceM,
    latticeRatio,
    latticeAngleDeg:angleDeg,
    latticeSpacingM:scale,
    nudgedCount,
    isStructuredLattice:true
  };
}
function structuredLatticeCandidatesForCount(
  count,
  room,
  clearanceM,
  mode,
  quality = "full"
) {
  if (count < 1) return [];

  const aspect = Math.max(0.2,room.widthM/Math.max(0.2,room.lengthM));
  const estimatedRows = Math.max(
    1,
    Math.round(Math.sqrt(count/Math.max(0.2,aspect)))
  );

  const rowRadius = quality === "coarse" ? 1 : 2;
  const rowValues = new Set();
  for (
    let rows=Math.max(1,estimatedRows-rowRadius);
    rows<=Math.min(count,estimatedRows+rowRadius);
    rows++
  ) {
    rowValues.add(rows);
  }

  // Přidáme nejbližší skutečné dělitele – čisté obdélníkové mřížky
  // jsou pro obdélník velmi cenné.
  for (let rows=1; rows<=Math.sqrt(count); rows++) {
    if (count%rows === 0) {
      rowValues.add(rows);
      rowValues.add(count/rows);
    }
  }

  const angles =
    mode === "regular"
      ? [0]
      : mode === "balanced"
        ? (quality === "coarse" ? [0,45] : [0,30,45,60])
        : (quality === "coarse" ? [0,30,60] : [0,15,30,45,60,75]);

  const styles =
    mode === "regular"
      ? [
          {stagger:false,rowPitch:1,method:"Pevná mřížka X/Y",weight:4.0}
        ]
      : [
          {stagger:false,rowPitch:1,method:"Pravoúhlá mřížka",weight:3.5},
          {stagger:true,rowPitch:0.866,method:"Posunutá hexagonální mřížka",weight:3.7}
        ];

  const fillFactors =
    room.shape === "rectangle"
      ? (
          quality === "coarse"
            ? [0.90,1.0]
            : [0.84,0.92,0.97,1.0]
        )
      : (
          quality === "coarse"
            ? [0.84,0.96]
            : [0.76,0.86,0.95,1.0]
        );

  const generated = [];

  for (const rows of [...rowValues].sort((a,b)=>a-b)) {
    const allocationVariants = balancedAllocationVariants(count,rows);

    for (const allocations of allocationVariants) {
      // U obdélníku nechceme v režimu Vyvážené chaotické neúplné řady.
      // Rozdíl počtu bodů mezi řadami smí být maximálně jeden.
      if (
        room.shape === "rectangle" &&
        Math.max(...allocations)-Math.min(...allocations) > 1
      ) continue;

      for (const style of styles) {
        const pattern = structuredPatternPoints(
          allocations,
          style.stagger,
          style.rowPitch
        );

        for (const angle of angles) {
          for (const fillFactor of fillFactors) {
            const candidate = materializeLatticePattern({
              pattern,
              room,
              clearanceM,
              fillFactor,
              angleDeg:angle,
              method:
                angle === 0
                  ? style.method
                  : `${style.method} ${angle}°`,
              alignmentWeight:style.weight,
              rowPitch:style.rowPitch,
              allowNudges:room.shape !== "rectangle" && mode !== "regular"
            });

            if (!candidate) continue;

            // Vyvážené nikdy nepřipustí výrazně deformovanou základní síť.
            if (mode === "balanced" && candidate.latticeRatio > 1.45) continue;

            const geometry = placementGeometryScore(
              candidate.placements,
              room,
              makeOptimizationSamples(room,quality==="coarse"?120:180),
              clearanceM
            );

            generated.push({
              ...candidate,
              latticeGeometryScore:geometry
            });
          }
        }
      }
    }
  }

  // Zachováme různé geometrické rodiny, ne jen několik téměř totožných
  // kandidátů z jedné rodiny.
  generated.sort((a,b)=>a.latticeGeometryScore-b.latticeGeometryScore);
  const limit = quality === "coarse"
    ? (mode === "coverage" ? 8 : 7)
    : (mode === "coverage" ? 18 : 14);

  const selected = [];
  const seen = new Set();

  for (const candidate of generated) {
    const family = [
      candidate.method.replace(/\d+°/g,"ANGLE"),
      Math.round(candidate.latticeAngleDeg/15)*15,
      candidate.nudgedCount
    ].join("|");

    const locationKey = candidate.placements
      .map(p=>`${(p.x/FEET_PER_METER).toFixed(1)},${(p.y/FEET_PER_METER).toFixed(1)}`)
      .sort()
      .join(";");

    const key = `${family}|${locationKey}`;
    if (seen.has(key)) continue;
    seen.add(key);
    selected.push(candidate);
    if (selected.length >= limit) break;
  }

  return selected;
}

function weakestCoverageSample({
  placements,room,mountingHeightFt,listenerHeightFt,speaker,tap
}) {
  const samples = makeOptimizationSamples(room,180);
  let weakest = null;

  for (const p of samples) {
    const spl = calculateSPLAtPoint({
      xFt:p.xM*FEET_PER_METER,
      yFt:p.yM*FEET_PER_METER,
      listenerHeightFt,
      placements,
      mountingHeightFt,
      speaker,
      tap
    });
    if (!weakest || spl < weakest.spl) {
      weakest = {...p,spl};
    }
  }
  return weakest;
}

function balancedCandidateQuality(acoustic,geometry,alignmentWeight=0) {
  return (
    acoustic.tolerancePct*2.0 -
    acoustic.spread*1.2 -
    acoustic.largestHolePct*7.0 -
    Math.max(0,acoustic.spacingBalanceRatio-1.25)*18 -
    geometry*1.0 +
    alignmentWeight*3.0
  );
}

function tryLimitedBalancedNudges(candidate,args,tap,toleranceDb) {
  if (
    !candidate ||
    args.room.shape === "rectangle" ||
    !candidate.isStructuredLattice
  ) return candidate;

  let current = {
    ...candidate,
    placements:candidate.placements.map(p=>({...p}))
  };
  let moved = 0;
  const movedIndices = new Set();

  for (let attempt=0; attempt<3; attempt++) {
    const weak = weakestCoverageSample({
      placements:current.placements,
      room:args.room,
      mountingHeightFt:args.mountingHeightFt,
      listenerHeightFt:args.listenerHeightFt,
      speaker:args.speaker,
      tap
    });
    if (!weak) break;

    let nearestIndex = -1;
    let nearestDistance = Infinity;
    for (let i=0; i<current.placements.length; i++) {
      if (movedIndices.has(i)) continue;
      const p = current.placements[i];
      const d = Math.hypot(
        p.x/FEET_PER_METER-weak.xM,
        p.y/FEET_PER_METER-weak.yM
      );
      if (d < nearestDistance) {
        nearestDistance=d;
        nearestIndex=i;
      }
    }
    if (nearestIndex < 0) break;

    const proposal = current.placements.map(p=>({...p}));
    const original = proposal[nearestIndex];
    const ox = original.x/FEET_PER_METER;
    const oy = original.y/FEET_PER_METER;
    const moveFraction = 0.22;

    const q = clampPointToRoomWithClearance(
      ox+(weak.xM-ox)*moveFraction,
      oy+(weak.yM-oy)*moveFraction,
      args.room,
      current.clearanceM*0.80
    );
    proposal[nearestIndex] = {
      x:q.xM*FEET_PER_METER,
      y:q.yM*FEET_PER_METER
    };

    const acoustic = quickAcousticMetrics({
      placements:proposal,
      room:args.room,
      mountingHeightFt:args.mountingHeightFt,
      listenerHeightFt:args.listenerHeightFt,
      speaker:args.speaker,
      tap,
      targetSPL:args.targetSPL,
      toleranceDb,
      sampleCount:220
    });

    const geometry = placementGeometryScore(
      proposal,args.room,makeOptimizationSamples(args.room,180),current.clearanceM
    );

    const oldQuality = balancedCandidateQuality(
      current.acoustic,current.geometryScore,current.alignmentWeight
    );
    const newQuality = balancedCandidateQuality(
      acoustic,geometry,current.alignmentWeight
    );

    // Posun přijmeme jen při skutečném zlepšení a bez rozpadu sítě.
    if (
      newQuality > oldQuality+0.8 &&
      acoustic.spacingBalanceRatio <= 1.65
    ) {
      current = {
        ...current,
        placements:proposal,
        acoustic,
        geometryScore:geometry
      };
      movedIndices.add(nearestIndex);
      moved++;
    } else {
      movedIndices.add(nearestIndex);
    }
  }

  if (moved) {
    current.method = `${candidate.method} • akustická korekce ${moved} repro`;
    current.nudgedCount = (candidate.nudgedCount||0)+moved;
  }
  return current;
}

function buildLayoutCandidates(count, coverage, room, mode, quality = "full") {
  const clearanceM = recommendedWallClearanceMeters(coverage,room);
  const cacheKey = [
    "lattice-v115",
    roomGeometryCacheKey(room),
    `count=${count}`,
    `mode=${mode}`,
    `quality=${quality}`,
    `spacing=${Number(coverage.targetSpacing||0).toFixed(3)}`,
    `clearance=${clearanceM.toFixed(3)}`
  ].join(";");

  const cached = LAYOUT_CANDIDATE_CACHE.get(cacheKey);
  if (cached) return cached;

  const result = structuredLatticeCandidatesForCount(
    count,room,clearanceM,mode,quality
  );

  if (mode === "coverage") {
    // Akustické optimum vznikne uvolněním několika nejlepších CELÝCH sítí.
    // Síť tedy není výsledkem náhodného výběru jednotlivých bodů.
    const seeds = result
      .slice(0,quality==="coarse"?4:7)
      .map(c=>c.placements);

    const freeSeed = freeCoverageSeed(count,room,clearanceM);
    if (freeSeed?.length === count) seeds.push(freeSeed);

    const seen = new Set();
    const freeCandidates = [];
    const iterations = quality === "coarse" ? 5 : 9;

    for (const seed of seeds) {
      const key = seed
        .map(p=>`${(p.x/FEET_PER_METER).toFixed(2)},${(p.y/FEET_PER_METER).toFixed(2)}`)
        .sort()
        .join("|");
      if (seen.has(key)) continue;
      seen.add(key);

      const placements = relaxPlacements(
        seed,room,iterations,0.80,clearanceM*0.70
      );
      if (placements.length !== count) continue;

      freeCandidates.push({
        placements,
        method:"Volné akustické optimum",
        alignmentWeight:0,
        clearanceM,
        latticeRatio:null,
        latticeAngleDeg:null,
        latticeSpacingM:null,
        nudgedCount:0,
        isStructuredLattice:false
      });
    }

    result.push(...freeCandidates);
  }

  cacheSetLimited(LAYOUT_CANDIDATE_CACHE,cacheKey,result,90);
  return result;
}

function placementSpacingBalanceMetrics(placements) {
  if (!placements || placements.length < 3) {
    return {spacingBalanceRatio:1, nearestMedianM:0};
  }

  const first = [];
  const structural = [];

  for (let i=0; i<placements.length; i++) {
    const distances = [];
    for (let j=0; j<placements.length; j++) {
      if (i === j) continue;
      distances.push(Math.hypot(
        (placements[i].x - placements[j].x) / FEET_PER_METER,
        (placements[i].y - placements[j].y) / FEET_PER_METER
      ));
    }
    distances.sort((a,b)=>a-b);
    if (!distances.length) continue;

    first.push(distances[0]);

    // Třetí soused (nebo nejvzdálenější dostupný u malého počtu)
    // odhalí případ, kdy jsou repro namačkaná v dlouhých řadách,
    // ale mezi řadami vznikají velké mezery.
    const structuralIndex = Math.min(distances.length - 1, 2);
    structural.push(distances[structuralIndex]);
  }

  const median = arr => {
    if (!arr.length) return 0;
    const a = arr.slice().sort((x,y)=>x-y);
    const m = Math.floor(a.length/2);
    return a.length % 2 ? a[m] : (a[m-1]+a[m])/2;
  };

  const nearestMedianM = median(first);
  const structuralMedianM = median(structural);
  const spacingBalanceRatio = nearestMedianM > 0
    ? structuralMedianM / nearestMedianM
    : 1;

  return {spacingBalanceRatio, nearestMedianM};
}

function calculateToleranceTopology({
  placements,
  room,
  mountingHeightFt,
  listenerHeightFt,
  speaker,
  tap,
  toleranceDb,
  targetSPL,
  sampleCount = 220
}) {
  const aspect = Math.max(0.15, room.widthM / Math.max(0.15, room.lengthM));
  let nx = Math.max(8, Math.round(Math.sqrt(sampleCount * aspect)));
  let ny = Math.max(8, Math.round(sampleCount / nx));
  nx = Math.min(nx, 34);
  ny = Math.min(ny, 34);

  const cells = new Map();
  const values = [];
  let linear = 0;
  let min = Infinity;
  let max = -Infinity;

  for (let iy=0; iy<ny; iy++) {
    const yM = room.lengthM * (iy + 0.5) / ny;
    for (let ix=0; ix<nx; ix++) {
      const xM = room.widthM * (ix + 0.5) / nx;
      if (!isPointInsideRoomMeters(xM,yM,room)) continue;

      const spl = calculateSPLAtPoint({
        xFt:xM*FEET_PER_METER,
        yFt:yM*FEET_PER_METER,
        listenerHeightFt,
        placements,
        mountingHeightFt,
        speaker,
        tap
      });

      cells.set(`${ix},${iy}`, {ix,iy,spl});
      values.push(spl);
      linear += Math.pow(10,spl/10);
      min = Math.min(min,spl);
      max = Math.max(max,spl);
    }
  }

  if (!values.length) {
    return {
      average:0,min:0,max:0,spread:Infinity,tolerancePct:0,
      targetDeficit:Infinity,minTargetDeficit:Infinity,
      largestHolePct:100,outsideComponents:1
    };
  }

  const average = 10*Math.log10(linear/values.length);
  const outside = new Set();
  for (const [key,cell] of cells) {
    if (Math.abs(cell.spl-average) > toleranceDb) outside.add(key);
  }

  const visited = new Set();
  let largest = 0;
  let components = 0;
  const directions = [[1,0],[-1,0],[0,1],[0,-1]];

  for (const key of outside) {
    if (visited.has(key)) continue;
    components++;
    const [sx,sy] = key.split(",").map(Number);
    const stack = [[sx,sy]];
    visited.add(key);
    let size = 0;

    while (stack.length) {
      const [x,y] = stack.pop();
      size++;
      for (const [dx,dy] of directions) {
        const nk = `${x+dx},${y+dy}`;
        if (outside.has(nk) && !visited.has(nk)) {
          visited.add(nk);
          stack.push([x+dx,y+dy]);
        }
      }
    }
    largest = Math.max(largest,size);
  }

  const tolerancePct = (values.length-outside.size)/values.length*100;
  const largestHolePct = largest/values.length*100;

  return {
    average,min,max,spread:max-min,tolerancePct,
    targetDeficit:Math.max(0,targetSPL-average),
    minTargetDeficit:Math.max(0,targetSPL-6-min),
    largestHolePct,
    outsideComponents:components
  };
}

function balancedLayoutPasses(layout, targetSPL) {
  if (!layout?.acoustic) return false;
  return (
    layout.acoustic.tolerancePct >= 95 &&
    layout.acoustic.average >= targetSPL - 1.5 &&
    layout.acoustic.min >= targetSPL - 7 &&
    layout.acoustic.largestHolePct <= 2.0 &&
    layout.acoustic.spacingBalanceRatio <= 1.85
  );
}

function quickAcousticMetrics({
  placements,
  room,
  mountingHeightFt,
  listenerHeightFt,
  speaker,
  tap,
  targetSPL,
  toleranceDb = 3,
  sampleCount = 220
}) {
  const topology = calculateToleranceTopology({
    placements,
    room,
    mountingHeightFt,
    listenerHeightFt,
    speaker,
    tap,
    toleranceDb,
    targetSPL,
    sampleCount
  });

  const spacing = placementSpacingBalanceMetrics(placements);

  return {
    ...topology,
    ...spacing
  };
}

function getEvaluationTap({
  count,
  coverage,
  speaker,
  targetSPL,
  ambientNoise,
  useCase,
  voltage,
  requestedTap
}) {
  const effectiveCoverage = {...coverage, count};
  const power = calculatePower({
    speaker,
    targetSPL,
    ambientNoise,
    useCase,
    voltage
  }, effectiveCoverage);

  const availableTaps = getAvailableTapsForSpeaker(speaker, voltage);
  const manualTap = requestedTap !== "auto" ? numValue(requestedTap, NaN) : NaN;
  const tap = Number.isFinite(manualTap) && availableTaps.includes(manualTap)
    ? manualTap
    : power.recommendedTap;

  return {tap, power};
}


function isFreeCoverageCandidate(candidate) {
  return candidate?.method === "Volné akustické optimum";
}

function coverageAcousticQuality(acoustic) {
  if (!acoustic) return -Infinity;
  return (
    acoustic.tolerancePct*2.4 -
    acoustic.spread*1.55 -
    acoustic.largestHolePct*4.0 -
    acoustic.targetDeficit*6.0 -
    acoustic.minTargetDeficit*2.8
  );
}

function alignedCoverageIsNearFree(aligned,free) {
  if (!aligned?.acoustic || !free?.acoustic) return false;

  return (
    free.acoustic.tolerancePct-aligned.acoustic.tolerancePct <= 1.0 &&
    aligned.acoustic.spread-free.acoustic.spread <= 0.55 &&
    aligned.acoustic.largestHolePct-free.acoustic.largestHolePct <= 0.75 &&
    free.acoustic.average-aligned.acoustic.average <= 0.45 &&
    free.acoustic.min-aligned.acoustic.min <= 0.9
  );
}

function alignedCoveragePreference(candidate) {
  if (!candidate?.acoustic) return -Infinity;
  return (
    candidate.alignmentWeight*10 -
    candidate.acoustic.largestHolePct*4 -
    Math.max(0,candidate.acoustic.spacingBalanceRatio-1.2)*8 +
    candidate.acoustic.tolerancePct*0.35 -
    candidate.acoustic.spread*0.35 -
    (candidate.nudgedCount||0)*1.5
  );
}

function selectBestLayoutForCount(args) {
  const {
    count,coverage,room,mode,speaker,targetSPL,
    ambientNoise,useCase,voltage,mountingHeightFt,
    listenerHeightFt,requestedTap="auto",quality="full"
  } = args;

  const candidates = buildLayoutCandidates(
    count,coverage,room,mode,quality
  );
  if (!candidates.length) return null;

  const {tap} = getEvaluationTap({
    count,coverage,speaker,targetSPL,ambientNoise,useCase,voltage,requestedTap
  });

  const toleranceDb = Number(coverage.expectedSPLVariation)||3;
  const sampleCount = quality==="coarse"?130:240;
  const evaluated = [];

  for (const candidate of candidates) {
    const acoustic = quickAcousticMetrics({
      placements:candidate.placements,
      room,
      mountingHeightFt,
      listenerHeightFt,
      speaker,
      tap,
      targetSPL,
      toleranceDb,
      sampleCount
    });

    const geometryScore = placementGeometryScore(
      candidate.placements,
      room,
      makeOptimizationSamples(room,quality==="coarse"?130:200),
      candidate.clearanceM
    );

    let score;

    if (mode === "regular") {
      score =
        acoustic.tolerancePct*1.5 -
        acoustic.spread*1.1 -
        geometryScore*1.4 +
        candidate.alignmentWeight*3;
    } else if (mode === "balanced") {
      // Geometrie je zde základ, ne dodatečný bonus.
      const ratioPenalty = Math.pow(
        Math.max(0,acoustic.spacingBalanceRatio-1.25),1.5
      )*22;
      const holePenalty = Math.pow(
        Math.max(0,acoustic.largestHolePct-0.5),1.35
      )*9;

      score =
        acoustic.tolerancePct*1.9 -
        acoustic.spread*1.15 -
        acoustic.targetDeficit*5 -
        acoustic.minTargetDeficit*2.3 -
        geometryScore*1.0 -
        ratioPenalty -
        holePenalty +
        candidate.alignmentWeight*4.5 -
        (candidate.nudgedCount||0)*1.5;
    } else {
      // U Nejlepšího pokrytí tato hodnota hodnotí čistě akustiku.
      score = coverageAcousticQuality(acoustic);
    }

    evaluated.push({
      ...candidate,
      acoustic,
      geometryScore,
      score,
      evaluationTap:tap
    });
  }

  if (!evaluated.length) return null;

  if (mode === "regular") {
    return evaluated.slice().sort((a,b)=>b.score-a.score)[0];
  }

  if (mode === "balanced") {
    let best = evaluated
      .filter(c=>c.isStructuredLattice)
      .sort((a,b)=>b.score-a.score)[0];

    if (!best) return null;

    // U obdélníku je struktura absolutní: žádné individuální posuny.
    // U ostatních tvarů smíme akusticky korigovat maximálně tři body.
    if (room.shape !== "rectangle" && quality === "full") {
      best = tryLimitedBalancedNudges(
        best,args,tap,toleranceDb
      );
    }
    return best;
  }

  // NEJLEPŠÍ POKRYTÍ:
  // 1) absolutní volné akustické optimum,
  // 2) nejlepší celá geometrická síť se stejným počtem,
  // 3) síť vyhraje, pokud je akusticky prakticky stejná.
  const free = evaluated.filter(isFreeCoverageCandidate);
  const structured = evaluated.filter(c=>c.isStructuredLattice);

  const freeBest = (free.length?free:evaluated)
    .slice()
    .sort((a,b)=>coverageAcousticQuality(b.acoustic)-coverageAcousticQuality(a.acoustic))[0];

  const nearStructured = structured
    .filter(c=>alignedCoverageIsNearFree(c,freeBest))
    .sort((a,b)=>alignedCoveragePreference(b)-alignedCoveragePreference(a));

  if (nearStructured.length) {
    const chosen = nearStructured[0];
    return {
      ...chosen,
      method:`${chosen.method} • geometricky zarovnáno`,
      postAligned:true,
      freeReference:{
        tolerancePct:freeBest.acoustic.tolerancePct,
        spread:freeBest.acoustic.spread,
        largestHolePct:freeBest.acoustic.largestHolePct,
        average:freeBest.acoustic.average,
        min:freeBest.acoustic.min
      },
      freeAcoustic:freeBest.acoustic
    };
  }

  return {
    ...freeBest,
    postAligned:false,
    freeAcoustic:freeBest.acoustic
  };
}

function candidateCountsForRecommendation(coverage, room) {
  const spacingM = Math.max(
    0.25,
    coverage.targetSpacing / FEET_PER_METER
  );

  const areaBased = Math.max(
    1,
    Math.ceil(
      room.areaM2 / Math.max(0.25, spacingM * spacingM)
    )
  );

  const gridBased = Math.max(1, coverage.count);

  const reference = Math.max(
    1,
    Math.round(areaBased * 0.68 + gridBased * 0.32)
  );

  // Reference už neurčuje spodní hranici.
  // Je to pouze odhad, kam až má smysl hledat.
  const hi = Math.max(
    8,
    Math.ceil(reference * 1.65) + 4,
    gridBased + 4,
    areaBased + 4
  );

  const values = new Set();

  // Běžné instalace: testujeme KAŽDÝ počet od 1.
  if (hi <= 64) {
    for (let n = 1; n <= hi; n++) {
      values.add(n);
    }
  } else {
    // Velké haly:
    // 1) nízké počty 1–16 vždy souvisle,
    // 2) okolí reference souvisle,
    // 3) zbytek hrubším krokem.
    for (let n = 1; n <= Math.min(16, hi); n++) {
      values.add(n);
    }

    for (
      let n = Math.max(1, reference - 12);
      n <= Math.min(hi, reference + 14);
      n++
    ) {
      values.add(n);
    }

    const step = Math.max(2, Math.ceil(hi / 24));
    for (let n = 17; n <= hi; n += step) {
      values.add(n);
    }

    values.add(areaBased);
    values.add(gridBased);
    values.add(reference);
  }

  return [...values]
    .filter(n => n > 0)
    .sort((a,b) => a - b);
}


function circlePointInsideCoverageFootprints(xM, yM, placementsM, footprintRadiusM) {
  for (const p of placementsM) {
    if (Math.hypot(xM-p.xM, yM-p.yM) <= footprintRadiusM) return true;
  }
  return false;
}

function circleDesignCoveragePct(room, placements, coverage, sampleCount = 1400) {
  if (!placements?.length || room.shape !== "circle") return 0;

  const radiusM = room.diameterM/2;
  const footprintRadiusM =
    Math.max(0.05, (coverage.coverageDiameter/FEET_PER_METER)/2);

  const placementsM = placements.map(p => ({
    xM:p.x/FEET_PER_METER,
    yM:p.y/FEET_PER_METER
  }));

  // Deterministic polar sampling of the room area.
  let hit = 0;
  let total = 0;
  const rings = Math.max(10, Math.round(Math.sqrt(sampleCount/3)));

  for (let ir=0; ir<rings; ir++) {
    const rf = Math.sqrt((ir+0.5)/rings);
    const r = radiusM*rf;
    const circumferenceFactor = Math.max(8, Math.round(2*Math.PI*(ir+1)));

    for (let ia=0; ia<circumferenceFactor; ia++) {
      const a = (ia+0.5)/circumferenceFactor * Math.PI*2;
      const xM = radiusM + Math.cos(a)*r;
      const yM = radiusM + Math.sin(a)*r;
      total++;
      if (circlePointInsideCoverageFootprints(
        xM,yM,placementsM,footprintRadiusM
      )) hit++;
    }
  }

  return total ? hit/total*100 : 0;
}

function circlePlacementGeometryScore(room, placements, targetSpacingM) {
  if (!placements?.length) return Infinity;

  const radiusM = room.diameterM/2;
  const pts = placements.map(p => ({
    xM:p.x/FEET_PER_METER,
    yM:p.y/FEET_PER_METER
  }));

  const nearest = [];
  for (let i=0; i<pts.length; i++) {
    let best = Infinity;
    for (let j=0; j<pts.length; j++) {
      if (i===j) continue;
      best = Math.min(
        best,
        Math.hypot(
          pts[i].xM-pts[j].xM,
          pts[i].yM-pts[j].yM
        )
      );
    }
    if (Number.isFinite(best)) nearest.push(best);
  }

  if (!nearest.length) return 0;
  nearest.sort((a,b)=>a-b);
  const median = nearest[Math.floor(nearest.length/2)];
  const spread =
    (nearest[nearest.length-1]-nearest[0]) /
    Math.max(0.1,median);

  const spacingPenalty =
    Math.abs(median-targetSpacingM) /
    Math.max(0.1,targetSpacingM);

  let boundaryPenalty = 0;
  for (const p of pts) {
    const edge = radiusM-Math.hypot(
      p.xM-radiusM,
      p.yM-radiusM
    );
    if (edge < targetSpacingM*0.20) {
      boundaryPenalty +=
        (targetSpacingM*0.20-edge) /
        Math.max(0.1,targetSpacingM);
    }
  }

  return spread*2.0 + spacingPenalty + boundaryPenalty/pts.length;
}

function circleRingNeighborCount(radiusM, targetSpacingM) {
  if (!(radiusM > 0)) return 0;
  const ratio = Math.min(1, targetSpacingM / Math.max(0.0001, 2 * radiusM));
  if (ratio >= 1) return 3;
  return Math.max(3, Math.ceil(Math.PI / Math.asin(ratio)));
}

function buildCircleRingSpec(room, targetSpacingM, centerSpeaker) {
  const R = room.diameterM / 2;
  const preferredWallMarginM = targetSpacingM * 0.50;
  const outerRadiusM = Math.max(0, R - preferredWallMarginM);

  if (outerRadiusM < 0.05) {
    return {
      centerSpeaker: true,
      radiiM: [],
      counts: []
    };
  }

  // Rozdělíme poloměr tak, aby radiální rozteč nikdy nebyla větší než
  // rozteč referenční SSC mřížky a poslední prstenec zůstal cca S/2 od stěny.
  const ringCount = Math.max(1, Math.ceil(outerRadiusM / targetSpacingM));
  const radialPitchM = outerRadiusM / ringCount;
  const radiiM = [];
  const counts = [];

  for (let i = 1; i <= ringCount; i++) {
    const radiusM = radialPitchM * i;
    radiiM.push(radiusM);
    counts.push(circleRingNeighborCount(radiusM, targetSpacingM));
  }

  return { centerSpeaker, radiiM, counts };
}

function materializeCircleRingSpec(room, spec) {
  const R = room.diameterM / 2;
  const cx = R;
  const cy = R;
  const placements = [];

  if (spec.centerSpeaker) {
    placements.push({
      x: cx * FEET_PER_METER,
      y: cy * FEET_PER_METER
    });
  }

  for (let ringIndex = 0; ringIndex < spec.radiiM.length; ringIndex++) {
    const radiusM = spec.radiiM[ringIndex];
    const n = Math.max(3, Math.round(spec.counts[ringIndex] || 3));
    const phase = (ringIndex % 2) ? Math.PI / n : 0;

    for (let i = 0; i < n; i++) {
      const a = phase + i * 2 * Math.PI / n;
      placements.push({
        x: (cx + Math.cos(a) * radiusM) * FEET_PER_METER,
        y: (cy + Math.sin(a) * radiusM) * FEET_PER_METER
      });
    }
  }

  return placements;
}

function circleGeometryContribution(horizontalDistanceM, verticalDistanceM, coverageAngleDeg) {
  const horizontalFt = horizontalDistanceM * FEET_PER_METER;
  const verticalFt = verticalDistanceM * FEET_PER_METER;
  const attenuationDb = calculateOffAxisAttenuationDb(
    horizontalFt,
    verticalFt,
    coverageAngleDeg
  );
  const directivityLinear = Math.pow(10, attenuationDb / 10);
  const distanceSqM = Math.max(
    0.0001,
    horizontalDistanceM * horizontalDistanceM +
      verticalDistanceM * verticalDistanceM
  );
  return directivityLinear / distanceSqM;
}

function buildSscCircleGeometryReference(coverage, speaker) {
  const spacingXM = Math.max(0.05, coverage.spacingX / FEET_PER_METER);
  const spacingYM = Math.max(0.05, coverage.spacingY / FEET_PER_METER);
  const verticalDistanceM = Math.max(
    0.05,
    coverage.listenerDistance / FEET_PER_METER
  );
  const cornerHorizontalM = Math.hypot(spacingXM / 2, spacingYM / 2);
  const singleCornerContribution = circleGeometryContribution(
    cornerHorizontalM,
    verticalDistanceM,
    speaker?.coverageAngle || 180
  );

  return {
    spacingXM,
    spacingYM,
    verticalDistanceM,
    edgeDepthM: Math.max(0.05, Math.min(spacingXM, spacingYM) / 2),
    boundaryScore: singleCornerContribution,
    interiorScore: singleCornerContribution * 4
  };
}

function circleTopContributionsAtPoint(xM, yM, placementsM, reference, speaker, topN = 4) {
  const values = [];
  for (const p of placementsM) {
    const horizontalM = Math.hypot(xM - p.xM, yM - p.yM);
    values.push(circleGeometryContribution(
      horizontalM,
      reference.verticalDistanceM,
      speaker?.coverageAngle || 180
    ));
  }
  values.sort((a,b) => b-a);
  return values.slice(0, topN);
}

function evaluateCircleAgainstSscReference(
  room,
  placements,
  coverage,
  speaker,
  sampleQuality = "full"
) {
  if (!placements?.length || room.shape !== "circle") {
    return {
      passes:false,
      boundaryRatio:0,
      interiorRatio:0,
      transitionRatio:0,
      overallRatio:0
    };
  }

  const reference = buildSscCircleGeometryReference(coverage, speaker);
  const R = room.diameterM / 2;
  const cx = R;
  const cy = R;
  const placementsM = placements.map(p => ({
    xM: p.x / FEET_PER_METER,
    yM: p.y / FEET_PER_METER
  }));

  const boundarySamples = sampleQuality === "fast" ? 360 : 1080;
  let minBoundaryRatio = Infinity;

  // Okraj: srovnáváme s nejhorším rohem SSC, kde uvažujeme jeden
  // nejbližší reproduktor v diagonální vzdálenosti půl buňky X/Y.
  for (let i = 0; i < boundarySamples; i++) {
    const a = (i + 0.5) * 2 * Math.PI / boundarySamples;
    const xM = cx + Math.cos(a) * R;
    const yM = cy + Math.sin(a) * R;
    const nearest = circleTopContributionsAtPoint(
      xM,yM,placementsM,reference,speaker,1
    )[0] || 0;
    minBoundaryRatio = Math.min(
      minBoundaryRatio,
      nearest / Math.max(1e-12, reference.boundaryScore)
    );
  }

  const radialSamples = sampleQuality === "fast" ? 16 : 28;
  let minInteriorRatio = Infinity;
  let minTransitionRatio = Infinity;

  // Plocha: uvnitř porovnáváme čtyři nejsilnější geometrické příspěvky
  // se středem referenční SSC buňky (4 repro). V pásmu u stěny plynule
  // přecházíme od okrajové reference k vnitřní, aby nezůstala nekontrolovaná
  // mezera mezi obvodem a čistým interiérem.
  for (let ir = 0; ir < radialSamples; ir++) {
    const rf = Math.sqrt((ir + 0.5) / radialSamples);
    const r = R * rf;
    const angleSamples = Math.max(
      24,
      Math.round((sampleQuality === "fast" ? 42 : 72) * Math.max(0.25, rf))
    );

    for (let ia = 0; ia < angleSamples; ia++) {
      const a = (ia + 0.5) * 2 * Math.PI / angleSamples;
      const xM = cx + Math.cos(a) * r;
      const yM = cy + Math.sin(a) * r;
      const wallDistanceM = Math.max(0, R - r);
      const contributions = circleTopContributionsAtPoint(
        xM,yM,placementsM,reference,speaker,4
      );
      const top4 = contributions.reduce((sum,v) => sum + v, 0);

      const t = Math.max(
        0,
        Math.min(1, wallDistanceM / reference.edgeDepthM)
      );
      const requiredScore =
        reference.boundaryScore +
        (reference.interiorScore - reference.boundaryScore) * t;
      const transitionRatio = top4 / Math.max(1e-12, requiredScore);
      minTransitionRatio = Math.min(minTransitionRatio, transitionRatio);

      if (wallDistanceM >= reference.edgeDepthM - 1e-9) {
        const interiorRatio = top4 / Math.max(1e-12, reference.interiorScore);
        minInteriorRatio = Math.min(minInteriorRatio, interiorRatio);
      }
    }
  }

  if (!Number.isFinite(minInteriorRatio)) minInteriorRatio = minTransitionRatio;
  if (!Number.isFinite(minBoundaryRatio)) minBoundaryRatio = 0;
  if (!Number.isFinite(minTransitionRatio)) minTransitionRatio = 0;

  const overallRatio = Math.min(
    minBoundaryRatio,
    minInteriorRatio,
    minTransitionRatio
  );

  // Pouze numerická tolerance vzorkování. Návrhově požadujeme 100 % SSC reference.
  const passThreshold = 0.995;

  return {
    passes: overallRatio >= passThreshold,
    boundaryRatio:minBoundaryRatio,
    interiorRatio:minInteriorRatio,
    transitionRatio:minTransitionRatio,
    overallRatio,
    reference
  };
}

function optimizeCircleRingSpecAgainstSsc(room, spec, coverage, speaker) {
  let currentSpec = {
    centerSpeaker:Boolean(spec.centerSpeaker),
    radiiM:spec.radiiM.slice(),
    counts:spec.counts.slice()
  };
  let currentPlacements = materializeCircleRingSpec(room, currentSpec);
  let currentBenchmark = evaluateCircleAgainstSscReference(
    room,currentPlacements,coverage,speaker,"full"
  );

  if (!currentBenchmark.passes) return null;

  let changed = true;
  while (changed) {
    changed = false;
    const proposals = [];

    if (currentSpec.centerSpeaker) {
      proposals.push({
        centerSpeaker:false,
        radiiM:currentSpec.radiiM.slice(),
        counts:currentSpec.counts.slice()
      });
    }

    for (let i = 0; i < currentSpec.counts.length; i++) {
      if (currentSpec.counts[i] <= 3) continue;
      const next = {
        centerSpeaker:currentSpec.centerSpeaker,
        radiiM:currentSpec.radiiM.slice(),
        counts:currentSpec.counts.slice()
      };
      next.counts[i] -= 1;
      proposals.push(next);
    }

    // Zkusíme i odebrat celý vnitřní prstenec. Pokud geometrie stále projde,
    // může to u některých rozměrů ušetřit několik kusů bez zhoršení vůči SSC.
    if (currentSpec.radiiM.length > 1) {
      proposals.push({
        centerSpeaker:currentSpec.centerSpeaker,
        radiiM:currentSpec.radiiM.slice(1),
        counts:currentSpec.counts.slice(1)
      });
    }

    let best = null;
    for (const proposal of proposals) {
      const placements = materializeCircleRingSpec(room, proposal);
      const benchmark = evaluateCircleAgainstSscReference(
        room,placements,coverage,speaker,"full"
      );
      if (!benchmark.passes) continue;

      const option = {
        spec:proposal,
        placements,
        benchmark,
        count:placements.length
      };

      if (
        !best ||
        option.count < best.count ||
        (
          option.count === best.count &&
          option.benchmark.overallRatio > best.benchmark.overallRatio
        )
      ) best = option;
    }

    if (best && best.count < currentPlacements.length) {
      currentSpec = best.spec;
      currentPlacements = best.placements;
      currentBenchmark = best.benchmark;
      changed = true;
    }
  }

  return {
    spec:currentSpec,
    placements:currentPlacements,
    benchmark:currentBenchmark
  };
}

function generateCircleRingFamily(room, targetSpacingM, centerSpeaker) {
  const spec = buildCircleRingSpec(room, targetSpacingM, centerSpeaker);
  return materializeCircleRingSpec(room, spec);
}

function generateCircleRowFamily(room, targetSpacingM, angleDeg) {
  const R = room.diameterM/2;
  const cx = R;
  const cy = R;
  const a = angleDeg*Math.PI/180;
  const ca = Math.cos(a);
  const sa = Math.sin(a);

  const placements = [];
  const limit = R-targetSpacingM*0.30;

  // Čtvercová síť o zadané rozteči, vycentrovaná na střed kruhu.
  const n = Math.ceil((2*R)/targetSpacingM)+2;

  for (let iy=-n; iy<=n; iy++) {
    for (let ix=-n; ix<=n; ix++) {
      const ux = ix*targetSpacingM;
      const uy = iy*targetSpacingM;

      const rx = ux*ca-uy*sa;
      const ry = ux*sa+uy*ca;

      if (Math.hypot(rx,ry) <= limit+1e-6) {
        placements.push({
          x:(cx+rx)*FEET_PER_METER,
          y:(cy+ry)*FEET_PER_METER
        });
      }
    }
  }

  return placements;
}

function buildCircleCoverageDesignCandidates(room, coverage, speaker) {
  // v0.133: SSC fitted spacing is the reference geometry. Circular layouts may
  // use fewer speakers only if every sampled point remains at least as good
  // as the corresponding SSC interior/edge reference.
  const targetSpacingM = Math.max(
    0.15,
    Math.min(coverage.spacingX, coverage.spacingY) / FEET_PER_METER
  );

  const candidates = [];

  for (const centerSpeaker of [true,false]) {
    const baseSpec = buildCircleRingSpec(room, targetSpacingM, centerSpeaker);
    const optimized = optimizeCircleRingSpecAgainstSsc(
      room,baseSpec,coverage,speaker
    );
    if (!optimized?.placements?.length) continue;

    const benchmark = optimized.benchmark;
    candidates.push({
      method:centerSpeaker
        ? "Kruhové prstence • SSC benchmark"
        : "Kruhové prstence bez středu • SSC benchmark",
      family:centerSpeaker ? "rings-center" : "rings-no-center",
      placements:optimized.placements,
      ringSpec:optimized.spec,
      count:optimized.placements.length,
      sscBenchmark:benchmark,
      designCoveragePct:circleDesignCoveragePct(
        room,optimized.placements,coverage
      ),
      geometryScore:circlePlacementGeometryScore(
        room,optimized.placements,targetSpacingM
      )
    });
  }

  return candidates;
}


function scaleCircleRingPlacements(room, placements, scale) {
  const R = room.diameterM/2;
  const cx = R;
  const cy = R;

  return placements.map(p => {
    const xM = p.x/FEET_PER_METER;
    const yM = p.y/FEET_PER_METER;
    const dx = xM-cx;
    const dy = yM-cy;
    const radius = Math.hypot(dx,dy);

    // Středový reproduktor zůstává přesně ve středu.
    if (radius < 1e-6) return {...p};

    return {
      x:(cx+dx*scale)*FEET_PER_METER,
      y:(cy+dy*scale)*FEET_PER_METER
    };
  });
}

function optimizeCircleRingRadius(
  candidate,
  room,
  coverage,
  acousticContext
) {
  if (
    !candidate?.placements?.length ||
    !["rings-center","rings-no-center"].includes(candidate.family) ||
    !acousticContext?.speaker
  ) return candidate;

  const R = room.diameterM/2;
  const targetSpacingM = Math.max(
    0.15,
    coverage.targetSpacing/FEET_PER_METER
  );

  const radii = candidate.placements
    .map(p => Math.hypot(
      p.x/FEET_PER_METER-R,
      p.y/FEET_PER_METER-R
    ))
    .filter(r => r > 1e-6);

  if (!radii.length) return candidate;

  const currentOuterRadiusM = Math.max(...radii);

  // Krajní reproduktory držíme výrazněji od stěny, aby zbytečně
  // nevyzařovaly velkou část energie mimo místnost. Odstup je
  // odvozený od návrhové rozteče, takže se škáluje s pokrytím.
  const minimumWallMarginM = Math.max(
    0.40,
    targetSpacingM*0.35
  );
  const maximumOuterRadiusM = Math.max(
    currentOuterRadiusM,
    R-minimumWallMarginM
  );
  const maximumScale = Math.max(
    1,
    maximumOuterRadiusM/
      Math.max(0.01,currentOuterRadiusM)
  );

  const rawScales = [
    0.88,0.94,0.98,1.00,
    1.04,1.08,1.12,1.16,1.20,
    maximumScale
  ];

  const scales = [...new Set(
    rawScales
      .map(v => Math.min(maximumScale,v))
      .filter(v => v >= 0.80 && v <= maximumScale+1e-6)
      .map(v => Number(v.toFixed(4)))
  )].sort((a,b)=>a-b);

  const {tap} = getEvaluationTap({
    count:candidate.placements.length,
    coverage,
    speaker:acousticContext.speaker,
    targetSPL:acousticContext.targetSPL,
    ambientNoise:acousticContext.ambientNoise,
    useCase:acousticContext.useCase,
    voltage:acousticContext.voltage,
    requestedTap:acousticContext.requestedTap
  });

  const toleranceDb = Number(
    coverage.expectedSPLVariation
  ) || 3;

  const baselineCoverage = Number(
    candidate.designCoveragePct
  ) || 0;

  const allowedCoverageLoss =
    baselineCoverage >= 99.5
      ? 0.10
      : 0.20;

  const variants = [];

  for (const scale of scales) {
    const placements = scaleCircleRingPlacements(
      room,
      candidate.placements,
      scale
    );

    // Bezpečnostní kontrola okraje.
    const outerRadiusM = Math.max(
      ...placements.map(p => Math.hypot(
        p.x/FEET_PER_METER-R,
        p.y/FEET_PER_METER-R
      ))
    );
    if (outerRadiusM > R-minimumWallMarginM+1e-6) {
      continue;
    }

    const designCoveragePct = circleDesignCoveragePct(
      room,
      placements,
      coverage
    );

    // Coverage se nesmí prakticky zhoršit.
    if (
      designCoveragePct <
      baselineCoverage-allowedCoverageLoss
    ) {
      continue;
    }

    const acoustic = quickAcousticMetrics({
      placements,
      room,
      mountingHeightFt:acousticContext.mountingHeightFt,
      listenerHeightFt:acousticContext.listenerHeightFt,
      speaker:acousticContext.speaker,
      tap,
      targetSPL:acousticContext.targetSPL,
      toleranceDb,
      sampleCount:420
    });

    variants.push({
      scale,
      placements,
      designCoveragePct,
      acoustic
    });
  }

  if (!variants.length) return candidate;

  // Coverage je vstupní podmínka. Potom chceme zvednout nejslabší místa,
  // zmenšit rozdíl max–min a teprve poté zvýšit průměrné SPL.
  variants.sort((a,b) =>
    b.acoustic.min-a.acoustic.min ||
    a.acoustic.spread-b.acoustic.spread ||
    b.acoustic.average-a.acoustic.average ||
    b.designCoveragePct-a.designCoveragePct ||
    Math.abs(a.scale-1)-Math.abs(b.scale-1)
  );

  const best = variants[0];
  const scalePct = (best.scale-1)*100;

  return {
    ...candidate,
    placements:best.placements,
    designCoveragePct:best.designCoveragePct,
    acoustic:best.acoustic,
    radialScale:best.scale,
    method:
      Math.abs(scalePct) >= 0.5
        ? `${candidate.method} • radiální posun ${scalePct>0?"+":""}${scalePct.toFixed(0)} %`
        : candidate.method
  };
}


function circleAlignedRequiredCoveragePct(coverage) {
  const toleranceDb = Number(
    coverage?.expectedSPLVariation || 3
  );

  if (toleranceDb <= 1) return 99.5;
  if (toleranceDb <= 2) return 99.0;
  if (toleranceDb <= 3) return 98.0;
  if (toleranceDb <= 4) return 97.0;
  return 95.0;
}

function circleAlignedSymmetryKey(room, placement) {
  const R = room.diameterM/2;
  const xM = placement.x/FEET_PER_METER - R;
  const yM = placement.y/FEET_PER_METER - R;

  const ax = Math.abs(xM);
  const ay = Math.abs(yM);
  const a = Math.min(ax,ay);
  const b = Math.max(ax,ay);

  return `${a.toFixed(3)}|${b.toFixed(3)}`;
}

function buildCircleAlignedSymmetryGroups(room, placements) {
  const groups = new Map();

  for (let i=0; i<placements.length; i++) {
    const key = circleAlignedSymmetryKey(
      room,
      placements[i]
    );

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(i);
  }

  return [...groups.values()]
    .filter(group => group.length >= 2);
}

function pruneCircleAlignedCandidate(
  candidate,
  room,
  coverage
) {
  if (
    !candidate?.placements?.length ||
    candidate.family !== "rows-0"
  ) return candidate;

  const requiredCoveragePct =
    circleAlignedRequiredCoveragePct(coverage);

  let currentPlacements = candidate.placements.map(p => ({...p}));
  let currentCoverage = circleDesignCoveragePct(
    room,
    currentPlacements,
    coverage
  );

  if (currentCoverage < requiredCoveragePct) {
    return {
      ...candidate,
      requiredDesignCoveragePct:requiredCoveragePct
    };
  }

  let removedTotal = 0;
  let changed = true;

  while (changed) {
    changed = false;

    const groups = buildCircleAlignedSymmetryGroups(
      room,
      currentPlacements
    );

    const R = room.diameterM/2;

    groups.sort((ga,gb) => {
      const radiusOf = group => {
        const p = currentPlacements[group[0]];
        return Math.hypot(
          p.x/FEET_PER_METER-R,
          p.y/FEET_PER_METER-R
        );
      };
      return radiusOf(ga)-radiusOf(gb);
    });

    let bestRemoval = null;

    for (const group of groups) {
      if (group.length > 4) continue;

      const removeSet = new Set(group);

      const proposal = currentPlacements.filter(
        (_,index) => !removeSet.has(index)
      );

      if (proposal.length < 4) continue;

      const coveragePct = circleDesignCoveragePct(
        room,
        proposal,
        coverage
      );

      if (coveragePct < requiredCoveragePct) continue;

      const geometryScore = circlePlacementGeometryScore(
        room,
        proposal,
        Math.max(
          0.15,
          coverage.targetSpacing/FEET_PER_METER
        )
      );

      const option = {
        group,
        proposal,
        coveragePct,
        geometryScore
      };

      if (
        !bestRemoval ||
        group.length > bestRemoval.group.length ||
        (
          group.length === bestRemoval.group.length &&
          coveragePct > bestRemoval.coveragePct+0.05
        ) ||
        (
          group.length === bestRemoval.group.length &&
          Math.abs(coveragePct-bestRemoval.coveragePct) <= 0.05 &&
          geometryScore < bestRemoval.geometryScore
        )
      ) {
        bestRemoval = option;
      }
    }

    if (bestRemoval) {
      currentPlacements = bestRemoval.proposal;
      currentCoverage = bestRemoval.coveragePct;
      removedTotal += bestRemoval.group.length;
      changed = true;
    }
  }

  return {
    ...candidate,
    placements:currentPlacements,
    count:currentPlacements.length,
    designCoveragePct:currentCoverage,
    requiredDesignCoveragePct:requiredCoveragePct,
    removedSymmetricCount:removedTotal,
    method:
      removedTotal > 0
        ? `${candidate.method} • symetricky odebráno ${removedTotal} ks`
        : candidate.method
  };
}

function buildCircleAlignedCoverageForGrid(room, coverage, columns, rows) {
  const widthFt = room.widthM * FEET_PER_METER;
  const lengthFt = room.lengthM * FEET_PER_METER;
  const spacingX = Math.min(
    coverage.targetSpacing,
    Math.round((widthFt / columns) * 100) / 100
  );
  const spacingY = Math.min(
    coverage.targetSpacing,
    Math.round((lengthFt / rows) * 100) / 100
  );

  return {
    ...coverage,
    columns,
    rows,
    count:columns*rows,
    spacingX,
    spacingY,
    offsetX:columns === 1 ? widthFt/2 : spacingX/2,
    offsetY:rows === 1 ? lengthFt/2 : spacingY/2
  };
}


function generateCircleStaggeredGrid(room, spacingM, angleDeg = 0, phaseX = 0, phaseY = 0) {
  const R = room.diameterM / 2;
  const cx = R;
  const cy = R;
  const rowPitch = spacingM * Math.sqrt(3) / 2;
  const a = angleDeg * Math.PI / 180;
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  const points = [];
  const nY = Math.ceil((2 * R) / Math.max(0.05, rowPitch)) + 3;
  const nX = Math.ceil((2 * R) / Math.max(0.05, spacingM)) + 3;

  for (let iy = -nY; iy <= nY; iy++) {
    const uy = (iy + phaseY) * rowPitch;
    const rowOffset = ((iy & 1) ? 0.5 : 0) + phaseX;
    for (let ix = -nX; ix <= nX; ix++) {
      const ux = (ix + rowOffset) * spacingM;
      const rx = ux * ca - uy * sa;
      const ry = ux * sa + uy * ca;
      if (Math.hypot(rx, ry) <= R + 1e-6) {
        points.push({
          x: (cx + rx) * FEET_PER_METER,
          y: (cy + ry) * FEET_PER_METER
        });
      }
    }
  }
  return points;
}

function generateCenteredHexCluster(room, spacingM, shellCount, rotationDeg = 0) {
  const R = room.diameterM / 2;
  const cx = R;
  const cy = R;
  const a = rotationDeg * Math.PI / 180;
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  const pts = [];

  // Triangular/hexagonal lattice, naturally centered on one loudspeaker.
  for (let q = -shellCount; q <= shellCount; q++) {
    const rMin = Math.max(-shellCount, -q - shellCount);
    const rMax = Math.min(shellCount, -q + shellCount);
    for (let r = rMin; r <= rMax; r++) {
      const ux = spacingM * (q + r / 2);
      const uy = spacingM * (Math.sqrt(3) / 2) * r;
      const rx = ux * ca - uy * sa;
      const ry = ux * sa + uy * ca;
      if (Math.hypot(rx, ry) <= R + 1e-6) {
        pts.push({
          x: (cx + rx) * FEET_PER_METER,
          y: (cy + ry) * FEET_PER_METER
        });
      }
    }
  }
  return pts;
}

function circleCandidateFromPlacements(room, coverage, speaker, placements, family, method, spacingM) {
  if (!placements?.length) return null;
  const benchmark = evaluateCircleAgainstSscReference(room, placements, coverage, speaker, "full");
  if (!benchmark.passes) return null;
  return {
    placements,
    count: placements.length,
    method,
    family,
    designCoveragePct: circleDesignCoveragePct(room, placements, coverage),
    requiredDesignCoveragePct: null,
    geometryScore: circlePlacementGeometryScore(room, placements, spacingM),
    clearanceM: recommendedWallClearanceMeters(coverage, room),
    isStructuredLattice: true,
    score: 0,
    source: "ssc-geometry-benchmark",
    radialScale: 1,
    removedSymmetricCount: 0,
    sscBenchmark: benchmark
  };
}

function buildAlignedCircleCandidates(room, coverage, speaker) {
  const candidates = [];
  const spacingM = Math.max(0.15, Math.min(coverage.spacingX, coverage.spacingY) / FEET_PER_METER);

  // 1) Pure orthogonal SSC grid. Density is increased only within this family.
  for (let extra = 0; extra <= 6; extra++) {
    const candidateCoverage = buildCircleAlignedCoverageForGrid(
      room, coverage, coverage.columns + extra, coverage.rows + extra
    );
    const placements = calculatePlacements(candidateCoverage, room);
    const c = circleCandidateFromPlacements(
      room, coverage, speaker, placements, "aligned-square",
      extra === 0
        ? `Pevná SSC mřížka ${candidateCoverage.columns} × ${candidateCoverage.rows} oříznutá kruhem`
        : `Pevná mřížka ${candidateCoverage.columns} × ${candidateCoverage.rows} oříznutá kruhem • zahuštěno pro SSC okraj`,
      Math.min(candidateCoverage.spacingX, candidateCoverage.spacingY) / FEET_PER_METER
    );
    if (c) {
      c.circleGridCoverage = candidateCoverage;
      candidates.push(c);
      break;
    }
  }

  // 2) Staggered/hex grid remains an aligned lattice family, but is optimized independently.
  const angles = [0, 30, 60, 90];
  const phases = [[0,0], [0.5,0], [0,0.5]];
  for (let density = 0; density <= 5; density++) {
    const s = spacingM * (1 - density * 0.055);
    let foundAtDensity = false;
    for (const angle of angles) {
      for (const [px,py] of phases) {
        const placements = generateCircleStaggeredGrid(room, s, angle, px, py);
        const c = circleCandidateFromPlacements(
          room, coverage, speaker, placements, "aligned-hex",
          `Posunutá hex mřížka • ${angle}° • SSC benchmark`, s
        );
        if (c) {
          candidates.push(c);
          foundAtDensity = true;
        }
      }
    }
    if (foundAtDensity) break;
  }
  return candidates;
}

function generateRegularCirclePattern(room, ringCount, radiusM, centerSpeaker = false, phaseRad = 0) {
  const R = room.diameterM / 2;
  const cx = R;
  const cy = R;
  const pts = [];

  if (centerSpeaker) {
    pts.push({x: cx * FEET_PER_METER, y: cy * FEET_PER_METER});
  }

  if (ringCount <= 0) return pts;

  // Pro N=2 dovolujeme dvojici přes střed; pro N>=3 jde o pravidelný polygon.
  for (let i = 0; i < ringCount; i++) {
    const a = phaseRad + i * 2 * Math.PI / ringCount;
    pts.push({
      x: (cx + Math.cos(a) * radiusM) * FEET_PER_METER,
      y: (cy + Math.sin(a) * radiusM) * FEET_PER_METER
    });
  }
  return pts;
}

function bestRegularCirclePattern(room, coverage, speaker, ringCount, centerSpeaker = false) {
  const R = room.diameterM / 2;
  const spacingM = Math.max(0.15, Math.min(coverage.spacingX, coverage.spacingY) / FEET_PER_METER);

  if (ringCount === 0 && centerSpeaker) {
    const placements = generateRegularCirclePattern(room, 0, 0, true, 0);
    return circleCandidateFromPlacements(
      room, coverage, speaker, placements, "circular-center",
      "1 repro ve středu • SSC benchmark", spacingM
    );
  }

  // Poloměr není odhadnutý z počtu kusů. Pro každé N ho samostatně hledáme,
  // aby nejmenší konfigurace měla nejlepší možnou šanci splnit SSC referenci.
  const phases = ringCount <= 2 ? [0, Math.PI / 2] : [0, Math.PI / ringCount];
  const coarseSteps = 120;
  let best = null;

  const consider = (radiusM, phaseRad) => {
    if (!(radiusM >= 0) || radiusM > R + 1e-9) return;
    const placements = generateRegularCirclePattern(
      room, ringCount, radiusM, centerSpeaker, phaseRad
    );
    const benchmark = evaluateCircleAgainstSscReference(
      room, placements, coverage, speaker, "full"
    );
    const option = {
      placements,
      benchmark,
      radiusM,
      phaseRad,
      count: placements.length
    };
    if (
      !best ||
      option.benchmark.overallRatio > best.benchmark.overallRatio ||
      (
        Math.abs(option.benchmark.overallRatio - best.benchmark.overallRatio) < 1e-9 &&
        option.radiusM < best.radiusM
      )
    ) best = option;
  };

  for (const phase of phases) {
    for (let i = 1; i <= coarseSteps; i++) {
      const r = R * i / (coarseSteps + 1);
      consider(r, phase);
    }
  }

  if (!best) return null;

  // Jemné doladění kolem nejlepšího hrubého poloměru.
  const coarsePitch = R / (coarseSteps + 1);
  for (let k = -20; k <= 20; k++) {
    const r = best.radiusM + k * coarsePitch / 20;
    consider(r, best.phaseRad);
  }

  if (!best.benchmark.passes) return null;

  const label = centerSpeaker
    ? `1 střed + ${ringCount} na kruhu`
    : `${ringCount} repro na kruhu`;

  return {
    placements: best.placements,
    count: best.placements.length,
    method: `${label} • optimalizovaný poloměr ${best.radiusM.toFixed(2)} m • SSC benchmark`,
    family: centerSpeaker ? "circular-center-ring" : "circular-single-ring",
    ringRadiusM: best.radiusM,
    designCoveragePct: circleDesignCoveragePct(room, best.placements, coverage),
    requiredDesignCoveragePct: null,
    geometryScore: circlePlacementGeometryScore(room, best.placements, spacingM),
    clearanceM: recommendedWallClearanceMeters(coverage, room),
    isStructuredLattice: true,
    score: 0,
    source: "ssc-geometry-benchmark",
    radialScale: 1,
    removedSymmetricCount: 0,
    sscBenchmark: best.benchmark
  };
}

function bestCenteredHexShell(room, coverage, speaker, shellCount) {
  const R = room.diameterM / 2;
  const referenceSpacingM = Math.max(
    0.15,
    Math.min(coverage.spacingX, coverage.spacingY) / FEET_PER_METER
  );
  const rotations = [0, 30];
  let best = null;

  // Kompletní plástvová vrstva: 1, 7, 19, 37... bodů.
  // Pitch hledáme od kompaktní po referenční SSC rozteč; nepřekračujeme SSC spacing.
  for (let step = 0; step <= 48; step++) {
    const factor = 0.45 + (0.55 * step / 48);
    const pitchM = referenceSpacingM * factor;
    for (const rotation of rotations) {
      const placements = generateCenteredHexCluster(room, pitchM, shellCount, rotation);
      const expectedCount = 1 + 3 * shellCount * (shellCount + 1);
      // Chceme skutečně kompletní hex/plástev, nikoli kruhem oříznutou mřížku.
      if (placements.length !== expectedCount) continue;

      const benchmark = evaluateCircleAgainstSscReference(
        room, placements, coverage, speaker, "full"
      );
      const option = {placements, benchmark, pitchM, rotation, count:placements.length};
      if (
        !best ||
        option.benchmark.overallRatio > best.benchmark.overallRatio ||
        (
          Math.abs(option.benchmark.overallRatio - best.benchmark.overallRatio) < 1e-9 &&
          option.pitchM > best.pitchM
        )
      ) best = option;
    }
  }

  if (!best?.benchmark?.passes) return null;

  return {
    placements: best.placements,
    count: best.count,
    method: `Plástvová hex struktura • ${best.count} ks • rozteč ${best.pitchM.toFixed(2)} m • SSC benchmark`,
    family: "circular-honeycomb",
    hexShellCount: shellCount,
    designCoveragePct: circleDesignCoveragePct(room, best.placements, coverage),
    requiredDesignCoveragePct: null,
    geometryScore: circlePlacementGeometryScore(room, best.placements, referenceSpacingM),
    clearanceM: recommendedWallClearanceMeters(coverage, room),
    isStructuredLattice: true,
    score: 0,
    source: "ssc-geometry-benchmark",
    radialScale: 1,
    removedSymmetricCount: 0,
    sscBenchmark: best.benchmark
  };
}

function buildCircularOnlyCandidates(room, coverage, speaker) {
  const candidates = [];

  // v0.134: kruhový režim postupuje deterministicky od nejmenšího vzoru.
  // Každý počet je posuzován samostatně proti SSC referenci; počet se nepřebírá
  // ze zarovnané varianty a poloměr kruhu se pro každé N optimalizuje zvlášť.

  // 1) Jediný reproduktor ve středu.
  const centerOnly = bestRegularCirclePattern(room, coverage, speaker, 0, true);
  if (centerOnly) return [centerOnly];

  // 2) Až 6 reproduktorů na jednom pravidelném kruhu bez středu.
  for (let n = 2; n <= 6; n++) {
    const c = bestRegularCirclePattern(room, coverage, speaker, n, false);
    if (c) return [c];
  }

  // 3) První plástvový vzor: 1 střed + 6 okolo. Poloměr/rozteč se opět hledá.
  const centerPlusSix = bestRegularCirclePattern(room, coverage, speaker, 6, true);
  if (centerPlusSix) {
    centerPlusSix.method = centerPlusSix.method.replace(
      "1 střed + 6 na kruhu",
      "Plástvový vzor 1 + 6"
    );
    centerPlusSix.family = "circular-honeycomb-7";
    return [centerPlusSix];
  }

  // 4) Než přidáme druhý prstenec, zkoušíme 1 střed + 7 až 12 na jednom kruhu.
  // Pro každý počet se poloměr optimalizuje samostatně a první konfigurace,
  // která splní SSC benchmark, se použije.
  //
  // Geometrická stop-podmínka: pokud by i při prstenci až u obvodu místnosti
  // byla vzdálenost sousedů menší než 60 % SSC rozteče, další zahušťování
  // jednoho prstence už nedává smysl a přecházíme na více vrstev.
  const R = room.diameterM / 2;
  const referenceSpacingM = Math.max(
    0.15,
    Math.min(coverage.spacingX, coverage.spacingY) / FEET_PER_METER
  );
  const minUsefulNeighborSpacingM = 0.60 * referenceSpacingM;

  for (let n = 7; n <= 12; n++) {
    const maxNeighborSpacingM = 2 * R * Math.sin(Math.PI / n);
    if (maxNeighborSpacingM < minUsefulNeighborSpacingM) break;

    const c = bestRegularCirclePattern(room, coverage, speaker, n, true);
    if (c) {
      c.method = c.method.replace(
        `1 střed + ${n} na kruhu`,
        `1 + ${n} • střed + jeden prstenec`
      );
      c.family = "circular-center-single-ring";
      return [c];
    }
  }

  // 5) Pokud nestačí ani rozumně hustý jeden prstenec, pokračujeme vícevrstvou
  // centrovanou hexagonální/plástvovou strukturou: 19, 37, 61... kusů.
  // Limit 18 vrstev je záměrně vysoký, aby běžná změna repro/overlapu nekončila chybou.
  for (let shell = 2; shell <= 18; shell++) {
    const c = bestCenteredHexShell(room, coverage, speaker, shell);
    if (c) return [c];
  }

  return candidates;
}


function evaluateRectangleAgainstSscReference(room, placements, coverage, speaker) {
  if (!placements?.length || room.shape !== "rectangle") return {passes:false, overallRatio:0};

  const reference = buildSscCircleGeometryReference(coverage, speaker);
  const placementsM = placements.map(p => ({xM:p.x/FEET_PER_METER, yM:p.y/FEET_PER_METER}));
  const w = room.widthM;
  const l = room.lengthM;
  const nx = 34;
  const ny = 34;
  let minRatio = Infinity;

  for (let iy=0; iy<=ny; iy++) {
    const yM = l * iy / ny;
    for (let ix=0; ix<=nx; ix++) {
      const xM = w * ix / nx;
      const wallDistanceM = Math.min(xM, w-xM, yM, l-yM);
      const vals = circleTopContributionsAtPoint(xM,yM,placementsM,reference,speaker,4);
      const isBoundary = wallDistanceM <= 1e-8;
      let ratio;
      if (isBoundary) {
        ratio = (vals[0] || 0) / Math.max(1e-12, reference.boundaryScore);
      } else {
        const top4 = vals.reduce((sum,v)=>sum+v,0);
        const t = Math.max(0,Math.min(1,wallDistanceM/reference.edgeDepthM));
        const required = reference.boundaryScore + (reference.interiorScore-reference.boundaryScore)*t;
        ratio = top4 / Math.max(1e-12,required);
      }
      minRatio = Math.min(minRatio,ratio);
    }
  }

  if (!Number.isFinite(minRatio)) minRatio = 0;
  return {passes:minRatio>=0.995, overallRatio:minRatio, reference};
}

function rectangleOptimizedHardGeometryCheck(room, placements, coverage) {
  if (!placements?.length || room.shape !== "rectangle") {
    return {passes:false, maxNearestM:Infinity, maxBoundaryNearestM:Infinity};
  }

  const spacingXM = Math.max(0.05, coverage.spacingX / FEET_PER_METER);
  const spacingYM = Math.max(0.05, coverage.spacingY / FEET_PER_METER);
  const maxSscNeighborM = Math.max(spacingXM, spacingYM);
  // Roh referenční SSC buňky: repro je půl rozteče od obou stěn.
  const maxSscBoundaryM = Math.hypot(spacingXM / 2, spacingYM / 2);
  const tolerance = 1.01;

  const pts = placements.map(p => ({x:p.x/FEET_PER_METER, y:p.y/FEET_PER_METER}));

  // Žádný reproduktor nesmí být "opuštěný" dál než dovoluje skutečná SSC rozteč.
  let maxNearestM = 0;
  if (pts.length > 1) {
    for (let i=0; i<pts.length; i++) {
      let nearest = Infinity;
      for (let j=0; j<pts.length; j++) {
        if (i === j) continue;
        nearest = Math.min(nearest, Math.hypot(pts[i].x-pts[j].x, pts[i].y-pts[j].y));
      }
      maxNearestM = Math.max(maxNearestM, nearest);
      if (nearest > maxSscNeighborM * tolerance) {
        return {passes:false, maxNearestM, maxBoundaryNearestM:Infinity, maxSscNeighborM, maxSscBoundaryM};
      }
    }
  }

  // Samostatná tvrdá kontrola kraje: žádný bod obvodu nesmí být dál od
  // nejbližšího repro než roh původní SSC mřížky.
  let maxBoundaryNearestM = 0;
  const samplesPerEdge = 72;
  const boundaryPoints = [];
  for (let i=0; i<=samplesPerEdge; i++) {
    const t = i / samplesPerEdge;
    boundaryPoints.push(
      {x:room.widthM*t, y:0},
      {x:room.widthM*t, y:room.lengthM},
      {x:0, y:room.lengthM*t},
      {x:room.widthM, y:room.lengthM*t}
    );
  }
  for (const q of boundaryPoints) {
    let nearest = Infinity;
    for (const p of pts) nearest = Math.min(nearest, Math.hypot(q.x-p.x, q.y-p.y));
    maxBoundaryNearestM = Math.max(maxBoundaryNearestM, nearest);
    if (nearest > maxSscBoundaryM * tolerance) {
      return {passes:false, maxNearestM, maxBoundaryNearestM, maxSscNeighborM, maxSscBoundaryM};
    }
  }

  return {passes:true, maxNearestM, maxBoundaryNearestM, maxSscNeighborM, maxSscBoundaryM};
}

function chooseRectangleOptimizedDesign(room, coverage, speaker) {
  if (room.shape !== "rectangle") return null;

  // Bezpečný základ je vždy původní SSC mřížka. Optimalizovaná varianta smí
  // pouze UBRAT repro; pokud bezpečnější úspora neexistuje, vrátíme SSC beze změny.
  const sscPlacements = calculatePlacements(coverage, room);
  const sscBaseline = {
    placements:sscPlacements.map(p => ({...p})),
    count:sscPlacements.length,
    method:`Původní SSC mřížka ${coverage.columns} × ${coverage.rows}`,
    source:"rectangle-ssc-baseline",
    alignmentWeight:4,
    isStructuredLattice:true,
    clearanceM:recommendedWallClearanceMeters(coverage, room)
  };

  const baselineBenchmark = evaluateRectangleAgainstSscReference(room, sscBaseline.placements, coverage, speaker);
  sscBaseline.sscBenchmark = baselineBenchmark;
  sscBaseline.hardGeometry = rectangleOptimizedHardGeometryCheck(room, sscBaseline.placements, coverage);

  // Hledáme pouze menší počet než má SSC. Kandidáty tvoří pravoúhlé a
  // posunuté/hex mřížky (typicky např. řady 4–3–4), nikoli volné body.
  for (let count=1; count<sscBaseline.count; count++) {
    const candidates = buildLayoutCandidates(count, coverage, room, "balanced", "full")
      .filter(c => c?.isStructuredLattice !== false && c?.placements?.length === count)
      // Pro obdélník dovolujeme jen osově orientované mřížky; žádné šikmé 30/45/60° varianty.
      .filter(c => Math.abs(Number(c.latticeAngleDeg || 0)) < 0.01);

    const passing = [];
    for (const candidate of candidates) {
      const hardGeometry = rectangleOptimizedHardGeometryCheck(room, candidate.placements, coverage);
      if (!hardGeometry.passes) continue;

      const benchmark = evaluateRectangleAgainstSscReference(room, candidate.placements, coverage, speaker);
      if (!benchmark.passes) continue;

      passing.push({...candidate, count, sscBenchmark:benchmark, hardGeometry});
    }

    if (passing.length) {
      passing.sort((a,b) =>
        (b.sscBenchmark?.overallRatio||0) - (a.sscBenchmark?.overallRatio||0) ||
        (a.hardGeometry?.maxBoundaryNearestM||Infinity) - (b.hardGeometry?.maxBoundaryNearestM||Infinity) ||
        (b.alignmentWeight||0) - (a.alignmentWeight||0)
      );
      const best = passing[0];
      return {
        ...best,
        method:`Optimalizovaná ${best.method || "mřížka"} • max. rozteče SSC`,
        source:"rectangle-ssc-optimized"
      };
    }
  }

  // Optimalizace nikdy nesmí vyjít hůř než klasická mřížka.
  return {
    ...sscBaseline,
    method:`Optimalizovaná • bez bezpečné úspory, použita ${sscBaseline.method}`,
    source:"rectangle-ssc-optimized-fallback"
  };
}

function chooseCircleCoverageDesign(room, coverage, circleMode = "circle-aligned", acousticContext = null) {
  const speaker = acousticContext?.speaker || null;

  // v0.133: aligned and circular modes are two independent optimizers.
  // No shared loudspeaker count and no fallback from one mode to the other.
  const candidates = circleMode === "circle-aligned"
    ? buildAlignedCircleCandidates(room, coverage, speaker)
    : buildCircularOnlyCandidates(room, coverage, speaker);

  if (!candidates.length) return null;

  // Each mode finds its own minimum safe count. Quality metrics only break ties.
  candidates.sort((a,b) =>
    a.count - b.count ||
    b.sscBenchmark.overallRatio - a.sscBenchmark.overallRatio ||
    b.designCoveragePct - a.designCoveragePct ||
    a.geometryScore - b.geometryScore
  );

  return candidates[0];
}

function getSscRegularAutomaticLayout(basePlacements, coverage, room) {
  const clearanceM = recommendedWallClearanceMeters(coverage, room);

  // Rekonstrukce původního SSC principu:
  // 1) coverage diameter z výšky a vyzařovacího úhlu
  // 2) target spacing podle zvoleného overlap / ±dB režimu
  // 3) ceil(width/spacing) × ceil(length/spacing)
  // 4) body ve středech jednotlivých buněk.
  //
  // Pro obdélník je to přímo původní SSC mřížka.
  // Pro naše rozšířené tvary (kruh, výřezy) použijeme tutéž mřížku
  // a pouze vynecháme body ležící mimo skutečnou plochu.
  return {
    placements: basePlacements.map(p => ({...p})),
    method:
      room.shape === "rectangle"
        ? `Pevná mřížka ${coverage.columns} × ${coverage.rows}`
        : "Pevná SSC mřížka X/Y oříznutá tvarem místnosti",
    clearanceM,
    alignmentWeight: 3,
    acoustic: null,
    score: 0
  };
}

function recommendationCacheKey(args) {
  return [
    roomGeometryCacheKey(args.room),
    `mode=${args.mode}`,
    `speaker=${args.speaker?.model || ""}`,
    `angle=${Number(args.speaker?.coverageAngle || 0).toFixed(2)}`,
    `target=${Number(args.targetSPL || 0).toFixed(1)}`,
    `ambient=${Number(args.ambientNoise || 0).toFixed(1)}`,
    `use=${args.useCase}`,
    `voltage=${args.voltage}`,
    `mount=${Number(args.mountingHeightFt || 0).toFixed(2)}`,
    `listener=${Number(args.listenerHeightFt || 0).toFixed(2)}`,
    `tol=${Number(args.coverage?.expectedSPLVariation || 3).toFixed(1)}`,
    `spacing=${Number(args.coverage?.targetSpacing || 0).toFixed(2)}`,
    `tap=${args.requestedTap || "auto"}`
  ].join(";");
}

function recommendationPasses(layout, targetSPL) {
  if (!layout?.acoustic) return false;
  return (
    layout.acoustic.tolerancePct >= 95 &&
    layout.acoustic.average >= targetSPL - 1.5 &&
    layout.acoustic.min >= targetSPL - 7
  );
}


function balancedLayoutMeetsBasicQuality(layout,targetSPL) {
  return Boolean(
    layout?.isStructuredLattice &&
    layout?.acoustic &&
    layout.acoustic.tolerancePct >= 95 &&
    layout.acoustic.largestHolePct <= 2.0 &&
    layout.acoustic.spacingBalanceRatio <= 1.7 &&
    layout.acoustic.average >= targetSPL-1.5 &&
    layout.acoustic.min >= targetSPL-7
  );
}

function balancedLayoutDominates(a,b) {
  if (!a?.acoustic || !b?.acoustic) return false;
  if (a.count > b.count) return false;

  const noWorse =
    a.acoustic.tolerancePct >= b.acoustic.tolerancePct-0.20 &&
    a.acoustic.spread <= b.acoustic.spread+0.15 &&
    a.acoustic.min >= b.acoustic.min-0.20 &&
    a.acoustic.largestHolePct <= b.acoustic.largestHolePct+0.15 &&
    a.acoustic.spacingBalanceRatio <= b.acoustic.spacingBalanceRatio+0.08;

  const clearlyBetter =
    a.count < b.count ||
    a.acoustic.tolerancePct > b.acoustic.tolerancePct+0.20 ||
    a.acoustic.spread < b.acoustic.spread-0.15 ||
    a.acoustic.min > b.acoustic.min+0.20 ||
    a.acoustic.largestHolePct < b.acoustic.largestHolePct-0.15;

  return noWorse && clearlyBetter;
}

function removeDominatedBalancedLayouts(layouts) {
  return layouts.filter((candidate,index) =>
    !layouts.some((other,otherIndex) =>
      otherIndex !== index &&
      balancedLayoutDominates(other,candidate)
    )
  );
}


function getLowerVerificationCounts(chosenCount, allCounts, maxChecks = 8) {
  if (!(chosenCount > 1)) return [];

  const lower = allCounts
    .filter(n => n < chosenCount)
    .sort((a,b) => b - a);

  // Nejdřív několik bezprostředně nižších hodnot.
  const selected = lower.slice(0, maxChecks);

  // U malých počtů vždy ověříme úplně vše až k 1.
  if (chosenCount <= 12) {
    return lower.slice().sort((a,b) => a - b);
  }

  // A vždy zahrneme 1–4, aby automatika nikdy nepřehlédla
  // překvapivě účinné malé řešení.
  for (const n of [1,2,3,4]) {
    if (n < chosenCount && allCounts.includes(n) && !selected.includes(n)) {
      selected.push(n);
    }
  }

  return [...new Set(selected)].sort((a,b) => a - b);
}

function coverageLayoutMeetsNearOptimalThreshold(layout, referenceAcoustic, targetSPL) {
  if (!layout) return false;
  const a = layout.freeAcoustic || layout.acoustic;
  if (!a || !referenceAcoustic) return false;

  return (
    a.tolerancePct >= Math.max(95, referenceAcoustic.tolerancePct - 1.0) &&
    a.spread <= referenceAcoustic.spread + 0.65 &&
    a.largestHolePct <= referenceAcoustic.largestHolePct + 0.7 &&
    a.average >= targetSPL - 1.5 &&
    a.min >= targetSPL - 7
  );
}



function getDynamicOptimizationPolicy(coverage) {
  const toleranceDb = Number(coverage?.expectedSPLVariation) || 3;

  // Čím přísnější požadavek na rovnoměrnost, tím více tolerujeme
  // vyšší počet reproduktorů. U volnějšího overlapu naopak výrazně
  // preferujeme úspornější návrh.
  const presets = {
    1: {
      preferredCoveragePct: 97,
      fallbackCoveragePct: 93,
      maxCountIncreaseRatio: 0.35,
      meaningfulToleranceGainPct: 1.0,
      meaningfulSpreadGainDb: 0.7,
      meaningfulMinGainDb: 0.7,
      strongToleranceGainPct: 2.0,
      strongSpreadGainDb: 1.1
    },
    2: {
      preferredCoveragePct: 97,
      fallbackCoveragePct: 94,
      maxCountIncreaseRatio: 0.30,
      meaningfulToleranceGainPct: 1.2,
      meaningfulSpreadGainDb: 0.8,
      meaningfulMinGainDb: 0.8,
      strongToleranceGainPct: 2.2,
      strongSpreadGainDb: 1.2
    },
    3: {
      preferredCoveragePct: 98,
      fallbackCoveragePct: 95,
      maxCountIncreaseRatio: 0.24,
      meaningfulToleranceGainPct: 1.5,
      meaningfulSpreadGainDb: 0.9,
      meaningfulMinGainDb: 0.9,
      strongToleranceGainPct: 2.5,
      strongSpreadGainDb: 1.3
    },
    4: {
      preferredCoveragePct: 98,
      fallbackCoveragePct: 95,
      maxCountIncreaseRatio: 0.18,
      meaningfulToleranceGainPct: 2.0,
      meaningfulSpreadGainDb: 1.0,
      meaningfulMinGainDb: 1.0,
      strongToleranceGainPct: 3.0,
      strongSpreadGainDb: 1.5
    },
    7: {
      preferredCoveragePct: 98,
      fallbackCoveragePct: 95,
      maxCountIncreaseRatio: 0.12,
      meaningfulToleranceGainPct: 3.0,
      meaningfulSpreadGainDb: 1.3,
      meaningfulMinGainDb: 1.3,
      strongToleranceGainPct: 4.0,
      strongSpreadGainDb: 1.8
    }
  };

  const keys = Object.keys(presets).map(Number);
  const nearest = keys
    .slice()
    .sort((a,b) => Math.abs(a-toleranceDb)-Math.abs(b-toleranceDb))[0];

  return {
    toleranceDb,
    ...(presets[nearest] || presets[3])
  };
}

function sortUniqueLayoutsByCount(layouts) {
  const bestByCount = new Map();
  for (const item of layouts || []) {
    if (!item?.acoustic) continue;
    const existing = bestByCount.get(item.count);
    if (!existing || item.score > existing.score) bestByCount.set(item.count, item);
  }
  return [...bestByCount.values()].sort((a,b) => a.count - b.count);
}

function balancedSimpleAccepts(layout, targetSPL, policy) {
  if (!layout?.isStructuredLattice || !layout?.acoustic) return false;
  return (
    layout.acoustic.tolerancePct >= policy.preferredCoveragePct &&
    layout.acoustic.average >= targetSPL - 1.5 &&
    layout.acoustic.min >= targetSPL - 7 &&
    layout.acoustic.largestHolePct <= 2.5 &&
    layout.acoustic.spacingBalanceRatio <= 1.8
  );
}

function balancedFallbackAccepts(layout, targetSPL, policy) {
  if (!layout?.isStructuredLattice || !layout?.acoustic) return false;
  return (
    layout.acoustic.tolerancePct >= policy.fallbackCoveragePct &&
    layout.acoustic.average >= targetSPL - 1.5 &&
    layout.acoustic.min >= targetSPL - 7 &&
    layout.acoustic.largestHolePct <= 3.5 &&
    layout.acoustic.spacingBalanceRatio <= 1.9
  );
}

function significantBalancedImprovement(smaller, larger, policy) {
  if (!smaller?.acoustic || !larger?.acoustic) return false;
  return (
    larger.acoustic.tolerancePct - smaller.acoustic.tolerancePct >= policy.meaningfulToleranceGainPct ||
    smaller.acoustic.spread - larger.acoustic.spread >= policy.meaningfulSpreadGainDb ||
    larger.acoustic.min - smaller.acoustic.min >= policy.meaningfulMinGainDb
  );
}

function coverageSimpleQuality(layout) {
  const a = layout?.freeAcoustic || layout?.acoustic;
  if (!a) return -Infinity;
  return a.tolerancePct * 2.0 - a.spread * 1.2 - a.largestHolePct * 3.0;
}

function coverageSimpleAccepts(layout, targetSPL, policy) {
  const a = layout?.freeAcoustic || layout?.acoustic;
  if (!a) return false;
  return (
    a.tolerancePct >= policy.preferredCoveragePct &&
    a.average >= targetSPL - 1.5 &&
    a.min >= targetSPL - 7
  );
}

function coverageFallbackAccepts(layout, targetSPL, policy) {
  const a = layout?.freeAcoustic || layout?.acoustic;
  if (!a) return false;
  return (
    a.tolerancePct >= policy.fallbackCoveragePct &&
    a.average >= targetSPL - 1.5 &&
    a.min >= targetSPL - 7
  );
}

function significantCoverageImprovement(smaller, larger, policy) {
  const a = smaller?.freeAcoustic || smaller?.acoustic;
  const b = larger?.freeAcoustic || larger?.acoustic;
  if (!a || !b) return false;
  return (
    b.tolerancePct - a.tolerancePct >= policy.meaningfulToleranceGainPct ||
    a.spread - b.spread >= policy.meaningfulSpreadGainDb ||
    b.min - a.min >= policy.meaningfulMinGainDb
  );
}

function recommendSpeakerCountAndLayout(args) {
  const policy = getDynamicOptimizationPolicy(args.coverage);
  const cacheKey = `v118;${recommendationCacheKey(args)};policy=${policy.toleranceDb}`;
  const cached = COUNT_RECOMMENDATION_CACHE.get(cacheKey);
  if (cached) return cached;

  const counts = candidateCountsForRecommendation(args.coverage, args.room);
  const evaluated = [];

  for (const count of counts) {
    const layout = selectBestLayoutForCount({
      ...args,
      count,
      quality:"full"
    });
    if (layout) evaluated.push({count, ...layout});
  }

  if (!evaluated.length) return null;
  const ordered = sortUniqueLayoutsByCount(evaluated);

  // ----------------------------------------------------------
  // VYVÁŽENÉ
  // ----------------------------------------------------------
  if (args.mode === "balanced") {
    const strong = ordered.filter(x =>
      balancedSimpleAccepts(x, args.targetSPL, policy)
    );

    let chosen;

    if (strong.length) {
      chosen = strong[0];

      for (const candidate of strong.slice(1)) {
        if (!significantBalancedImprovement(chosen, candidate, policy)) continue;

        const countIncrease =
          (candidate.count - chosen.count) / Math.max(1, chosen.count);

        const toleranceGain =
          candidate.acoustic.tolerancePct - chosen.acoustic.tolerancePct;

        const spreadGain =
          chosen.acoustic.spread - candidate.acoustic.spread;

        // Dynamika overlapu:
        // ±1/2 dB dovolí vyšší počet snáz.
        // ±4/7 dB musí vyšší počet prokázat výrazně větší přínos.
        if (
          countIncrease <= policy.maxCountIncreaseRatio ||
          toleranceGain >= policy.strongToleranceGainPct ||
          spreadGain >= policy.strongSpreadGainDb
        ) {
          chosen = candidate;
        }
      }
    } else {
      const fallback = ordered.filter(x =>
        balancedFallbackAccepts(x, args.targetSPL, policy)
      );

      if (fallback.length) {
        chosen = fallback[0];

        for (const candidate of fallback.slice(1)) {
          if (!significantBalancedImprovement(chosen, candidate, policy)) continue;

          const countIncrease =
            (candidate.count - chosen.count) / Math.max(1, chosen.count);

          if (countIncrease <= policy.maxCountIncreaseRatio) {
            chosen = candidate;
          }
        }
      } else {
        chosen = ordered
          .filter(x => x.isStructuredLattice)
          .slice()
          .sort((a,b) =>
            b.acoustic.tolerancePct - a.acoustic.tolerancePct ||
            a.acoustic.spread - b.acoustic.spread ||
            a.count - b.count
          )[0] || ordered[0];
      }
    }

    const result = {
      recommendedCount:chosen.count,
      chosen,
      evaluated:ordered,
      toleranceFloor:policy.preferredCoveragePct,
      targetMet:balancedSimpleAccepts(chosen, args.targetSPL, policy),
      optimizationPolicy:policy,
      balancedQuality:{
        largestHolePct:chosen.acoustic.largestHolePct,
        spacingBalanceRatio:chosen.acoustic.spacingBalanceRatio
      }
    };

    cacheSetLimited(COUNT_RECOMMENDATION_CACHE, cacheKey, result, 48);
    return result;
  }

  // ----------------------------------------------------------
  // NEJLEPŠÍ POKRYTÍ
  // ----------------------------------------------------------
  const strong = ordered.filter(x =>
    coverageSimpleAccepts(x, args.targetSPL, policy)
  );

  let chosen;

  if (strong.length) {
    chosen = strong[0];

    for (const candidate of strong.slice(1)) {
      if (!significantCoverageImprovement(chosen, candidate, policy)) continue;

      const countIncrease =
        (candidate.count - chosen.count) / Math.max(1, chosen.count);

      const a = chosen.freeAcoustic || chosen.acoustic;
      const b = candidate.freeAcoustic || candidate.acoustic;

      const toleranceGain = b.tolerancePct - a.tolerancePct;
      const spreadGain = a.spread - b.spread;

      if (
        countIncrease <= policy.maxCountIncreaseRatio ||
        toleranceGain >= policy.strongToleranceGainPct ||
        spreadGain >= policy.strongSpreadGainDb
      ) {
        chosen = candidate;
      }
    }
  } else {
    const fallback = ordered.filter(x =>
      coverageFallbackAccepts(x, args.targetSPL, policy)
    );

    if (fallback.length) {
      chosen = fallback[0];

      for (const candidate of fallback.slice(1)) {
        if (!significantCoverageImprovement(chosen, candidate, policy)) continue;

        const countIncrease =
          (candidate.count - chosen.count) / Math.max(1, chosen.count);

        if (countIncrease <= policy.maxCountIncreaseRatio) {
          chosen = candidate;
        }
      }
    } else {
      chosen = ordered
        .slice()
        .sort((a,b) =>
          coverageSimpleQuality(b) - coverageSimpleQuality(a) ||
          a.count - b.count
        )[0];
    }
  }

  const result = {
    recommendedCount:chosen.count,
    chosen,
    evaluated:ordered,
    toleranceFloor:policy.preferredCoveragePct,
    targetMet:coverageSimpleAccepts(chosen, args.targetSPL, policy),
    optimizationPolicy:policy
  };

  cacheSetLimited(COUNT_RECOMMENDATION_CACHE, cacheKey, result, 48);
  return result;
}
function loneliestSpeakerNearestDistance(placements) {
  if (!placements?.length || placements.length === 1) return null;

  let loneliest = null;
  for (let i = 0; i < placements.length; i++) {
    let nearestM = Infinity;
    let nearestIndex = -1;
    for (let j = 0; j < placements.length; j++) {
      if (i === j) continue;
      const distanceM = Math.hypot(
        (placements[i].x - placements[j].x) / FEET_PER_METER,
        (placements[i].y - placements[j].y) / FEET_PER_METER
      );
      if (distanceM < nearestM) {
        nearestM = distanceM;
        nearestIndex = j;
      }
    }

    if (Number.isFinite(nearestM) && (!loneliest || nearestM > loneliest.distanceM)) {
      loneliest = {
        speakerIndex: i,
        nearestIndex,
        distanceM: nearestM
      };
    }
  }

  return loneliest;
}

function nearestNeighbourSpacingMeters(placements) {
  if (!placements?.length || placements.length === 1) return null;
  const values = [];
  for (let i=0; i<placements.length; i++) {
    let best = Infinity;
    for (let j=0; j<placements.length; j++) {
      if (i === j) continue;
      const d = Math.hypot(
        (placements[i].x - placements[j].x) / FEET_PER_METER,
        (placements[i].y - placements[j].y) / FEET_PER_METER
      );
      best = Math.min(best, d);
    }
    if (Number.isFinite(best)) values.push(best);
  }
  values.sort((a,b)=>a-b);
  return values.length ? values[Math.floor(values.length/2)] : null;
}

function optimizePlacementsForRoom(basePlacements, coverage, room, mode = "balanced") {
  const count = Math.max(1, basePlacements.length);
  const candidates = buildLayoutCandidates(count, coverage, room, mode);
  const clearanceM = recommendedWallClearanceMeters(coverage, room);

  if (!candidates.length) {
    return {
      placements:basePlacements,
      optimized:false,
      method:"Základní rozmístění",
      improvementPct:0,
      clearanceM
    };
  }

  const samples = makeOptimizationSamples(room, 600);
  const baseScore = placementGeometryScore(basePlacements, room, samples, clearanceM);

  let best = candidates[0];
  let bestScore = Infinity;
  for (const candidate of candidates) {
    const score = placementGeometryScore(candidate.placements, room, samples, candidate.clearanceM);
    if (score < bestScore) {
      best = candidate;
      bestScore = score;
    }
  }

  return {
    placements:best.placements,
    optimized:mode !== "regular",
    method:best.method,
    improvementPct:baseScore > 0
      ? Math.max(0, (baseScore - bestScore) / baseScore * 100)
      : 0,
    clearanceM:best.clearanceM
  };
}
function calculatePower({speaker, targetSPL, ambientNoise, useCase, voltage}, coverage) {
  const headroom = HEADROOM_BY_APPLICATION[useCase] || 10;
  const distanceLoss = 20 * Math.log10(coverage.listenerDistance / SPL_REFERENCE_DISTANCE_FT);
  const arrayGain = 10 * Math.log10(Math.max(1, coverage.count));

  // Stejná logika jako SSC: potřebný tap zohledňuje cílové SPL,
  // headroom, citlivost, nominální vzdálenost a počet repro.
  const requiredTap = Math.pow(
    10,
    (targetSPL + headroom - speaker.sensitivity + distanceLoss - arrayGain) / 10
  );

  const taps = voltage === "100V" ? speaker.taps100 : speaker.taps;
  let recommendedTap;

  if (useCase === "foreground") {
    recommendedTap = taps[taps.length - 1];
  } else {
    const safeRequired = requiredTap * TAP_SAFETY_MARGIN;
    recommendedTap = taps[taps.length - 1];
    for (const tap of taps) {
      if (safeRequired <= tap) {
        recommendedTap = tap;
        break;
      }
    }
  }

  const singleSpeakerSPL =
    speaker.sensitivity +
    10 * Math.log10(recommendedTap) -
    distanceLoss;

  const combinedSPL =
    singleSpeakerSPL +
    arrayGain;

  return {
    requiredTap,
    recommendedTap,
    singleSpeakerSPL,
    combinedSPL,
    totalPower: recommendedTap * coverage.count
  };
}

// v0.129 – konzervativnější odhad mimo osu reproduktoru.
// U nominálního úhlu pokrytí předpokládáme běžnou definici -6 dB na jeho hraně.
// Bez kompletních polárních dat výrobce jde stále o návrhový model, ne o predikci měření.
function calculateOffAxisAttenuationDb(horizontalDistanceFt, verticalDistanceFt, coverageAngleDeg) {
  const coverage = Number(coverageAngleDeg);
  if (!Number.isFinite(coverage) || coverage >= 179) return 0;

  const halfAngleDeg = Math.max(5, Math.min(89, coverage / 2));
  const angleDeg = Math.atan2(
    Math.max(0, horizontalDistanceFt),
    Math.max(0.01, Math.abs(verticalDistanceFt))
  ) * 180 / Math.PI;

  const edgeCos = Math.max(0.02, Math.cos(halfAngleDeg * Math.PI / 180));
  // exponent zvolený tak, aby na hraně nominálního pokrytí vyšlo -6 dB
  const exponent = Math.log(Math.pow(10, -6 / 20)) / Math.log(edgeCos);
  const angleCos = Math.max(0.001, Math.cos(Math.min(89.9, angleDeg) * Math.PI / 180));
  const attenuation = 20 * exponent * Math.log10(angleCos);

  return Math.max(-30, Math.min(0, attenuation));
}

function createSplKernel({listenerHeightFt, placements, mountingHeightFt, speaker, tap}) {
  const dz = mountingHeightFt - listenerHeightFt;
  const dz2 = dz * dz;
  const minDistance2 = MIN_LISTENER_DISTANCE_FT * MIN_LISTENER_DISTANCE_FT;
  const referenceDistance2 = SPL_REFERENCE_DISTANCE_FT * SPL_REFERENCE_DISTANCE_FT;
  // Matematicky shodné s původním SSC-style SPL vztahem, pouze bez opakovaných
  // sqrt/log/pow operací pro každý reproduktor a každý bod heatmapy.
  const sourceIntensityAtReference = Math.pow(10, speaker.sensitivity / 10) * Math.max(tap, 1e-12);
  return {
    placements,
    dz2,
    minDistance2,
    intensityScale: sourceIntensityAtReference * referenceDistance2
  };
}

function calculateSPLWithKernel(xFt, yFt, kernel) {
  let totalIntensity = 0;
  for (const p of kernel.placements) {
    const dx = xFt - p.x;
    const dy = yFt - p.y;
    const distance2 = Math.max(kernel.minDistance2, dx * dx + dy * dy + kernel.dz2);
    totalIntensity += kernel.intensityScale / distance2;
  }
  return 10 * Math.log10(Math.max(totalIntensity, 1e-12));
}

function calculateSPLAtPoint({xFt, yFt, listenerHeightFt, placements, mountingHeightFt, speaker, tap}) {
  const kernel = createSplKernel({listenerHeightFt, placements, mountingHeightFt, speaker, tap});
  return calculateSPLWithKernel(xFt, yFt, kernel);
}


function calculateSPLStatsLikeSSC({
  lengthFt,
  widthFt,
  placements,
  mountingHeightFt,
  listenerHeightFt,
  speaker,
  tap
}) {
  const stepFt = 3;
  const values = [];

  for (let xFt = stepFt; xFt < widthFt; xFt += stepFt) {
    for (let yFt = stepFt; yFt < lengthFt; yFt += stepFt) {
      values.push(calculateSPLAtPoint({
        xFt, yFt, listenerHeightFt, placements, mountingHeightFt, speaker, tap
      }));
    }
  }

  if (!values.length) {
    return { min: 0, max: 0, average: 0, spread: 0, variation: 0 };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const average = values.reduce((a,b) => a + b, 0) / values.length;

  return {
    min,
    max,
    average,
    spread: max - min,
    variation: (max - min) / 2
  };
}

let heatmapCache = { key: null, value: null };

function makeHeatmapCacheKey({lengthFt, widthFt, placements, mountingHeightFt, listenerHeightFt, speaker, tap, room}) {
  // Klíč obsahuje pouze veličiny, které skutečně mění SPL pole.
  // Změna zesilovače, Dante nebo polohy posluchače tak heatmapu zbytečně nepřepočítá.
  return JSON.stringify({
    lengthFt: Number(lengthFt.toFixed(5)),
    widthFt: Number(widthFt.toFixed(5)),
    mountingHeightFt: Number(mountingHeightFt.toFixed(5)),
    listenerHeightFt: Number(listenerHeightFt.toFixed(5)),
    sensitivity: Number(speaker?.sensitivity || 0),
    tap: Number(tap),
    room,
    placements: placements.map(p => [Number(p.x.toFixed(5)), Number(p.y.toFixed(5))])
  });
}

function calculateHeatmap({
  lengthFt,
  widthFt,
  placements,
  mountingHeightFt,
  listenerHeightFt,
  speaker,
  tap,
  room
}) {
  const cacheKey = makeHeatmapCacheKey({
    lengthFt, widthFt, placements, mountingHeightFt, listenerHeightFt, speaker, tap, room
  });
  if (heatmapCache.key === cacheKey && heatmapCache.value) {
    return heatmapCache.value;
  }

  const splKernel = createSplKernel({listenerHeightFt, placements, mountingHeightFt, speaker, tap});
  const lengthM = lengthFt / FEET_PER_METER;
  const widthM = widthFt / FEET_PER_METER;
  const areaM2 = room?.areaM2 || (lengthM * widthM);

  // Progresivní rozlišení podle velikosti prostoru.
  let stepM;
  if (areaM2 <= 500) stepM = 0.5;
  else if (areaM2 <= 2000) stepM = 0.75;
  else if (areaM2 <= 5000) stepM = 1.0;
  else if (areaM2 <= 10000) stepM = 1.5;
  else stepM = 2.0;

  let nx = Math.max(8, Math.ceil(widthM / stepM));
  let ny = Math.max(8, Math.ceil(lengthM / stepM));

  // Omezíme počet výpočtových bodů pro velmi velké haly.
  const maxCalcPoints = 10000;
  if (nx * ny > maxCalcPoints) {
    const scale = Math.sqrt(maxCalcPoints / (nx * ny));
    nx = Math.max(8, Math.floor(nx * scale));
    ny = Math.max(8, Math.floor(ny * scale));
  }

  const actualStepXM = widthM / nx;
  const actualStepYM = lengthM / ny;

  const cells = [];
  let min = Infinity;
  let max = -Infinity;
  let sumLinear = 0;

  for (let iy = 0; iy < ny; iy++) {
    for (let ix = 0; ix < nx; ix++) {
      const xFt = widthFt * (ix + 0.5) / nx;
      const yFt = lengthFt * (iy + 0.5) / ny;

      if (room && !isPointInsideRoomMeters(xFt / FEET_PER_METER, yFt / FEET_PER_METER, room)) {
        continue;
      }

      const spl = calculateSPLWithKernel(xFt, yFt, splKernel);

      cells.push({ ix, iy, spl });
      min = Math.min(min, spl);
      max = Math.max(max, spl);
      sumLinear += Math.pow(10, spl / 10);
    }
  }

  const average = cells.length ? 10 * Math.log10(sumLinear / cells.length) : 0;
  if (!cells.length) { min = 0; max = 0; }

  const result = {
    nx,
    ny,
    cells,
    min,
    max,
    average,
    spread: max - min,
    stepXM: actualStepXM,
    stepYM: actualStepYM,
    points: cells.length,
    areaM2
  };
  heatmapCache = { key: cacheKey, value: result };
  return result;
}

function calculateVisualHeatmap({
  lengthFt,
  widthFt,
  placements,
  mountingHeightFt,
  listenerHeightFt,
  speaker,
  tap
}) {
  return calculateHeatmap({
    lengthFt,
    widthFt,
    placements,
    mountingHeightFt,
    listenerHeightFt,
    speaker,
    tap
  });
}

function calculateSplToleranceCoverage(heatmap, toleranceDb = 3) {
  if (!heatmap?.cells?.length) return 0;
  const avg = heatmap.average;
  const inside = heatmap.cells.filter(cell => Math.abs(cell.spl - avg) <= toleranceDb).length;
  return inside / heatmap.cells.length * 100;
}

function prepareRenderedHeatmap(heatmap) {
  const maxRenderCells = 3500;

  if (heatmap.cells.length <= maxRenderCells) {
    return heatmap;
  }

  const stride = Math.ceil(Math.sqrt(heatmap.cells.length / maxRenderCells));

  // Dříve jsme pouze vynechali mezilehlé buňky a ponechali původní nx/ny.
  // To u velkých místností vytvořilo viditelnou "šachovnici".
  // Teď zároveň zmenšíme vizuální mřížku a přemapujeme indexy,
  // takže každá vykreslená buňka navazuje na sousední bez mezer.
  const renderedCells = heatmap.cells
    .filter(cell => cell.ix % stride === 0 && cell.iy % stride === 0)
    .map(cell => ({
      ...cell,
      ix: Math.floor(cell.ix / stride),
      iy: Math.floor(cell.iy / stride)
    }));

  return {
    ...heatmap,
    nx: Math.ceil(heatmap.nx / stride),
    ny: Math.ceil(heatmap.ny / stride),
    cells: renderedCells,
    renderStride: stride
  };
}

function heatColor(value, min, max) {
  const span = Math.max(0.001, max - min);

  // Relativní pozice v konkrétní místnosti:
  const relativeT = Math.max(0, Math.min(1, (value - min) / span));

  // Absolutní "síla" návrhu, ale jen jako jemná modulace.
  // 75 dB = slabší návrh, 100 dB = velmi silný návrh.
  const absoluteStrength = Math.max(0, Math.min(1, (value - 75) / 25));

  // Hlavní váha zůstává relativní, takže heatmapa pořád dobře ukazuje
  // rovnoměrnost. Absolutní SPL ale omezuje, jak daleko do červené se
  // slabší návrh může dostat.
  const maxReach = 0.58 + 0.42 * absoluteStrength;
  const t = relativeT * maxReach;

  const stops = [
    [0.00, [45, 95, 190]],
    [0.22, [35, 155, 200]],
    [0.40, [45, 180, 125]],
    [0.55, [105, 190, 75]],
    [0.70, [215, 205, 65]],
    [0.84, [235, 145, 50]],
    [1.00, [220, 65, 50]]
  ];

  for (let i = 0; i < stops.length - 1; i++) {
    const [p1, c1] = stops[i];
    const [p2, c2] = stops[i + 1];
    if (t <= p2) {
      const f = (t - p1) / Math.max(0.0001, p2 - p1);
      const c = c1.map((v, k) => Math.round(v + (c2[k] - v) * f));
      return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
    }
  }

  return "rgb(220, 65, 50)";
}

function updateHeatmapScaleLabels(heatmap) {
  const low = document.getElementById("heatmapScaleLowLabel");
  const high = document.getElementById("heatmapScaleHighLabel");
  if (!low || !high || !heatmap) return;

  low.textContent = `Min. ${heatmap.min.toFixed(0)} dB`;
  high.textContent = `Max. ${heatmap.max.toFixed(0)} dB`;
}

let audioObjectUrl = null;
const AUDIO_BASE_VOLUME = 1;
let audioUserVolume = 1;

function updateSpatialAudioGain(listenerSPL = null) {
  const audio = document.getElementById("spatialAudio");
  const status = document.getElementById("audioGainStatus");
  const s = appState.latest;
  if (!audio || !status || !s || !audio.src) return;

  const currentSPL = Number.isFinite(listenerSPL)
    ? listenerSPL
    : calculateSPLAtPoint({
        xFt: appState.listenerXFt,
        yFt: appState.listenerYFt,
        listenerHeightFt: s.listenerHeightFt,
        placements: s.placements,
        mountingHeightFt: s.mountingHeightFt,
        speaker: s.speaker,
        tap: s.power.recommendedTap
      });

  const referenceSPL = s.heatmap?.average;
  if (!Number.isFinite(currentSPL) || !Number.isFinite(referenceSPL)) return;

  const deltaDb = currentSPL - referenceSPL;
  const relativeGain = Math.pow(10, deltaDb / 20);
  audio.volume = Math.max(0, Math.min(1, AUDIO_BASE_VOLUME * audioUserVolume * relativeGain));

  const signed = `${deltaDb >= 0 ? "+" : ""}${deltaDb.toFixed(1).replace(".", ",")} dB`;
  status.textContent = `${signed} vůči průměru`;
}

let appState = {
  listenerXFt: null,
  listenerYFt: null,
  draggingListener: false,
  draggingSection: null,
  sectionGeom: {},
  latest: null
};


function floorSpeakerInfluence(placements, listenerXFt, listenerYFt) {
  const latest = appState.latest;
  if (!latest || !placements?.length) return placements.map(() => ({ influence: "low" }));

  // Vizuální vliv je čistě geometrický a odpovídá kuželům v řezech:
  // strong = půdorysná poloha posluchače leží uvnitř nominálního kuželu v rovině uší
  // medium = není už v kuželu v rovině uší, ale stále leží v půdorysu kuželu až k podlaze
  // low = ani kužel promítnutý k podlaze na tuto půdorysnou polohu nedosáhne
  const mountingHeightFt = Math.max(0.01, Number(latest.mountingHeightFt) || 0.01);
  const listenerHeightFt = Math.max(0, Number(latest.listenerHeightFt) || 0);
  const verticalToEarFt = Math.max(0.01, mountingHeightFt - listenerHeightFt);
  const verticalToFloorFt = mountingHeightFt;
  const coverageAngle = Number(latest.speaker?.coverageAngle) || 180;
  const halfAngleRad = Math.max(0.5, Math.min(89.5, coverageAngle / 2)) * Math.PI / 180;
  const radiusAtEarFt = Math.tan(halfAngleRad) * verticalToEarFt;
  const radiusAtFloorFt = Math.tan(halfAngleRad) * verticalToFloorFt;

  return placements.map((p) => {
    const horizontalFt = Math.hypot(listenerXFt - p.x, listenerYFt - p.y);
    let influence = "low";
    if (horizontalFt <= radiusAtEarFt + 1e-9) influence = "strong";
    else if (horizontalFt <= radiusAtFloorFt + 1e-9) influence = "medium";
    return { horizontalFt, radiusAtEarFt, radiusAtFloorFt, influence };
  });
}

function drawFloorPlan({
  lengthM, widthM, lengthFt, widthFt, room,
  placements, coverage, speakerModel, heatmap,
  listenerXFt, listenerYFt, listenerSPL
}) {
  const svg = document.getElementById("floorPlan");
  const W = 900;
  const H = 560;
  const pad = 72;

  const scale = Math.min((W - pad * 2) / widthM, (H - pad * 2) / lengthM);
  const roomW = widthM * scale;
  const roomH = lengthM * scale;
  const ox = (W - roomW) / 2;
  const oy = (H - roomH) / 2;
  const ftToM = 1 / FEET_PER_METER;

  const rect = roomSvgShape(room, ox, oy, scale);
  const floorClipId = "floor-room-clip";
  const floorDefs = `<defs>
    ${roomClipPath(room, ox, oy, scale, floorClipId)}
    <filter id="speaker-active-glow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="3.2" result="blur"/>
      <feFlood flood-color="#ff7a1a" flood-opacity="0.9" result="color"/>
      <feComposite in="color" in2="blur" operator="in" result="glow"/>
      <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>`;

  const dims = `
    <text x="${W/2}" y="${oy + roomH + 34}" text-anchor="middle"
      fill="#dfe6ee" font-size="16" font-weight="700">Šířka: ${widthM.toFixed(1)} m</text>
    <text x="${ox - 26}" y="${H/2}" text-anchor="middle"
      fill="#dfe6ee" font-size="16" font-weight="700"
      transform="rotate(-90 ${ox - 26} ${H/2})">Délka: ${lengthM.toFixed(1)} m</text>
  `;

  // Technické značky směru pohledu pro řezy. Krátký dřík + plný trojúhelník
  // jsou čitelnější než dlouhé šipky a neruší samotný půdorys.
  const aY = Math.max(18, oy - 18);
  const aX = ox + Math.min(52, roomW * 0.15);
  const bX = Math.min(W - 18, ox + roomW + 20);
  const bY = oy + roomH - Math.min(52, roomH * 0.15);
  const viewDirections = `
    <g class="floor-view-direction" pointer-events="none">
      <g aria-label="A–A Boční řez">
        <line x1="${aX - 26}" y1="${aY}" x2="${aX - 7}" y2="${aY}" stroke="#ff7a1a" stroke-width="2"/>
        <path d="M ${aX} ${aY} L ${aX - 9} ${aY - 6} L ${aX - 9} ${aY + 6} Z" fill="#ff7a1a"/>
        <circle cx="${aX - 34}" cy="${aY}" r="10" fill="#101820" stroke="#ff7a1a" stroke-width="1.5"/>
        <text x="${aX - 34}" y="${aY + 3.5}" text-anchor="middle" fill="#ff9a4d" font-size="9" font-weight="800">A</text>
        <text x="${aX - 48}" y="${aY - 14}" fill="#ff9a4d" font-size="9" font-weight="700">A–A BOČNÍ</text>
      </g>
      <g aria-label="B–B Čelní řez">
        <line x1="${bX}" y1="${bY + 26}" x2="${bX}" y2="${bY + 7}" stroke="#ff7a1a" stroke-width="2"/>
        <path d="M ${bX} ${bY} L ${bX - 6} ${bY + 9} L ${bX + 6} ${bY + 9} Z" fill="#ff7a1a"/>
        <circle cx="${bX}" cy="${bY + 34}" r="10" fill="#101820" stroke="#ff7a1a" stroke-width="1.5"/>
        <text x="${bX}" y="${bY + 37.5}" text-anchor="middle" fill="#ff9a4d" font-size="9" font-weight="800">B</text>
        <text x="${bX + 15}" y="${bY + 38}" fill="#ff9a4d" font-size="9" font-weight="700">B–B ČELNÍ</text>
      </g>
    </g>
  `;

  const cellW = roomW / heatmap.nx;
  const cellH = roomH / heatmap.ny;
  const heatCells = heatmap.cells.map(c => {
    const x = ox + c.ix * cellW;
    const y = oy + c.iy * cellH;
const color = heatColor(c.spl, heatmap.min, heatmap.max);
    return `<rect x="${x}" y="${y}" width="${cellW + 0.7}" height="${cellH + 0.7}"
      fill="${color}" fill-opacity="0.44">
      <title>${c.spl.toFixed(1)} dB</title>
    </rect>`;
  }).join("");

  const iconSize = 28;
  const influences = floorSpeakerInfluence(placements, listenerXFt, listenerYFt);
  const circles = placements.map((p, idx) => {
    const xM = p.x * ftToM;
    const yM = p.y * ftToM;
    const cx = ox + xM * scale;
    const cy = oy + yM * scale;
    const influence = influences[idx]?.influence || "low";
    const strong = influence === "strong";
    const medium = influence === "medium";
    const opacity = strong ? 1 : medium ? 0.68 : 0.30;
    const ringStroke = strong ? "#ff7a1a" : medium ? "rgba(255,122,26,0.62)" : "rgba(170,180,190,0.42)";
    const ringWidth = strong ? 2.6 : medium ? 1.8 : 1.1;
    const haloOpacity = strong ? 0.22 : medium ? 0.08 : 0.025;
    const imageFilter = strong ? 'filter="url(#speaker-active-glow)"' : "";

    return `
      <g opacity="${opacity}">
        <circle cx="${cx}" cy="${cy}" r="${iconSize / 2 + 6}"
          fill="rgba(255,122,26,${haloOpacity})" stroke="${ringStroke}" stroke-width="${ringWidth}"/>
        <image href="assets/repro_ikona.png"
          x="${cx - iconSize / 2}" y="${cy - iconSize / 2}"
          width="${iconSize}" height="${iconSize}"
          preserveAspectRatio="xMidYMid meet" ${imageFilter}/>
        <circle cx="${cx}" cy="${cy}" r="${iconSize / 2}"
          fill="none" stroke="${ringStroke}" stroke-width="${ringWidth}"/>
        <text x="${cx}" y="${cy + 27}" text-anchor="middle" fill="#d0d7df" font-size="10">${idx + 1}</text>
      </g>`;
  }).join("");

  const listenerXM = listenerXFt * ftToM;
  const listenerYM = listenerYFt * ftToM;
  const lcx = ox + listenerXM * scale;
  const lcy = oy + listenerYM * scale;

  const listener = `
    <g class="listener-group" data-listener="true">
      <circle cx="${lcx}" cy="${lcy}" r="17" fill="#5ba5ff" stroke="#fff" stroke-width="2"/>
      <circle cx="${lcx}" cy="${lcy - 4}" r="4.5" fill="#fff"/>
      <ellipse cx="${lcx}" cy="${lcy + 6}" rx="7" ry="8" fill="#fff"/>
      <rect x="${lcx - 30}" y="${lcy - 48}" width="60" height="22" rx="6" fill="#101820" stroke="#5ba5ff"/>
      <text x="${lcx}" y="${lcy - 33}" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">
        ${listenerSPL.toFixed(1)} dB
      </text>
    </g>
  `;

  svg.innerHTML = floorDefs + rect + `<g clip-path="url(#${floorClipId})">${heatCells}</g>` + dims + viewDirections + circles + listener;
  updateHeatmapScaleLabels(heatmap);

  appState.latest = {
    ...appState.latest,
    floorGeom: { W, H, pad, scale, roomW, roomH, ox, oy, lengthFt, widthFt }
  };
}


function delaunayTriangulation(points) {
  if (!Array.isArray(points) || points.length < 3) return [];
  const pts = points.map((p, i) => ({x:p.x, y:p.y, i}));
  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  for (const p of pts) { minX=Math.min(minX,p.x); minY=Math.min(minY,p.y); maxX=Math.max(maxX,p.x); maxY=Math.max(maxY,p.y); }
  const d = Math.max(maxX-minX, maxY-minY, 1);
  const mx=(minX+maxX)/2, my=(minY+maxY)/2;
  const superPts=[
    {x:mx-20*d,y:my-10*d,i:-1},
    {x:mx,y:my+20*d,i:-2},
    {x:mx+20*d,y:my-10*d,i:-3}
  ];
  const all=pts.concat(superPts);
  const circum=(a,b,c)=>{
    const ax=a.x, ay=a.y, bx=b.x, by=b.y, cx=c.x, cy=c.y;
    const den=2*(ax*(by-cy)+bx*(cy-ay)+cx*(ay-by));
    if (Math.abs(den)<1e-10) return {x:0,y:0,r2:Infinity};
    const a2=ax*ax+ay*ay,b2=bx*bx+by*by,c2=cx*cx+cy*cy;
    const ux=(a2*(by-cy)+b2*(cy-ay)+c2*(ay-by))/den;
    const uy=(a2*(cx-bx)+b2*(ax-cx)+c2*(bx-ax))/den;
    const r2=(ux-ax)*(ux-ax)+(uy-ay)*(uy-ay);
    return {x:ux,y:uy,r2};
  };
  let triangles=[{a:pts.length,b:pts.length+1,c:pts.length+2}];
  for (let pi=0; pi<pts.length; pi++) {
    const p=all[pi], bad=[];
    for (let ti=0; ti<triangles.length; ti++) {
      const t=triangles[ti], cc=circum(all[t.a],all[t.b],all[t.c]);
      const dd=(p.x-cc.x)*(p.x-cc.x)+(p.y-cc.y)*(p.y-cc.y);
      if (dd <= cc.r2 + 1e-8) bad.push(ti);
    }
    const edgeMap=new Map();
    const addEdge=(u,v)=>{ const a=Math.min(u,v), b=Math.max(u,v), k=`${a}:${b}`; edgeMap.set(k,(edgeMap.get(k)||0)+1); };
    for (const ti of bad) { const t=triangles[ti]; addEdge(t.a,t.b); addEdge(t.b,t.c); addEdge(t.c,t.a); }
    const badSet=new Set(bad); triangles=triangles.filter((_,i)=>!badSet.has(i));
    for (const [k,count] of edgeMap) if (count===1) { const [a,b]=k.split(':').map(Number); triangles.push({a,b,c:pi}); }
  }
  return triangles.filter(t=>t.a<pts.length && t.b<pts.length && t.c<pts.length);
}

function spacingPlanEdges(placements, room) {
  const points=placements.map((p,i)=>({x:p.x/FEET_PER_METER,y:p.y/FEET_PER_METER,i}));
  if (points.length < 2) return [];
  if (points.length === 2) return [{a:0,b:1}];
  const triangles=delaunayTriangulation(points);
  const edges=new Map();
  const add=(a,b)=>{ const lo=Math.min(a,b), hi=Math.max(a,b), k=`${lo}:${hi}`; edges.set(k,{a:lo,b:hi}); };
  for (const t of triangles) { add(t.a,t.b); add(t.b,t.c); add(t.c,t.a); }
  // U konkávních půdorysů nezobrazujeme hranu, která vede přes výřez / mimo místnost.
  const segmentInside=(a,b)=>{
    if (!room) return true;
    const pa=points[a], pb=points[b];
    for (let k=1;k<12;k++) {
      const q=k/12, x=pa.x+(pb.x-pa.x)*q, y=pa.y+(pb.y-pa.y)*q;
      if (!isPointInsideRoomMeters(x,y,room)) return false;
    }
    return true;
  };
  return [...edges.values()].filter(e=>segmentInside(e.a,e.b));
}

function drawSpacingPlan({lengthM,widthM,room,placements}) {
  const svg=document.getElementById('spacingPlan');
  if (!svg) return;
  const W=900,H=560,pad=72;
  const scale=Math.min((W-pad*2)/Math.max(0.1,widthM),(H-pad*2)/Math.max(0.1,lengthM));
  const roomW=widthM*scale, roomH=lengthM*scale, ox=(W-roomW)/2, oy=(H-roomH)/2;
  const shape=roomSvgShape(room,ox,oy,scale);
  const pts=placements.map((p,i)=>({x:p.x/FEET_PER_METER,y:p.y/FEET_PER_METER,i}));
  const edges=spacingPlanEdges(placements,room);
  const defs=`<defs><filter id="spacing-label-shadow" x="-30%" y="-60%" width="160%" height="220%"><feDropShadow dx="0" dy="1" stdDeviation="1.2" flood-color="#000" flood-opacity="0.7"/></filter></defs>`;
  const edgeSvg=edges.map(e=>{
    const a=pts[e.a],b=pts[e.b],x1=ox+a.x*scale,y1=oy+a.y*scale,x2=ox+b.x*scale,y2=oy+b.y*scale;
    const dist=Math.hypot(b.x-a.x,b.y-a.y), mx=(x1+x2)/2,my=(y1+y2)/2;
    const label=`${dist.toFixed(2).replace('.',',')} m`, w=Math.max(42,label.length*6.4+12);
    return `<g class="spacing-edge"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#8fa0b2" stroke-width="1.35" opacity="0.88"/><g transform="translate(${mx} ${my})" filter="url(#spacing-label-shadow)"><rect x="${-w/2}" y="-9" width="${w}" height="18" rx="5" fill="#101820" stroke="#536273" stroke-width="0.8"/><text x="0" y="3.5" text-anchor="middle" fill="#f2f5f8" font-size="9.5" font-weight="700">${label}</text></g></g>`;
  }).join('');
  const iconSize=30;
  const speakerSvg=pts.map(p=>{
    const cx=ox+p.x*scale, cy=oy+p.y*scale;
    return `<g><circle cx="${cx}" cy="${cy}" r="${iconSize/2+4}" fill="#101820" stroke="#ff7a1a" stroke-width="1.8"/><image href="assets/repro_ikona.png" x="${cx-iconSize/2}" y="${cy-iconSize/2}" width="${iconSize}" height="${iconSize}" preserveAspectRatio="xMidYMid meet"/><text x="${cx}" y="${cy+28}" text-anchor="middle" fill="#dfe6ee" font-size="11" font-weight="800">${p.i+1}</text></g>`;
  }).join('');
  const dims=`<text x="${W/2}" y="${oy+roomH+34}" text-anchor="middle" fill="#dfe6ee" font-size="15" font-weight="700">Šířka: ${widthM.toFixed(1)} m</text><text x="${ox-26}" y="${H/2}" text-anchor="middle" fill="#dfe6ee" font-size="15" font-weight="700" transform="rotate(-90 ${ox-26} ${H/2})">Délka: ${lengthM.toFixed(1)} m</text>`;
  svg.innerHTML=defs+shape+edgeSvg+speakerSvg+dims;
}


function conePolygonPoints(cx, topY, bottomY, halfWidth) {
  return `${cx},${topY} ${cx - halfWidth},${bottomY} ${cx + halfWidth},${bottomY}`;
}

function calculateSectionListenerSpl(axis, listenerAxisM) {
  const s = appState.latest;
  if (!s) return null;

  const xFt = axis === "width"
    ? listenerAxisM * FEET_PER_METER
    : appState.listenerXFt;

  const yFt = axis === "length"
    ? listenerAxisM * FEET_PER_METER
    : appState.listenerYFt;

  return calculateSPLAtPoint({
    xFt,
    yFt,
    listenerHeightFt: s.listenerHeightFt,
    placements: s.placements,
    mountingHeightFt: s.mountingHeightFt,
    speaker: s.speaker,
    tap: s.power.recommendedTap
  });
}

function drawSectionView({
  svgId,
  axis,
  lengthM,
  widthM,
  heightM,
  placements,
  speaker,
  mountingHeightFt,
  listenerHeightFt,
  listenerXFt,
  listenerYFt
}) {
  const svg = document.getElementById(svgId);
  if (!svg) return;

  const W = 900;
  const padX = 64;
  const padTop = 42;
  const padBottom = 82;

  const axisLengthM = axis === "length" ? lengthM : widthM;

  // Stejné fyzické měřítko v ose X i Y:
  // 1 metr vodorovně = 1 metr svisle.
  // Šířka grafu zůstává stejná, dynamická je pouze výška.
  const usableW = W - padX * 2;
  // Vodorovná osa zůstává vždy přes celou šířku. Do výšky držíme fyzické
  // měřítko 1:1 jen do 5 m; vyšší místnosti už graf dál nezvětšují.
  const pxPerMeter = usableW / Math.max(0.1, axisLengthM);
  const maxPhysicalHeightM = 5;

  const roomW = usableW;
  const naturalRoomH = heightM * pxPerMeter;
  const maxRoomH = maxPhysicalHeightM * pxPerMeter;
  const roomH = Math.max(120, Math.min(naturalRoomH, maxRoomH));
  const pxPerMeterY = roomH / Math.max(0.1, heightM);
  const H = padTop + roomH + padBottom;

  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.style.aspectRatio = `${W} / ${H}`;

  const ox = padX;
  const oy = padTop;
  const floorY = oy + roomH;
  const ceilingY = oy;

  const mountHeightM = mountingHeightFt / FEET_PER_METER;
  const listenerHeightM = listenerHeightFt / FEET_PER_METER;
  const speakerY = floorY - mountHeightM * pxPerMeterY;
  const earY = floorY - listenerHeightM * pxPerMeterY;

  const halfAngleRad = Math.max(1, Math.min(179, speaker.coverageAngle)) * Math.PI / 360;
  const verticalDistanceToEarM = Math.max(0.05, mountHeightM - listenerHeightM);
  // Pro nominální kužel v řezu kreslíme vyzařování až k podlaze, stejně jako SSC.
  // Rovina uší zůstává jen jako referenční linka, nikoli jako ukončení kuželu.
  const verticalDistanceToFloorM = Math.max(0.05, mountHeightM);
  const halfCoverageAtFloorM = Math.tan(halfAngleRad) * verticalDistanceToFloorM;

  const listenerAxisM = (axis === "length" ? listenerYFt : listenerXFt) / FEET_PER_METER;
  const listenerCrossM = (axis === "length" ? listenerXFt : listenerYFt) / FEET_PER_METER;
  const listenerXM = listenerXFt / FEET_PER_METER;
  const listenerYM = listenerYFt / FEET_PER_METER;
  const listenerSpl = calculateSectionListenerSpl(axis, listenerAxisM);

  // Stejná geometrická klasifikace jako v půdorysu:
  // strong = posluchač je uvnitř kuželu v rovině uší,
  // medium = posluchač je mimo kužel v rovině uší, ale jeho půdorysná pozice
  //          ještě leží uvnitř kuželu promítnutého až k podlaze,
  // low = mimo oba rozsahy.
  const radiusAtEarM = Math.tan(halfAngleRad) * verticalDistanceToEarM;
  const radiusAtFloorM = Math.tan(halfAngleRad) * verticalDistanceToFloorM;
  const sectionSpeakers = placements.map((p, index) => {
    const xM = p.x / FEET_PER_METER;
    const yM = p.y / FEET_PER_METER;
    const axisM = axis === "length" ? yM : xM;
    const crossM = axis === "length" ? xM : yM;
    const horizontalM = Math.hypot(xM - listenerXM, yM - listenerYM);
    const crossDistanceM = Math.abs(crossM - listenerCrossM);
    let influence = "low";
    if (horizontalM <= radiusAtEarM + 1e-9) influence = "strong";
    else if (horizontalM <= radiusAtFloorM + 1e-9) influence = "medium";
    return {index, xM, yM, axisM, crossM, horizontalM, crossDistanceM, influence};
  });

  const clipId = `${svgId}-room-clip`;
  const defs = `
    <defs>
      <clipPath id="${clipId}">
        <rect x="${ox}" y="${oy}" width="${roomW}" height="${roomH}" rx="4"/>
      </clipPath>
    </defs>
  `;

  const roomRect = `<rect x="${ox}" y="${oy}" width="${roomW}" height="${roomH}" rx="4"
    fill="#111820" stroke="#7d8998" stroke-width="2"/>`;

  const earLine = `
    <line x1="${ox}" y1="${earY}" x2="${ox + roomW}" y2="${earY}"
      stroke="#79aef7" stroke-width="1.4" stroke-dasharray="7 7" opacity="0.8"/>
    <text x="${ox + 8}" y="${earY - 8}" fill="#9bc2f7" font-size="11">
      rovina uší ${listenerHeightM.toFixed(2)} m
    </text>
  `;

  const floorCeilingLabels = `
    <text x="${ox - 10}" y="${ceilingY + 4}" text-anchor="end" fill="#9ba8b7" font-size="11">strop</text>
    <text x="${ox - 10}" y="${floorY}" text-anchor="end" fill="#9ba8b7" font-size="11">podlaha</text>
    <text x="${W/2}" y="${floorY + 62}" text-anchor="middle" fill="#9ba8b7" font-size="12">
      ${axis === "length" ? "délka" : "šířka"} ${axisLengthM.toFixed(1)} m
    </text>
    <text x="${ox - 34}" y="${oy + roomH/2}" text-anchor="middle" fill="#9ba8b7" font-size="12"
      transform="rotate(-90 ${ox - 34} ${oy + roomH/2})">
      výška ${heightM.toFixed(1)} m
    </text>
  `;

  const coneSvg = sectionSpeakers.map(item => {
    const cx = ox + item.axisM * pxPerMeter;
    const bottomY = floorY;
    const halfWidthPx = halfCoverageAtFloorM * pxPerMeter;
    const pts = conePolygonPoints(cx, speakerY, bottomY, halfWidthPx);
    const style = item.influence === "strong"
      ? {fill:"rgba(255,122,26,0.22)", stroke:"rgba(255,150,70,0.95)", width:1.8}
      : item.influence === "medium"
        ? {fill:"rgba(255,122,26,0.075)", stroke:"rgba(255,150,70,0.42)", width:1.1}
        : {fill:"rgba(155,165,178,0.018)", stroke:"rgba(155,165,178,0.16)", width:0.8};

    return `
      <polygon points="${pts}"
        fill="${style.fill}"
        stroke="${style.stroke}"
        stroke-width="${style.width}"/>
    `;
  }).join("");

  const speakersSvg = sectionSpeakers.map(item => {
    const cx = ox + item.axisM * pxPerMeter;
    const strong = item.influence === "strong";
    const medium = item.influence === "medium";
    const fill = strong ? "#ff7a1a" : medium ? "#b96a32" : "#69727e";
    const stroke = strong ? "#fff0e4" : medium ? "#c99a76" : "#89929e";
    const opacity = strong ? 1 : medium ? 0.62 : 0.28;
    const r = strong ? 7 : medium ? 6 : 5;
    return `
      <g opacity="${opacity}">
        <line x1="${cx}" y1="${ceilingY}" x2="${cx}" y2="${speakerY}"
          stroke="${stroke}" stroke-width="${strong ? 1.4 : 0.9}"/>
        <circle cx="${cx}" cy="${speakerY}" r="${r}"
          fill="${fill}" stroke="${stroke}" stroke-width="${strong ? 1.8 : 1}"/>
      </g>
    `;
  }).join("");

  // Číslování reproduktorů v řezu. Reproduktory, které se v projekci řezu
  // překrývají (mají stejnou / téměř stejnou pozici v hlavní ose), sdílí
  // jeden popisek, např. „1, 3, 5, 7“.
  const projectedSpeakerGroups = [];
  const labelMergeTolerancePx = 9;
  [...sectionSpeakers]
    .map(item => ({...item, cx: ox + item.axisM * pxPerMeter}))
    .sort((a, b) => a.cx - b.cx || a.index - b.index)
    .forEach(item => {
      const last = projectedSpeakerGroups[projectedSpeakerGroups.length - 1];
      if (last && Math.abs(last.cx - item.cx) <= labelMergeTolerancePx) {
        last.items.push(item);
        last.cx = last.items.reduce((sum, x) => sum + x.cx, 0) / last.items.length;
      } else {
        projectedSpeakerGroups.push({cx: item.cx, items: [item]});
      }
    });

  const speakerNumberLabelsSvg = projectedSpeakerGroups.map(group => {
    const orderedItems = [...group.items].sort((a, b) => a.index - b.index);
    const nearest = orderedItems.reduce((best, item) =>
      !best || item.horizontalM < best.horizontalM ? item : best, null);
    const strongestInfluence = group.items.some(item => item.influence === "strong")
      ? "strong"
      : group.items.some(item => item.influence === "medium") ? "medium" : "low";
    const opacity = strongestInfluence === "strong" ? 1 : strongestInfluence === "medium" ? 0.88 : 0.64;
    const labelY = Math.max(23, speakerY - 18);
    const cellW = 28;
    const cellH = 24;
    const totalW = orderedItems.length * cellW;
    const startX = group.cx - totalW / 2;
    const boxY = labelY - cellH + 5;

    const separators = orderedItems.slice(1).map((_, idx) => {
      const x = startX + (idx + 1) * cellW;
      return `<line x1="${x}" y1="${boxY + 5}" x2="${x}" y2="${boxY + cellH - 5}"
        stroke="#4b5866" stroke-width="1"/>`;
    }).join("");

    const cells = orderedItems.map((item, idx) => {
      const isNearest = nearest && item.index === nearest.index;
      const x = startX + idx * cellW;
      return `
        <g>
          ${isNearest ? `<rect x="${x + 2}" y="${boxY + 2}" width="${cellW - 4}" height="${cellH - 4}" rx="6"
            fill="#ff7a1a" stroke="#ffd7ba" stroke-width="1.4"/>` : ""}
          <text x="${x + cellW/2}" y="${labelY}" text-anchor="middle"
            fill="${isNearest ? "#101820" : "#eef3f8"}" font-size="${isNearest ? 15 : 14}"
            font-weight="${isNearest ? 900 : 800}">${item.index + 1}</text>
          ${isNearest ? `<path d="M ${x + cellW/2 - 4} ${boxY + cellH + 2} L ${x + cellW/2} ${boxY + cellH + 7} L ${x + cellW/2 + 4} ${boxY + cellH + 2} Z" fill="#ff7a1a"/>` : ""}
        </g>`;
    }).join("");

    return `
      <g class="section-speaker-number-group" opacity="${opacity}">
        <rect x="${startX}" y="${boxY}" width="${totalW}" height="${cellH}" rx="8"
          fill="#101820" fill-opacity="0.94" stroke="#596573" stroke-width="1.1"/>
        ${separators}
        ${cells}
      </g>`;
  }).join("");

  const listenerCx = ox + listenerAxisM * pxPerMeter;
  const splLabel = Number.isFinite(listenerSpl) ? `${listenerSpl.toFixed(1)} dB` : "—";

  // Kóta polohy posluchače od levé stěny řezu.
  const listenerDimY = floorY + 20;
  const listenerDimensionSvg = `
    <g class="section-listener-dimension" pointer-events="none">
      <line x1="${ox}" y1="${listenerDimY}" x2="${listenerCx}" y2="${listenerDimY}"
        stroke="#9ba8b7" stroke-width="1.2"/>
      <line x1="${ox}" y1="${listenerDimY - 6}" x2="${ox}" y2="${listenerDimY + 6}"
        stroke="#9ba8b7" stroke-width="1.2"/>
      <line x1="${listenerCx}" y1="${listenerDimY - 6}" x2="${listenerCx}" y2="${listenerDimY + 6}"
        stroke="#9ba8b7" stroke-width="1.2"/>
      <path d="M ${ox + 8} ${listenerDimY - 4} L ${ox} ${listenerDimY} L ${ox + 8} ${listenerDimY + 4}"
        fill="none" stroke="#9ba8b7" stroke-width="1.2"/>
      <path d="M ${listenerCx - 8} ${listenerDimY - 4} L ${listenerCx} ${listenerDimY} L ${listenerCx - 8} ${listenerDimY + 4}"
        fill="none" stroke="#9ba8b7" stroke-width="1.2"/>
      <rect x="${Math.max(ox + 4, (ox + listenerCx) / 2 - 47)}" y="${listenerDimY + 7}" width="94" height="18" rx="4"
        fill="#111820" opacity="0.94"/>
      <text x="${(ox + listenerCx) / 2}" y="${listenerDimY + 20}" text-anchor="middle"
        fill="#d5dce5" font-size="11" font-weight="700">${listenerAxisM.toFixed(2)} m</text>
    </g>
  `;

  const listenerSvg = `
    <g class="section-listener" data-section-axis="${axis}" style="cursor: ew-resize">
      <rect x="${listenerCx - 31}" y="${earY - 44}" width="62" height="22" rx="6"
        fill="#101820" stroke="#5ba5ff"/>
      <text x="${listenerCx}" y="${earY - 29}" text-anchor="middle"
        fill="#fff" font-size="11" font-weight="700">${splLabel}</text>
      <circle cx="${listenerCx}" cy="${earY}" r="9"
        fill="#5ba5ff" stroke="#fff" stroke-width="1.5"/>
      <line x1="${listenerCx}" y1="${earY + 9}" x2="${listenerCx}" y2="${floorY - 8}"
        stroke="#5ba5ff" stroke-width="2"/>
    </g>
  `;

  svg.innerHTML = defs + roomRect + `<g clip-path="url(#${clipId})">${coneSvg}</g>` + earLine + floorCeilingLabels + speakersSvg + speakerNumberLabelsSvg + listenerDimensionSvg + listenerSvg;

  if (!appState.sectionGeom) appState.sectionGeom = {};
  appState.sectionGeom[svgId] = {
    axis,
    W,
    H,
    ox,
    oy,
    roomW,
    roomH,
    pxPerMeter,
    pxPerMeterY,
    axisLengthM,
    floorY,
    earY
  };

  const meta = document.getElementById(svgId === "sideView" ? "sideViewMeta" : "frontViewMeta");
  if (meta) {
    const spacingFt = axis === "length"
      ? appState.latest?.coverage?.spacingY
      : appState.latest?.coverage?.spacingX;

    const spacingM = spacingFt ? spacingFt / FEET_PER_METER : 0;

    meta.textContent =
      `Výška místnosti ${heightM.toFixed(1)} m • rovina posluchače ${listenerHeightM.toFixed(2)} m • ` +
      `úhel ${speaker.coverageAngle.toFixed(0)}° • rozteč ${spacingM.toFixed(2)} m • oranžová = významný vliv na posluchače`;
  }
}

function drawAllSectionViews() {
  const s = appState.latest;
  if (!s) return;

  drawSectionView({
    svgId: "sideView",
    axis: "length",
    lengthM: s.lengthM,
    widthM: s.widthM,
    heightM: s.heightM,
    placements: s.placements,
    speaker: s.speaker,
    mountingHeightFt: s.mountingHeightFt,
    listenerHeightFt: s.listenerHeightFt,
    listenerXFt: appState.listenerXFt,
    listenerYFt: appState.listenerYFt
  });

  drawSectionView({
    svgId: "frontView",
    axis: "width",
    lengthM: s.lengthM,
    widthM: s.widthM,
    heightM: s.heightM,
    placements: s.placements,
    speaker: s.speaker,
    mountingHeightFt: s.mountingHeightFt,
    listenerHeightFt: s.listenerHeightFt,
    listenerXFt: appState.listenerXFt,
    listenerYFt: appState.listenerYFt
  });
}

function pointerToSectionPosition(evt, svgId) {
  const svg = document.getElementById(svgId);
  const g = appState.sectionGeom?.[svgId];
  if (!svg || !g) return null;

  const rect = svg.getBoundingClientRect();
  const px = (evt.clientX - rect.left) * (g.W / rect.width);
  const clampedX = Math.max(g.ox, Math.min(g.ox + g.roomW, px));
  const axisM = (clampedX - g.ox) / g.pxPerMeter;

  return Math.max(0, Math.min(g.axisLengthM, axisM));
}

function updateListenerFromSection(evt, svgId) {
  const g = appState.sectionGeom?.[svgId];
  if (!g) return;

  const axisM = pointerToSectionPosition(evt, svgId);
  if (axisM === null) return;

  if (g.axis === "length") {
    appState.listenerYFt = axisM * FEET_PER_METER;
  } else {
    appState.listenerXFt = axisM * FEET_PER_METER;
  }

  refreshListenerOnly();
}

function formatMetersFromFeet(ft) {
  return (ft / FEET_PER_METER).toFixed(2) + " m";
}

function refreshListenerOnly() {
  if (!appState.latest) return;
  const s = appState.latest;

  if (s.room) {
    const p = clampPointToRoomMeters(appState.listenerXFt / FEET_PER_METER, appState.listenerYFt / FEET_PER_METER, s.room);
    appState.listenerXFt = p.xM * FEET_PER_METER;
    appState.listenerYFt = p.yM * FEET_PER_METER;
  }

  const listenerSPL = calculateSPLAtPoint({
    xFt: appState.listenerXFt,
    yFt: appState.listenerYFt,
    listenerHeightFt: s.listenerHeightFt,
    placements: s.placements,
    mountingHeightFt: s.mountingHeightFt,
    speaker: s.speaker,
    tap: s.power.recommendedTap
  });

  document.getElementById("listenerSplValue").textContent = `${listenerSPL.toFixed(1)} dB`;
  document.getElementById("listenerPositionValue").textContent =
    `${(appState.listenerXFt / FEET_PER_METER).toFixed(1)} × ${(appState.listenerYFt / FEET_PER_METER).toFixed(1)} m`;
  updateSpatialAudioGain(listenerSPL);

  drawFloorPlan({
    lengthM: s.lengthM,
    widthM: s.widthM,
    lengthFt: s.lengthFt,
    widthFt: s.widthFt,
    room: s.room,
    placements: s.placements,
    coverage: s.coverage,
    speakerModel: s.speaker.model,
    heatmap: s.visualHeatmap || s.heatmap,
    listenerXFt: appState.listenerXFt,
    listenerYFt: appState.listenerYFt,
    listenerSPL
  });
  drawAllSectionViews();
}


function populateUseCaseOptions() {
  const select = document.getElementById("useCase");
  if (!select) return;
  const current = select.value || "background";
  select.innerHTML = "";
  for (const key of ["background","foreground","general","speech","paging","utility"]) {
    const uc = USE_CASES[key];
    if (!uc) continue;
    const option = document.createElement("option");
    option.value = key;
    option.textContent = uc.label;
    select.appendChild(option);
  }
  if ([...select.options].some(o => o.value === current)) select.value = current;
}

function populateCoverageOptions() {
  const select = document.getElementById("coverageDensity");
  const czechCoverageLabels = {
    "center-to-center": "Střed ke středu",
    "min-overlap": "Minimální překrytí",
    "balanced": "Vyvážené překrytí",
    "edge-to-edge": "Hrana k hraně",
    "extended": "Rozšířené rozestupy"
  };
  if (!select) return;
  const current = select.value || "edge-to-edge";
  select.innerHTML = "";
  for (const [key, mode] of Object.entries(COVERAGE_MODES).sort((a,b) => a[1].variation - b[1].variation)) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = `${czechCoverageLabels[key] || mode.label} (cca ±${mode.variation} dB)`;
    select.appendChild(option);
  }
  if ([...select.options].some(o => o.value === current)) select.value = current;
  else if ([...select.options].some(o => o.value === "edge-to-edge")) select.value = "edge-to-edge";
}

function getAvailableTapsForSpeaker(speaker, voltage) {
  if (!speaker) return [];
  const taps = voltage === "100V" ? (speaker.taps100 || []) : (speaker.taps || []);
  return [...new Set(taps.filter(v => Number.isFinite(v) && v > 0))].sort((a,b) => a-b);
}

function populateTapOverrideOptions(speaker, voltage, preferredValue = "auto", autoTap = null) {
  const select = document.getElementById("tapOverride");
  if (!select) return;

  const current = select.value || preferredValue || "auto";
  const taps = getAvailableTapsForSpeaker(speaker, voltage);

  select.innerHTML = "";
  const auto = document.createElement("option");
  auto.value = "auto";
  auto.textContent = Number.isFinite(autoTap)
    ? `Automaticky – ${String(autoTap).replace(".", ",")} W`
    : "Automaticky";
  select.appendChild(auto);

  for (const tap of taps) {
    const option = document.createElement("option");
    option.value = String(tap);
    option.textContent = `${String(tap).replace(".", ",")} W`;
    select.appendChild(option);
  }

  if ([...select.options].some(o => o.value === current)) {
    select.value = current;
  } else {
    select.value = "auto";
  }
}

function populateSpeakerOverrideOptions() {
  const select = document.getElementById("speakerOverride");
  if (!select) return;
  const current = select.value || "auto";
  select.innerHTML = `<option value="auto">Automaticky – doporučený model</option>`;

  const groups = [
    ["Stropní reproduktory", SPEAKERS.filter(s => s.type === "Ceiling")],
    ["Závěsné reproduktory", SPEAKERS.filter(s => s.type === "Pendant")]
  ];

  for (const [label, items] of groups) {
    const group = document.createElement("optgroup");
    group.label = label;
    for (const speaker of items) {
      const option = document.createElement("option");
      option.value = speaker.model;
      option.textContent = speaker.model;
      group.appendChild(option);
    }
    select.appendChild(group);
  }
  if ([...select.options].some(o => o.value === current)) select.value = current;
}

function evaluateSpeakerSuitability({
  selectedSpeaker, recommendedSpeaker, speakerType,
  targetSPL, heatmap, power, coverage, recommendedCoverage
}) {
  if (selectedSpeaker.model === recommendedSpeaker.model) {
    return {
      level: "recommended",
      label: "Doporučeno",
      reason: "Tento model nejlépe odpovídá zadané výšce, ploše, typu instalace a způsobu použití."
    };
  }

  const reasons = [];
  let penalty = 0;
  const expectedType = speakerType === "ceiling" ? "Ceiling" : "Pendant";

  if (selectedSpeaker.type !== expectedType) {
    reasons.push(expectedType === "Ceiling"
      ? "Model není určen pro stropní instalaci."
      : "Model není určen pro závěsnou instalaci.");
    penalty += 4;
  }

  if (heatmap.min < targetSPL - 3) {
    reasons.push(`Minimum SPL je ${heatmap.min.toFixed(1)} dB, tedy pod cílem ${targetSPL.toFixed(0)} dB.`);
    penalty += 3;
  } else if (heatmap.min < targetSPL) {
    reasons.push(`V části prostoru je SPL mírně pod cílem ${targetSPL.toFixed(0)} dB.`);
    penalty += 1;
  }

  if (coverage.count > recommendedCoverage.count * 1.5) {
    reasons.push(`Vyžaduje výrazně více reproduktorů (${coverage.count} místo ${recommendedCoverage.count}).`);
    penalty += 2;
  } else if (coverage.count > recommendedCoverage.count) {
    reasons.push(`Vyžaduje více reproduktorů (${coverage.count} místo ${recommendedCoverage.count}).`);
    penalty += 1;
  }

  if (heatmap.spread > 8) {
    reasons.push(`Rovnoměrnost je horší – rozdíl max–min je ${heatmap.spread.toFixed(1)} dB.`);
    penalty += 2;
  } else if (heatmap.spread > 5) {
    reasons.push(`Rozdíl max–min je ${heatmap.spread.toFixed(1)} dB.`);
    penalty += 1;
  }

  if (selectedSpeaker.coverageAngle < recommendedSpeaker.coverageAngle) {
    reasons.push("Užší vyzařovací úhel vyžaduje pečlivější rozmístění.");
    penalty += 1;
  }

  if (selectedSpeaker.wooferSize > recommendedSpeaker.wooferSize &&
      coverage.count >= recommendedCoverage.count) {
    reasons.push("Model je pro tuto aplikaci zbytečně velký nebo výkonný bez snížení počtu kusů.");
    penalty += 1;
  }

  if (reasons.length === 0) {
    reasons.push("Alternativní model splňuje základní požadavky, ale není výchozí doporučenou volbou.");
  }

  if (penalty >= 5) return {level:"not-recommended", label:"Nedoporučeno", reason:reasons.join(" ")};
  if (penalty >= 2) return {level:"less-suitable", label:"Méně vhodné", reason:reasons.join(" ")};
  return {level:"suitable", label:"Vhodné", reason:reasons.join(" ")};
}

function updateSuitabilityUI(result) {
  const badge = document.getElementById("statusBadge");
  const reason = document.getElementById("recommendationReason");
  badge.className = "badge";
  badge.classList.add(
    result.level === "recommended" ? "status-recommended" :
    result.level === "suitable" ? "status-suitable" :
    result.level === "less-suitable" ? "status-less-suitable" :
    "status-not-recommended"
  );
  badge.textContent = result.label;
  reason.textContent = result.reason;
}


const PRICE_ENDPOINT = "/api/prices";
const PRICE_DATA = new Map();
let PRICE_DATA_UPDATED_AT = null;
let PRICE_DATA_LOAD_STATE = "idle";

async function loadPriceData() {
  PRICE_DATA_LOAD_STATE = "loading";
  const statusEl = document.getElementById("priceDataStatus");

  try {
    const response = await fetch(`${PRICE_ENDPOINT}?_=${Date.now()}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = await response.json();
    const items = payload?.items || payload?.prices || payload;

    if (!items || typeof items !== "object") {
      throw new Error("Neplatný formát cenových dat");
    }

    PRICE_DATA.clear();

    for (const [code, raw] of Object.entries(items)) {
      if (!code) continue;

      const item = typeof raw === "number"
        ? { priceVat: raw }
        : raw;

      const priceVat = Number(item?.priceVat ?? item?.PRICE_VAT ?? item?.price_vat);

      if (Number.isFinite(priceVat)) {
        PRICE_DATA.set(code, {
          ...item,
          priceVat
        });
      }
    }

    PRICE_DATA_UPDATED_AT = payload?.updatedAt || payload?.updated_at || null;
    PRICE_DATA_LOAD_STATE = PRICE_DATA.size > 0 ? "ready" : "empty";

    if (statusEl) {
      statusEl.textContent = PRICE_DATA.size > 0
        ? "Ceny načteny"
        : "Cenový feed je prázdný";
    }

    return PRICE_DATA.size > 0;
  } catch (error) {
    PRICE_DATA_LOAD_STATE = "unavailable";
    if (statusEl) {
      statusEl.textContent = "Cenový feed zatím není připojen";
      statusEl.title = String(error?.message || error);
    }
    return false;
  }
}

function formatCzk(value) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0
  }).format(value);
}

function getPriceByAvCode(avCode) {
  if (!avCode) return null;
  const item = PRICE_DATA.get(avCode);
  return item && Number.isFinite(item.priceVat) ? item : null;
}


function getPriceItemUrl(item) {
  if (!item) return "";
  const raw = item.url || item.URL || item.productUrl || item.product_url || item.link || "";
  if (typeof raw !== "string") return "";
  const url = raw.trim();
  return /^https?:\/\//i.test(url) ? url : "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getSpeakerProductImageSrc(speaker) {
  if (!speaker) return "";
  let raw = String(speaker.image || "").trim();
  // Pokud feed obrázek neuvádí, použijeme jako bezpečný fallback model.
  if (!raw) raw = String(speaker.model || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw) || raw.startsWith("data:") || raw.startsWith("blob:")) return raw;
  if (raw.startsWith("assets/")) return raw;
  if (!/\.[a-z0-9]{2,5}$/i.test(raw)) raw += ".webp";
  return `assets/products/${raw}`;
}

function getAmplifierProductImageSrc(amplifier) {
  if (!amplifier) return "";
  let raw = String(amplifier.image || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw) || raw.startsWith("data:") || raw.startsWith("blob:")) return raw;
  if (raw.startsWith("assets/")) return raw;
  if (!/\.[a-z0-9]{2,5}$/i.test(raw)) raw += ".webp";
  return `assets/products/${raw}`;
}

function renderAmplifierProductImage(amplifier) {
  const slot = document.getElementById("amplifierProductImageSlot");
  if (!slot) return;
  const src = getAmplifierProductImageSrc(amplifier);
  if (!src) {
    slot.hidden = true;
    slot.innerHTML = "";
    return;
  }
  slot.hidden = false;
  slot.innerHTML = `<img src="${escapeHtml(src)}" alt="${escapeHtml(amplifier?.model ? `Obrázek ${amplifier.model}` : "Obrázek zesilovače")}">`;
  const img = slot.querySelector("img");
  if (img) img.onerror = () => { slot.hidden = true; slot.innerHTML = ""; };
}

function renderSpeakerProductImage(speaker) {
  const img = document.getElementById("resultSpeakerImage");
  if (!img) return;
  const src = getSpeakerProductImageSrc(speaker);
  if (!src) {
    img.hidden = true;
    img.removeAttribute("src");
    return;
  }
  img.hidden = false;
  img.alt = speaker?.model ? `Obrázek ${speaker.model}` : "Obrázek reproduktoru";
  img.onerror = () => { img.hidden = true; };
  img.onload = () => { img.hidden = false; };
  img.src = src;
}
function updatePriceSummary({speaker, speakerCount, amplifierRecommendation}) {
  const body = document.getElementById("priceSummaryBody");
  const totalEl = document.getElementById("priceGrandTotal");
  const statusEl = document.getElementById("priceDataStatus");
  const noteEl = document.getElementById("priceSummaryNote");
  if (!body || !totalEl) return;

  const rows = [];

  rows.push({
    name: `${speaker.manufacturer || ""} ${speaker.model}`.trim(),
    qty: speakerCount,
    imageSrc: getSpeakerProductImageSrc(speaker),
    priceItem: getPriceByAvCode(speaker.avCode)
  });

  if (amplifierRecommendation?.found) {
    const a = amplifierRecommendation.amp;
    rows.push({
      name: `${a.manufacturer || ""} ${a.model}`.trim(),
      qty: amplifierRecommendation.ampCount || 1,
      imageSrc: getAmplifierProductImageSrc(a),
      priceItem: getPriceByAvCode(a.avCode)
    });
  }

  let total = 0;
  let complete = true;

  body.innerHTML = rows.map(row => {
    const price = row.priceItem?.priceVat;
    const subtotal = Number.isFinite(price) ? price * row.qty : null;
    if (Number.isFinite(subtotal)) total += subtotal;
    else complete = false;

    return `
      <tr>
        <td>
          <div class="price-product-cell">
            ${row.imageSrc ? `<img class="price-product-image" src="${escapeHtml(row.imageSrc)}" alt="" onerror="this.style.display='none'">` : ""}
            <span>${
              getPriceItemUrl(row.priceItem)
                ? `<a class="price-product-link" href="${escapeHtml(getPriceItemUrl(row.priceItem))}" target="_blank" rel="noopener noreferrer" title="Otevřít produkt na AV Integra">${escapeHtml(row.name)}</a>`
                : escapeHtml(row.name)
            }</span>
          </div>
        </td>
        <td>${row.qty}×</td>
        <td>${formatCzk(price)}</td>
        <td>${formatCzk(subtotal)}</td>
      </tr>
    `;
  }).join("");

  totalEl.textContent = complete ? formatCzk(total) : "—";

  if (PRICE_DATA.size > 0) {
    statusEl.textContent = complete ? "Ceny načteny" : "Ceny částečně dostupné";
    noteEl.textContent = complete
      ? `Ceny jsou uvedeny včetně DPH${PRICE_DATA_UPDATED_AT ? ` • aktualizace ${PRICE_DATA_UPDATED_AT}` : ""}.`
      : "U některých položek chybí cena; celková cena proto není zobrazena.";
  } else {
    statusEl.textContent = PRICE_DATA_LOAD_STATE === "unavailable"
      ? "Cenový feed zatím není připojen"
      : "Připraveno pro cenový feed";
    noteEl.textContent =
      "Kalkulátor je připraven na endpoint /api/prices. Dokud není serverová část nasazená, výpočet funguje normálně bez cen.";
  }
}


function recommendAmplifier({
  zonePower,
  voltage,
  useCase,
  priority = "balanced",
  dantePreference = "any"
}) {
  const uc = USE_CASES[useCase] || {};
  const configuredHeadroomFactor = numValue(
    uc.ampHeadroomFactor,
    AMP_RULES.AMP_HEADROOM_WITHOUT_SUBS || 1.2
  );
  // Pro instalační zesilovač používáme minimálně 20% výkonovou rezervu.
  // Pokud má konkrétní typ použití nastavenou vyšší rezervu, zachová se.
  const headroomFactor = Math.max(1.20, configuredHeadroomFactor);
  const requiredPower = zonePower * headroomFactor;
  const maxSplits = Math.max(1, Math.round(AMP_RULES.MAX_SPLIT_PER_ZONE || 5));
  const maxAmps = Math.max(1, Math.round(AMP_RULES.MAX_AMPS_ABSOLUTE || 8));

  let supported = AMPLIFIERS.filter(a =>
    voltage === "100V" ? a.supports100V : a.supports70V
  );

  if (dantePreference === "required") {
    supported = supported.filter(a => a.hasDante);
  } else if (dantePreference === "exclude") {
    supported = supported.filter(a => !a.hasDante);
  }

  if (!supported.length) {
    return { found: false, requiredPower, headroomFactor, reason: "filter" };
  }

  // Nejprve hledáme model, který zvládne zónu včetně výkonové rezervy
  // na jednom efektivním výstupu. Dělení zóny použijeme až v případě,
  // že žádný aktivní model nemá dostatečný výkon na zónu.
  let candidates = supported.filter(a => a.powerPerZone >= requiredPower);
  const directFitExists = candidates.length > 0;

  if (!directFitExists) {
    const maxPowerPerZone = Math.max(...supported.map(a => a.powerPerZone));
    candidates = supported.filter(a => a.powerPerZone === maxPowerPerZone);
  }

  const evaluated = candidates.map(a => {
    const splitsNeeded = directFitExists
      ? 1
      : Math.ceil(requiredPower / Math.max(1, a.powerPerZone));

    const channelsNeeded = splitsNeeded * Math.max(1, a.channelsPerZone);
    const ampCount = Math.max(
      1,
      Math.ceil(channelsNeeded / Math.max(1, a.channels))
    );

    const effectiveCapacity = a.powerPerZone * splitsNeeded;
    const totalCapacity = a.totalPower * ampCount;
    const unusedZonePower = Math.max(0, effectiveCapacity - requiredPower);
    const utilization = effectiveCapacity > 0
      ? requiredPower / effectiveCapacity * 100
      : 0;

    return {
      amp: a,
      ampCount,
      splitsNeeded,
      effectiveCapacity,
      totalCapacity,
      unusedZonePower,
      utilization,
      eligible: splitsNeeded <= maxSplits && ampCount <= maxAmps
    };
  }).filter(x => x.eligible);

  if (!evaluated.length) {
    return { found: false, requiredPower, headroomFactor, reason: "limits" };
  }

  evaluated.sort((a, b) => {
    // Explicitní preference uživatele.
    if (priority === "pro") {
      const ap = /PRO/i.test(a.amp.series || "") ? 0 : 1;
      const bp = /PRO/i.test(b.amp.series || "") ? 0 : 1;
      if (ap !== bp) return ap - bp;
    }

    if (priority === "dsp") {
      const ad = a.amp.hasDSP ? 0 : 1;
      const bd = b.amp.hasDSP ? 0 : 1;
      if (ad !== bd) return ad - bd;
    }

    if (priority === "fewest") {
      if (a.ampCount !== b.ampCount) return a.ampCount - b.ampCount;
      if (a.splitsNeeded !== b.splitsNeeded) return a.splitsNeeded - b.splitsNeeded;
    }

    if (priority === "efficient") {
      if (a.unusedZonePower !== b.unusedZonePower) {
        return a.unusedZonePower - b.unusedZonePower;
      }
    }

    // Výchozí "Vyvážená volba":
    // žádná automatická priorita PRO.
    if (a.ampCount !== b.ampCount) return a.ampCount - b.ampCount;
    if (a.splitsNeeded !== b.splitsNeeded) return a.splitsNeeded - b.splitsNeeded;
    if (a.unusedZonePower !== b.unusedZonePower) {
      return a.unusedZonePower - b.unusedZonePower;
    }

    // Pokud uživatel neřeší Dante, při shodě preferujeme běžnou variantu.
    if (dantePreference === "any" && a.amp.hasDante !== b.amp.hasDante) {
      return a.amp.hasDante ? 1 : -1;
    }

    // DSP je až tie-breaker, nikoli hlavní pravidlo.
    if (a.amp.hasDSP !== b.amp.hasDSP) return a.amp.hasDSP ? -1 : 1;

    if (a.amp.totalPower !== b.amp.totalPower) {
      return a.amp.totalPower - b.amp.totalPower;
    }

    return a.amp.model.localeCompare(b.amp.model, "cs");
  });

  return {
    found: true,
    requiredPower,
    headroomFactor,
    priority,
    dantePreference,
    ...evaluated[0]
  };
}


function formatCoordinateMeters(valueFt) {
  return `${(valueFt / FEET_PER_METER).toFixed(2).replace(".", ",")} m`;
}

function updateSpeakerCoordinatesTable(placements) {
  const body = document.getElementById("speakerCoordinatesBody");
  if (!body) return;

  if (!placements?.length) {
    body.innerHTML = `<tr><td colspan="3">—</td></tr>`;
    return;
  }

  body.innerHTML = placements.map((p, index) => `
    <tr data-speaker-index="${index}" class="${index >= 3 ? "coordinate-extra-row" : ""}">
      <td><strong>${index + 1}</strong></td>
      <td>${formatCoordinateMeters(p.x)}</td>
      <td>${formatCoordinateMeters(p.y)}</td>
    </tr>
  `).join("");
}
function getSpeakerCoordinatesText() {
  const placements = appState.latest?.placements || [];
  if (!placements.length) return "";

  const lines = [
    "Souřadnice reproduktorů",
    "Počátek: levý horní roh obálky půdorysu",
    ""
  ];

  placements.forEach((p, index) => {
    lines.push(
      `Repro ${index + 1}: X ${(p.x / FEET_PER_METER).toFixed(2).replace(".", ",")} m; ` +
      `Y ${(p.y / FEET_PER_METER).toFixed(2).replace(".", ",")} m`
    );
  });

  return lines.join("\n");
}
function updateAmplifierUI(result) {
  const model = document.getElementById("amplifierModelValue");
  const required = document.getElementById("amplifierRequiredPowerValue");
  const capacity = document.getElementById("amplifierCapacityValue");
  const utilization = document.getElementById("amplifierUtilizationValue");
  const detail = document.getElementById("amplifierDetail");
  const zoneOutputs = document.getElementById("amplifierZoneOutputsValue");
  const perOutput = document.getElementById("amplifierPerOutputValue");
  const dsp = document.getElementById("amplifierDspValue");
  const dante = document.getElementById("amplifierDanteValue");

    const reservePct = Math.max(0, Math.round((result.headroomFactor - 1) * 100));
  const requiredLabel = document.getElementById("amplifierRequiredPowerLabel");
  if (requiredLabel) {
    requiredLabel.textContent = `Požadovaný výkon včetně ${reservePct}% rezervy`;
  }
  required.textContent = `${result.requiredPower.toFixed(0)} W`;

  if (!result.found) {
    renderAmplifierProductImage(null);
    model.textContent = "Nenalezen vhodný model";
    capacity.textContent = "—";
    utilization.textContent = "—";
    detail.textContent = "V databázi není aktivní zesilovač, který splní požadovaný výkon a limity rozdělení zóny.";
    if (zoneOutputs) zoneOutputs.textContent = "—";
    if (perOutput) perOutput.textContent = "—";
    if (dsp) dsp.textContent = "—";
    if (dante) dante.textContent = "—";
    return;
  }

  renderAmplifierProductImage(result.amp);
  model.textContent = `${result.ampCount > 1 ? result.ampCount + "× " : ""}${result.amp.model}`;
  capacity.textContent = `${result.totalCapacity.toFixed(0)} W`;
  utilization.textContent = `${result.utilization.toFixed(0)} %`;
  const danteText = result.amp.hasDante ? "Dante" : "bez Dante";
  const dspText = result.amp.hasDSP ? "DSP" : "bez DSP";
  detail.textContent =
    `${result.splitsNeeded} výkonový${result.splitsNeeded === 1 ? "" : "é"} výstup${result.splitsNeeded === 1 ? "" : "y"} pro zónu; ` +
    `${result.amp.powerPerZone.toFixed(0)} W na výstup; ${dspText}, ${danteText}.`;
  if (zoneOutputs) zoneOutputs.textContent = `${Math.max(1, result.amp.effectiveZones || result.splitsNeeded || 1)}`;
  if (perOutput) perOutput.textContent = `${result.amp.powerPerZone.toFixed(0)} W`;
  if (dsp) dsp.textContent = result.amp.hasDSP ? "Ano" : "Ne";
  if (dante) dante.textContent = result.amp.hasDante ? "Ano" : "Ne";
}

function updateSpeakerTypeUi() {
  const type = document.getElementById("speakerType")?.value || "ceiling";
  document.getElementById("pendantHeightRow")?.classList.toggle("hidden", type !== "pendant");
}

let calculateDebounceTimer = null;
function scheduleCalculate(delayMs = 90) {
  window.clearTimeout(calculateDebounceTimer);
  calculateDebounceTimer = window.setTimeout(() => {
    calculateDebounceTimer = null;
    calculate();
  }, delayMs);
}

function calculate() {
  const room = getRoomShapeConfig();
  const lengthM = room.lengthM;
  const widthM = room.widthM;
  const heightM = Number(document.getElementById("height").value);
  const ambientPreset = document.getElementById("ambientNoisePreset").value;
  const ambientNoise = ambientPreset === "custom"
    ? Number(document.getElementById("ambientNoiseCustom").value)
    : Number(ambientPreset);
  const useCase = document.getElementById("useCase").value;
  const listenerPosition = document.getElementById("listenerPosition").value;
  const coverageDensity = document.getElementById("coverageDensity").value;
  const speakerType = document.getElementById("speakerType").value;
  const voltage = document.getElementById("voltage").value;
  const tapOverride = document.getElementById("tapOverride")?.value || "auto";
  const ampPriority = document.getElementById("ampPriority")?.value || "balanced";
  const dantePreference = document.getElementById("dantePreference")?.value || "any";
  const placementOptimizationMode = document.getElementById("placementOptimization")?.value || "regular";
  const pendantHeightM = speakerType === "pendant"
    ? Number(document.getElementById("pendantHeight").value)
    : 0;

  if (![lengthM,widthM,heightM,ambientNoise].every(Number.isFinite)
      || lengthM <= 0 || widthM <= 0 || heightM <= 0) {
    alert("Zkontrolujte zadané rozměry.");
    return;
  }

  const lengthFt = toFeet(lengthM);
  const widthFt = toFeet(widthM);
  const roomHeightFt = toFeet(heightM);
  const pendantHeightFt = pendantHeightM > 0 ? toFeet(pendantHeightM) : 0;
  const mountingHeightFt = pendantHeightFt > 0 ? pendantHeightFt : roomHeightFt;
  const listenerHeightFt = listenerPosition === "standing"
    ? STANDING_EAR_HEIGHT_FT
    : SEATED_EAR_HEIGHT_FT;
  const effectiveHeightFt = Math.max(MIN_LISTENER_DISTANCE_FT, mountingHeightFt - listenerHeightFt);

  const recommendedModel = getDefaultSpeaker({
    speakerType,
    useCase,
    effectiveHeightFt,
    lengthFt,
    widthFt,
    ambientNoise,
    roomHeightFt: mountingHeightFt
  });

  const recommendedSpeaker = getSpeaker(recommendedModel);
  const speakerOverrideSelect = document.getElementById("speakerOverride");
  const autoOption = [...speakerOverrideSelect.options].find(o => o.value === "auto");
  if (autoOption) {
    autoOption.textContent = `Automaticky – ${recommendedModel} (doporučený model)`;
  }

  const overrideValue = speakerOverrideSelect.value;
  const selectedModel = overrideValue === "auto" ? recommendedModel : overrideValue;
  const speaker = getSpeaker(selectedModel) || recommendedSpeaker;
  const targetSPL = getTargetSPL(ambientNoise, useCase);

  const recommendedCoverage = calculateCoverage({
    lengthFt,
    widthFt,
    roomHeightFt,
    pendantHeightFt,
    coverageAngle: recommendedSpeaker.coverageAngle,
    listenerPosition,
    coverageDensity,
    roomCoverage: "full"
  });

  const coverage = calculateCoverage({
    lengthFt,
    widthFt,
    roomHeightFt,
    pendantHeightFt,
    coverageAngle: speaker.coverageAngle,
    listenerPosition,
    coverageDensity,
    roomCoverage: "full"
  });

  if (!coverage) {
    alert("Výška reproduktoru musí být nad výškou posluchače.");
    return;
  }

  const basePlacements = calculatePlacements(coverage, room);

  if (!basePlacements.length) {
    alert("Pro zadaný tvar místnosti se nepodařilo umístit žádný reproduktor.");
    return;
  }

  let countRecommendation;
  let recommendedCount;
  let selectedCount;
  let selectedLayout;

  if (room.shape === "circle") {
    // Kruh: dva zcela nezávislé optimalizátory.
    // Zarovnaná = pravoúhlá nebo posunutá/hex mřížka.
    // Kruhová = pouze radiální/kruhové rodiny: prstence, střed a centrovaná hex/trojúhelníková síť.
    const circleMode =
      placementOptimizationMode === "circle-rings"
        ? "circle-rings"
        : "circle-aligned";

    const circleDesign = chooseCircleCoverageDesign(
      room,
      coverage,
      circleMode,
      {
        speaker,
        targetSPL,
        ambientNoise,
        useCase,
        voltage,
        mountingHeightFt,
        listenerHeightFt,
        requestedTap:tapOverride
      }
    );

    if (!circleDesign?.placements?.length) {
      alert("Pro kruhovou místnost se nepodařilo vytvořit geometrické coverage rozmístění.");
      return;
    }

    recommendedCount = circleDesign.placements.length;
    selectedCount = recommendedCount;
    selectedLayout = circleDesign;

    countRecommendation = {
      recommendedCount,
      chosen:circleDesign,
      evaluated:[],
      toleranceFloor:null,
      targetMet:null,
      source:"circle-coverage",
      optimizationPolicy:null,
      circleDesignCoveragePct:circleDesign.designCoveragePct,
      circleRadialScale:circleDesign.radialScale || 1,
      circleRequiredCoveragePct:circleDesign.requiredDesignCoveragePct,
      circleRemovedSymmetricCount:circleDesign.removedSymmetricCount || 0
    };
  } else if (room.shape === "rectangle" && placementOptimizationMode === "rect-optimized") {
    const rectDesign = chooseRectangleOptimizedDesign(room, coverage, speaker);
    if (!rectDesign?.placements?.length) {
      alert("Pro obdélník se nepodařilo vytvořit optimalizované rozmístění podle SSC benchmarku.");
      return;
    }
    recommendedCount = rectDesign.placements.length;
    selectedCount = recommendedCount;
    selectedLayout = rectDesign;
    countRecommendation = {
      recommendedCount, chosen:rectDesign, evaluated:[], toleranceFloor:null,
      targetMet:null, source:"rectangle-ssc-optimized", optimizationPolicy:null
    };
  } else {
    const sscLayout = getSscRegularAutomaticLayout(
      basePlacements,
      coverage,
      room
    );

    recommendedCount = sscLayout.placements.length;
    selectedCount = recommendedCount;

    // v0.133: pro všechny nekruhové tvary je geometrie pevná podle SSC.
    // U L/U/výřezů se pouze vynechají body ležící mimo skutečnou plochu;
    // žádný následný optimizer už body neposouvá ani nezvětšuje rozteče.
    selectedLayout = sscLayout;

    countRecommendation = {
      recommendedCount,
      chosen:sscLayout,
      evaluated:[],
      toleranceFloor:null,
      targetMet:null,
      source:"ssc",
      optimizationPolicy:null
    };
  }

  if (!selectedLayout?.placements?.length) {
    alert("Zvolený počet reproduktorů se pro tento půdorys nepodařilo vhodně rozmístit.");
    return;
  }

  const placements = selectedLayout.placements;
  const placementOptimization = {
    placements,
    optimized:placementOptimizationMode !== "regular",
    method:selectedLayout.method,
    improvementPct:0,
    clearanceM:selectedLayout.clearanceM,
    recommendedCount
  };
  const effectiveCoverage = {...coverage, count:placements.length};

  const power = calculatePower({
    speaker,
    targetSPL,
    ambientNoise,
    useCase,
    voltage
  }, effectiveCoverage);

  const availableTaps = getAvailableTapsForSpeaker(speaker, voltage);
  const manualTap = tapOverride !== "auto" ? numValue(tapOverride, NaN) : NaN;
  const selectedTap = Number.isFinite(manualTap) && availableTaps.includes(manualTap)
    ? manualTap
    : power.recommendedTap;

  populateTapOverrideOptions(speaker, voltage, tapOverride, power.recommendedTap);

  const adjustedPower = {
    ...power,
    recommendedTapAuto: power.recommendedTap,
    recommendedTap: selectedTap,
    totalPower: effectiveCoverage.count * selectedTap,
    singleSpeakerSPL:
      power.singleSpeakerSPL +
      10 * Math.log10(Math.max(selectedTap, 0.001) / Math.max(power.recommendedTap, 0.001))
  };

  const amplifierRecommendation = recommendAmplifier({
    zonePower: adjustedPower.totalPower,
    voltage,
    useCase,
    priority: ampPriority,
    dantePreference
  });

  // Adaptivní přesná síť pro heatmapu i všechny statistiky.
  const heatmap = calculateHeatmap({
    lengthFt,
    widthFt,
    placements,
    mountingHeightFt,
    listenerHeightFt,
    speaker,
    tap: selectedTap,
    room
  });

  const visualHeatmap = prepareRenderedHeatmap(heatmap);
  const splStats = heatmap;

  if (appState.listenerXFt === null || appState.listenerYFt === null) {
    appState.listenerXFt = widthFt / 2;
    appState.listenerYFt = lengthFt / 2;
  }
  const lp = clampPointToRoomMeters(appState.listenerXFt / FEET_PER_METER, appState.listenerYFt / FEET_PER_METER, room);
  appState.listenerXFt = lp.xM * FEET_PER_METER;
  appState.listenerYFt = lp.yM * FEET_PER_METER;

  const listenerSPL = calculateSPLAtPoint({
    xFt: appState.listenerXFt,
    yFt: appState.listenerYFt,
    listenerHeightFt,
    placements,
    mountingHeightFt,
    speaker,
    tap: selectedTap
  });

  const suitability = evaluateSpeakerSuitability({
    selectedSpeaker: speaker,
    recommendedSpeaker,
    speakerType,
    targetSPL,
    heatmap,
    power: adjustedPower,
    coverage: effectiveCoverage,
    recommendedCoverage
  });

  document.getElementById("resultTitle").textContent = speaker.model;
  renderSpeakerProductImage(speaker);
  updateSuitabilityUI(suitability);
  document.getElementById("speakerCount").textContent = `${effectiveCoverage.count} ks`;
  const floorSpeakerCount = document.getElementById("floorSpeakerCount");
  if (floorSpeakerCount) {
    floorSpeakerCount.textContent = `${effectiveCoverage.count} ks`;
  }
  const floorSpeakerModel = document.getElementById("floorSpeakerModel");
  if (floorSpeakerModel) {
    floorSpeakerModel.textContent = speaker.model;
  }
  document.getElementById("layoutValue").textContent = placementOptimization.method;
  document.getElementById("tapValue").textContent = `${selectedTap} W`;
  document.getElementById("listenerSplValue").textContent = `${listenerSPL.toFixed(1)} dB`;
  document.getElementById("averageSplValue").textContent = `${heatmap.average.toFixed(1)} dB`;
  document.getElementById("minimumSplValue").textContent = `${heatmap.min.toFixed(1)} dB`;
  document.getElementById("maximumSplValue").textContent = `${heatmap.max.toFixed(1)} dB`;
  document.getElementById("spreadSplValue").textContent = `${heatmap.spread.toFixed(1)} dB`;
  const toleranceDb = Number(coverage.expectedSPLVariation) || 3;
  const splTolerancePct = calculateSplToleranceCoverage(heatmap, toleranceDb);
  document.getElementById("splToleranceLabel").textContent =
    `Simulovaná plocha v toleranci ±${toleranceDb} dB`;
  document.getElementById("splToleranceValue").textContent =
    `${splTolerancePct.toFixed(0)} %`;
  document.getElementById("technicalToleranceLabel").textContent =
    `Simulovaná plocha v toleranci ±${toleranceDb} dB`;

  document.getElementById("technicalToleranceAreaValue").textContent =
    `${splTolerancePct.toFixed(0)} %`;

  if (room.shape === "circle") {
    const circlePct = Number(
      countRecommendation.circleDesignCoveragePct
    );
    const radialScale = Number(
      countRecommendation.circleRadialScale
    );
    const requiredCirclePct = Number(
      countRecommendation.circleRequiredCoveragePct
    );
    const removedSymmetricCount = Number(
      countRecommendation.circleRemovedSymmetricCount || 0
    );

    document.getElementById("technicalToleranceGoalValue").textContent =
      `Kruh: coverage footprinty pro ±${toleranceDb} dB • ${recommendedCount} ks` +
      (
        Number.isFinite(circlePct)
          ? ` • návrhově pokryto ${circlePct.toFixed(1)} % plochy`
          : ""
      ) +
      (
        Number.isFinite(requiredCirclePct)
          ? ` • minimum ${requiredCirclePct.toFixed(1)} %`
          : ""
      ) +
      (
        removedSymmetricCount > 0
          ? ` • symetricky odebráno ${removedSymmetricCount} ks`
          : ""
      ) +
      (
        Number.isFinite(radialScale) && Math.abs(radialScale-1) >= 0.005
          ? ` • radiální posun ${((radialScale-1)*100).toFixed(0)} %`
          : ""
      );
  } else {
    document.getElementById("technicalToleranceGoalValue").textContent =
      `Počet dle SSC coverage pro ±${toleranceDb} dB: ${recommendedCount} ks • optimalizace mění pouze polohy`;
  }

  document.getElementById("recommendedModelValue").textContent = recommendedSpeaker.model;
  document.getElementById("roomAreaValue").textContent = `${room.areaM2.toFixed(1)} m²`;
  const uc = USE_CASES[useCase];
  const ambientBased = ambientNoise + uc.snrAboveAmbient;
  const targetSource = targetSPL > uc.targetSPL
    ? `${uc.label}; ${ambientNoise.toFixed(0)} dB hluk + ${uc.snrAboveAmbient} dB rezerva`
    : uc.label;
  document.getElementById("targetSplLabel").textContent = `Cílové SPL (${targetSource})`;
  document.getElementById("targetSplValue").textContent = `${targetSPL.toFixed(0)} dB`;
  const coverageNames = {
    "center-to-center": "Střed ke středu",
    "min-overlap": "Minimální překrytí",
    "balanced": "Vyvážené překrytí",
    "edge-to-edge": "Hrana k hraně",
    "extended": "Rozšířené rozestupy"
  };
  document.getElementById("coverageModeValue").textContent =
    `${coverageNames[coverageDensity] || coverage.densityLabel} • návrhová tolerance ±${coverage.expectedSPLVariation} dB`;
  const optimizationImprovementText =
    Number.isFinite(placementOptimization.improvementPct)
      ? ` • geometrické zlepšení ${placementOptimization.improvementPct.toFixed(1).replace(".", ",")} %`
      : "";

  const optimizationModeLabels = {
    regular: "Pevná mřížka – striktní X/Y",
    "circle-aligned": "Zarovnaná – mřížka / posunutá hex mřížka",
    "rect-optimized": "Optimalizovaná – mřížka / posunutá hex mřížka",
    "circle-rings": "Kruhová – prstence / střed / hex",
    balanced: "Vyvážené – vždy geometrická síť",
    coverage: "Nejlepší pokrytí – volná optimalizace"
  };
  document.getElementById("placementOptimizationValue").textContent =
    optimizationModeLabels[placementOptimizationMode] || placementOptimizationMode;
  document.getElementById("listenerDistanceValue").textContent = formatMetersFromFeet(coverage.listenerDistance);
  document.getElementById("coverageDiameterValue").textContent = formatMetersFromFeet(coverage.coverageDiameter);
  document.getElementById("spacingXValue").textContent = formatMetersFromFeet(coverage.spacingX);
  document.getElementById("spacingYValue").textContent = formatMetersFromFeet(coverage.spacingY);
  document.getElementById("recommendedTapValue").textContent = `${power.recommendedTap.toString().replace(".", ",")} W`;
  document.getElementById("selectedTapValue").textContent = `${selectedTap.toString().replace(".", ",")} W`;
  document.getElementById("zonePowerValue").textContent = `${adjustedPower.totalPower.toFixed(0)} W`;
  const zonePowerSummary = document.getElementById("zonePowerSummaryValue");
  if (zonePowerSummary) zonePowerSummary.textContent = `${adjustedPower.totalPower.toFixed(0)} W`;

  const spacingSummary = document.getElementById("spacingSummaryValue");
  if (spacingSummary) {
    const actualSpacingM = nearestNeighbourSpacingMeters(placements);
    spacingSummary.textContent = actualSpacingM
      ? `≈ ${actualSpacingM.toFixed(1).replace(".", ",")} m`
      : "—";
    spacingSummary.title = "Medián vzdálenosti k nejbližšímu sousednímu reproduktoru.";
  }
  const loneliestSpeakerValue = document.getElementById("loneliestSpeakerValue");
  if (loneliestSpeakerValue) {
    const loneliest = loneliestSpeakerNearestDistance(placements);
    if (loneliest) {
      loneliestSpeakerValue.textContent =
        `Repro ${loneliest.speakerIndex + 1} • ${loneliest.distanceM.toFixed(2).replace(".", ",")} m k nejbližšímu`;
      loneliestSpeakerValue.title =
        `Nejbližší soused je repro ${loneliest.nearestIndex + 1}. Hodnota je největší z minimálních vzdáleností mezi jednotlivými reproduktory.`;
    } else {
      loneliestSpeakerValue.textContent = "—";
      loneliestSpeakerValue.title = "Pro jediný reproduktor nelze vzdálenost k sousednímu reproduktoru určit.";
    }
  }
  updateAmplifierUI(amplifierRecommendation);
  updatePriceSummary({ speaker, speakerCount: effectiveCoverage.count, amplifierRecommendation });
  document.getElementById("listenerPositionValue").textContent =
    `${(appState.listenerXFt / FEET_PER_METER).toFixed(1)} × ${(appState.listenerYFt / FEET_PER_METER).toFixed(1)} m`;
  const roomShapeLabels = {
    rectangle: "Obdélník",
    lshape: "Místnost s výřezem / výřezy",
    circle: "Kruh"
  };
  document.getElementById("technicalRoomShapeValue").textContent =
    roomShapeLabels[room.shape] || room.shape;

  document.getElementById("technicalRoomDimensionsValue").textContent =
    room.shape === "circle"
      ? `Ø ${room.diameterM.toFixed(1).replace(".", ",")} m × výška ${heightM.toFixed(1).replace(".", ",")} m`
      : `${widthM.toFixed(1).replace(".", ",")} × ${lengthM.toFixed(1).replace(".", ",")} × ${heightM.toFixed(1).replace(".", ",")} m`;

  document.getElementById("technicalAmbientNoiseValue").textContent =
    `${ambientNoise.toFixed(0)} dB`;

  document.getElementById("technicalInstallationValue").textContent =
    speakerType === "pendant"
      ? `Závěsné • výška reproduktoru ${(mountingHeightFt / FEET_PER_METER).toFixed(1).replace(".", ",")} m`
      : `Stropní • výška reproduktoru ${heightM.toFixed(1).replace(".", ",")} m`;

  document.getElementById("technicalRecommendedCountValue").textContent =
    room.shape === "circle"
      ? `${recommendedCount} ks – geometrické coverage vyplnění kruhu`
      : `${recommendedCount} ks – SSC coverage`;

  document.getElementById("technicalSelectedCountValue").textContent =
    `${effectiveCoverage.count} ks – automatický návrh`;

  document.getElementById("technicalWallClearanceValue").textContent =
    `${placementOptimization.clearanceM.toFixed(2).replace(".", ",")} m`;

  const balancedHoleRow = document.getElementById("technicalBalancedHoleRow");
  const balancedSpacingRow = document.getElementById("technicalBalancedSpacingRow");
  const balancedMetrics = selectedLayout.acoustic;

  if (placementOptimizationMode === "balanced" && balancedMetrics) {
    balancedHoleRow?.classList.remove("hidden");
    balancedSpacingRow?.classList.remove("hidden");
    document.getElementById("technicalBalancedHoleValue").textContent =
      `${balancedMetrics.largestHolePct.toFixed(1).replace(".", ",")} % plochy`;
    document.getElementById("technicalBalancedSpacingValue").textContent =
      `${balancedMetrics.spacingBalanceRatio.toFixed(2).replace(".", ",")}×`;
  } else {
    balancedHoleRow?.classList.add("hidden");
    balancedSpacingRow?.classList.add("hidden");
  }

  const coverageAlignmentRow = document.getElementById("technicalCoverageAlignmentRow");
  const coverageAlignmentValue = document.getElementById("technicalCoverageAlignmentValue");
  if (placementOptimizationMode === "coverage") {
    coverageAlignmentRow?.classList.remove("hidden");
    if (selectedLayout.postAligned) {
      const ref = selectedLayout.freeReference;
      const toleranceLoss = ref
        ? Math.max(0, ref.tolerancePct - selectedLayout.acoustic.tolerancePct)
        : 0;
      coverageAlignmentValue.textContent =
        `Ano • ${selectedLayout.method} • ztráta ${toleranceLoss.toFixed(1).replace(".", ",")} p. b.`;
    } else {
      coverageAlignmentValue.textContent =
        "Ne • volné optimum bylo akusticky výrazně lepší";
    }
  } else {
    coverageAlignmentRow?.classList.add("hidden");
  }

  document.getElementById("technicalListenerHeightValue").textContent =
    `${(listenerHeightFt / FEET_PER_METER).toFixed(2).replace(".", ",")} m`;

  updateSpeakerCoordinatesTable(placements);

  appState.latest = {
    lengthM, widthM, heightM, lengthFt, widthFt,
    placements, coverage: effectiveCoverage, room, placementOptimization, placementOptimizationMode, speaker, power: adjustedPower, heatmap, visualHeatmap, splStats,
    recommendedSpeaker, recommendedCoverage, amplifierRecommendation,
    listenerHeightFt, mountingHeightFt, recommendedCount, selectedCount, toleranceDb, splTolerancePct
  };
  updateSpatialAudioGain(listenerSPL);

  drawFloorPlan({
    lengthM,
    widthM,
    lengthFt,
    widthFt,
    room,
    placements,
    coverage: effectiveCoverage,
    speakerModel: speaker.model,
    heatmap: visualHeatmap,
    listenerXFt: appState.listenerXFt,
    listenerYFt: appState.listenerYFt,
    listenerSPL
  });
  drawSpacingPlan({lengthM, widthM, room, placements});
  drawAllSectionViews();
  syncFloorControlsFromMain();
}

populateSpeakerOverrideOptions();

document.getElementById("speakerOverride").addEventListener("change", () => scheduleCalculate());
document.getElementById("coverageDensityFloor")?.addEventListener("change", () => {
  const main = document.getElementById("coverageDensity");
  const floor = document.getElementById("coverageDensityFloor");
  if (main && floor) main.value = floor.value;
  scheduleCalculate();
});

document.getElementById("placementOptimizationFloor")?.addEventListener("change", () => {
  const main = document.getElementById("placementOptimization");
  const floor = document.getElementById("placementOptimizationFloor");
  if (main && floor) main.value = floor.value;
  scheduleCalculate();
});

document.getElementById("speakerType").addEventListener("change", () => {
  updateSpeakerTypeUi();
});


document.getElementById("ambientNoisePreset").addEventListener("change", (e) => {
  const custom = e.target.value === "custom";
  document.getElementById("ambientCustomRow").classList.toggle("hidden", !custom);
  scheduleCalculate();
});

document.getElementById("copySpeakerCoordinates")?.addEventListener("click", async () => {
  const text = getSpeakerCoordinatesText();
  if (!text) return;

  const button = document.getElementById("copySpeakerCoordinates");
  const originalText = button?.textContent || "Kopírovat souřadnice";

  try {
    await navigator.clipboard.writeText(text);
    if (button) button.textContent = "Zkopírováno";
  } catch (_) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    if (button) button.textContent = "Zkopírováno";
  }

  setTimeout(() => {
    if (button) button.textContent = originalText;
  }, 1400);
});


const spatialAudio = document.getElementById("spatialAudio");
const audioFileInput = document.getElementById("audioFileInput");
const audioPlayToggle = document.getElementById("audioPlayToggle");
const audioGainStatus = document.getElementById("audioGainStatus");
const audioSeek = document.getElementById("audioSeek");
const audioCurrentTime = document.getElementById("audioCurrentTime");
const audioDuration = document.getElementById("audioDuration");
const audioVolume = document.getElementById("audioVolume");

function formatAudioTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function updateAudioProgress() {
  if (!spatialAudio) return;
  const duration = Number.isFinite(spatialAudio.duration) ? spatialAudio.duration : 0;
  const current = Number.isFinite(spatialAudio.currentTime) ? spatialAudio.currentTime : 0;
  if (audioCurrentTime) audioCurrentTime.textContent = formatAudioTime(current);
  if (audioDuration) audioDuration.textContent = formatAudioTime(duration);
  if (audioSeek) {
    audioSeek.disabled = duration <= 0;
    audioSeek.value = duration > 0 ? String(Math.round(current / duration * 1000)) : "0";
  }
}

function updateAudioPlayButton() {
  if (!audioPlayToggle || !spatialAudio) return;
  audioPlayToggle.textContent = spatialAudio.paused ? "Spustit demo" : "Pozastavit";
}

audioFileInput?.addEventListener("change", () => {
  const file = audioFileInput.files?.[0];
  if (!file || !spatialAudio) return;
  if (audioObjectUrl) URL.revokeObjectURL(audioObjectUrl);
  audioObjectUrl = URL.createObjectURL(file);
  spatialAudio.src = audioObjectUrl;
  spatialAudio.load();
  if (audioSeek) {
    audioSeek.value = "0";
    audioSeek.disabled = true;
  }
  if (audioCurrentTime) audioCurrentTime.textContent = "0:00";
  if (audioDuration) audioDuration.textContent = "0:00";
  if (audioPlayToggle) audioPlayToggle.disabled = false;
  if (audioGainStatus) audioGainStatus.textContent = "Připraveno";
  updateSpatialAudioGain();
});

audioVolume?.addEventListener("input", () => {
  audioUserVolume = Math.max(0, Math.min(1, Number(audioVolume.value) / 100));
  updateSpatialAudioGain();
});

// Výchozí demo je připravené ihned po načtení stránky.
if (spatialAudio) {
  spatialAudio.load();
  updateSpatialAudioGain();
}

audioPlayToggle?.addEventListener("click", async () => {
  if (!spatialAudio?.src) return;
  try {
    if (spatialAudio.paused) {
      updateSpatialAudioGain();
      await spatialAudio.play();
    } else {
      spatialAudio.pause();
    }
  } catch (error) {
    console.warn("Audio playback failed:", error);
  }
  updateAudioPlayButton();
});

spatialAudio?.addEventListener("play", updateAudioPlayButton);
spatialAudio?.addEventListener("pause", updateAudioPlayButton);
spatialAudio?.addEventListener("ended", updateAudioPlayButton);
spatialAudio?.addEventListener("loadedmetadata", updateAudioProgress);
spatialAudio?.addEventListener("durationchange", updateAudioProgress);
spatialAudio?.addEventListener("timeupdate", updateAudioProgress);

audioSeek?.addEventListener("input", () => {
  if (!spatialAudio || !Number.isFinite(spatialAudio.duration) || spatialAudio.duration <= 0) return;
  spatialAudio.currentTime = Number(audioSeek.value) / 1000 * spatialAudio.duration;
  updateAudioProgress();
});

document.getElementById("roomShape")?.addEventListener("change", () => {
  updateRoomShapeUi();
  appState.listenerXFt = null;
  appState.listenerYFt = null;
  scheduleCalculate();
});



["length","width","height","ambientNoiseCustom","useCase","listenerPosition","coverageDensity","speakerType","pendantHeight","voltage","ampPriority","dantePreference","tapOverride","lCutSide","lCutWidth","lCutLength","lCutOffset","secondCutEnabled","lCutSide2","lCutWidth2","lCutLength2","lCutOffset2","diameter","placementOptimization"]
  .forEach(id => {
    document.getElementById(id).addEventListener("change", () => {
      if (id === "secondCutEnabled") updateRoomShapeUi();
      if (id === "placementOptimization" || id === "coverageDensity") {
        syncFloorControlsFromMain();
      }
      if (["length","width","lCutSide","lCutWidth","lCutLength","lCutOffset","secondCutEnabled","lCutSide2","lCutWidth2","lCutLength2","lCutOffset2","diameter"].includes(id)) {
        appState.listenerXFt = null;
        appState.listenerYFt = null;
      }
      scheduleCalculate();
    });
  });

const svg = document.getElementById("floorPlan");

function pointerToListenerPosition(evt) {
  if (!appState.latest?.floorGeom) return;
  const g = appState.latest.floorGeom;
  const rect = svg.getBoundingClientRect();
  const px = (evt.clientX - rect.left) * (g.W / rect.width);
  const py = (evt.clientY - rect.top) * (g.H / rect.height);

  const clampedX = Math.max(g.ox, Math.min(g.ox + g.roomW, px));
  const clampedY = Math.max(g.oy, Math.min(g.oy + g.roomH, py));

  const xM = (clampedX - g.ox) / g.scale;
  const yM = (clampedY - g.oy) / g.scale;

  const room = appState.latest?.room;
  const p = room ? clampPointToRoomMeters(xM, yM, room) : {xM, yM};
  appState.listenerXFt = p.xM * FEET_PER_METER;
  appState.listenerYFt = p.yM * FEET_PER_METER;
  refreshListenerOnly();
}

svg.addEventListener("pointerdown", (evt) => {
  appState.draggingListener = true;
  svg.setPointerCapture?.(evt.pointerId);
  pointerToListenerPosition(evt);
});

svg.addEventListener("pointermove", (evt) => {
  if (!appState.draggingListener) return;
  pointerToListenerPosition(evt);
});

svg.addEventListener("pointerup", (evt) => {
  appState.draggingListener = false;
  svg.releasePointerCapture?.(evt.pointerId);
});

svg.addEventListener("pointercancel", () => {
  appState.draggingListener = false;
});

["sideView", "frontView"].forEach(svgId => {
  const sectionSvg = document.getElementById(svgId);
  if (!sectionSvg) return;

  sectionSvg.addEventListener("pointerdown", evt => {
    appState.draggingSection = svgId;
    sectionSvg.setPointerCapture?.(evt.pointerId);
    updateListenerFromSection(evt, svgId);
  });

  sectionSvg.addEventListener("pointermove", evt => {
    if (appState.draggingSection !== svgId) return;
    updateListenerFromSection(evt, svgId);
  });

  sectionSvg.addEventListener("pointerup", evt => {
    if (appState.draggingSection === svgId) {
      updateListenerFromSection(evt, svgId);
    }
    appState.draggingSection = null;
  });

  sectionSvg.addEventListener("pointercancel", () => {
    appState.draggingSection = null;
  });
});

async function initializeApp() {
  updateRoomShapeUi();
  updateSpeakerTypeUi();
  updatePlacementOptimizationAvailability();
  syncFloorControlsFromMain();
  setDataSourceStatus("fallback", "Načítám živá data…");
  try {
    await loadLiveData();
  } catch (err) {
    console.warn("Google Sheets data source failed:", err);
    setDataSourceStatus("fallback", "Google Sheets se nepodařilo načíst. Používá se lokální záloha.");
  }
  populateUseCaseOptions();
  populateCoverageOptions();
  populateSpeakerOverrideOptions();

  // Kalkulátor se musí spustit bez ohledu na dostupnost cenového endpointu.
  calculate();

  // Ceny načítáme nezávisle na pozadí. Po načtení pouze obnovíme
  // cenové shrnutí; výpočtová logika na cenách nijak nezávisí.
  loadPriceData().then(() => {
    const s = appState.latest;
    if (!s) return;
    updatePriceSummary({
      speaker: s.speaker,
      speakerCount: s.coverage.count,
      amplifierRecommendation: s.amplifierRecommendation
    });
  }).catch(error => {
    console.warn("Price feed unavailable:", error);
  });
}

initializeApp();
