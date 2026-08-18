const APP_VERSION = "0.87";
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
    url: r["URL produktu"] || ""
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
    url: r["URL produktu"] || ""
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

function calculatePlacements(coverage) {
  const points = [];
  for (let row = 0; row < coverage.rows; row++) {
    for (let col = 0; col < coverage.columns; col++) {
      points.push({
        x: coverage.offsetX + col * coverage.spacingX,
        y: coverage.offsetY + row * coverage.spacingY
      });
    }
  }
  return points;
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

function calculateSPLAtPoint({xFt, yFt, listenerHeightFt, placements, mountingHeightFt, speaker, tap}) {
  let totalIntensity = 0;

  for (const p of placements) {
    const dx = xFt - p.x;
    const dy = yFt - p.y;
    const dz = mountingHeightFt - listenerHeightFt;
    const distanceFt = Math.max(
      MIN_LISTENER_DISTANCE_FT,
      Math.sqrt(dx * dx + dy * dy + dz * dz)
    );

    const spl =
      speaker.sensitivity +
      10 * Math.log10(tap) -
      20 * Math.log10(distanceFt / SPL_REFERENCE_DISTANCE_FT);

    totalIntensity += Math.pow(10, spl / 10);
  }

  return 10 * Math.log10(Math.max(totalIntensity, 1e-12));
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

function calculateHeatmap({
  lengthFt,
  widthFt,
  placements,
  mountingHeightFt,
  listenerHeightFt,
  speaker,
  tap
}) {
  const lengthM = lengthFt / FEET_PER_METER;
  const widthM = widthFt / FEET_PER_METER;
  const areaM2 = lengthM * widthM;

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

      const spl = calculateSPLAtPoint({
        xFt,
        yFt,
        listenerHeightFt,
        placements,
        mountingHeightFt,
        speaker,
        tap
      });

      cells.push({ ix, iy, spl });
      min = Math.min(min, spl);
      max = Math.max(max, spl);
      sumLinear += Math.pow(10, spl / 10);
    }
  }

  const average = 10 * Math.log10(sumLinear / cells.length);

  return {
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

function heatColor(value, min, max, mode = "absolute") {
  let t;

  if (mode === "relative") {
    const span = Math.max(0.001, max - min);
    t = Math.max(0, Math.min(1, (value - min) / span));
  } else {
    // Absolutní SPL stupnice:
    // cca 60 dB = modrá, 75 dB = tyrkys/zelená,
    // 85 dB = zelenožlutá, 95 dB = žlutá/oranžová,
    // 105–110+ dB = červená.
    const absoluteMin = 60;
    const absoluteMax = 110;
    t = Math.max(0, Math.min(1, (value - absoluteMin) / (absoluteMax - absoluteMin)));
  }

  // Klidnější vícebodová barevná škála.
  // low -> blue -> cyan -> green -> yellow -> orange -> red
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
  const mode = document.getElementById("heatmapScaleMode")?.value || "absolute";
  const low = document.getElementById("heatmapScaleLowLabel");
  const high = document.getElementById("heatmapScaleHighLabel");
  if (!low || !high) return;

  if (mode === "relative" && heatmap) {
    low.textContent = `${heatmap.min.toFixed(0)} dB`;
    high.textContent = `${heatmap.max.toFixed(0)} dB`;
  } else {
    low.textContent = "60 dB";
    high.textContent = "110+ dB";
  }
}

let appState = {
  listenerXFt: null,
  listenerYFt: null,
  draggingListener: false,
  draggingSection: null,
  sectionGeom: {},
  latest: null
};

function calculatePlacements(coverage) {
  const points = [];
  for (let row = 0; row < coverage.rows; row++) {
    for (let col = 0; col < coverage.columns; col++) {
      points.push({
        x: coverage.offsetX + col * coverage.spacingX,
        y: coverage.offsetY + row * coverage.spacingY
      });
    }
  }
  return points;
}

function drawFloorPlan({
  lengthM, widthM, lengthFt, widthFt,
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

  const rect = `<rect x="${ox}" y="${oy}" width="${roomW}" height="${roomH}" rx="4"
    fill="#111820" stroke="#7d8998" stroke-width="2"/>`;

  const title = `<text x="${W/2}" y="${oy - 22}" text-anchor="middle"
    fill="#dfe6ee" font-size="16" font-weight="700">${speakerModel}</text>`;

  const dims = `
    <text x="${W/2}" y="${oy + roomH + 34}" text-anchor="middle"
      fill="#9ba8b7" font-size="13">${widthM.toFixed(1)} m</text>
    <text x="${ox - 26}" y="${H/2}" text-anchor="middle"
      fill="#9ba8b7" font-size="13"
      transform="rotate(-90 ${ox - 26} ${H/2})">${lengthM.toFixed(1)} m</text>
  `;

  const cellW = roomW / heatmap.nx;
  const cellH = roomH / heatmap.ny;
  const heatCells = heatmap.cells.map(c => {
    const x = ox + c.ix * cellW;
    const y = oy + c.iy * cellH;
    const scaleMode = document.getElementById("heatmapScaleMode")?.value || "absolute";
    const color = heatColor(c.spl, heatmap.min, heatmap.max, scaleMode);
    return `<rect x="${x}" y="${y}" width="${cellW + 0.7}" height="${cellH + 0.7}"
      fill="${color}" fill-opacity="0.44">
      <title>${c.spl.toFixed(1)} dB</title>
    </rect>`;
  }).join("");

  const radius = 10;
  const circles = placements.map((p, idx) => {
    const xM = p.x * ftToM;
    const yM = p.y * ftToM;
    const cx = ox + xM * scale;
    const cy = oy + yM * scale;

    return `
      <g>
        <circle cx="${cx}" cy="${cy}" r="${radius + 6}" fill="rgba(255,122,26,0.12)" stroke="rgba(255,122,26,0.5)" stroke-width="1"/>
        <circle cx="${cx}" cy="${cy}" r="${radius}" fill="#ff7a1a" stroke="#fff" stroke-width="2"/>
        <circle cx="${cx}" cy="${cy}" r="3" fill="#fff"/>
        <text x="${cx}" y="${cy + 24}" text-anchor="middle" fill="#d0d7df" font-size="10">${idx + 1}</text>
        <text x="${cx}" y="${cy + 38}" text-anchor="middle" fill="#f4f7fb" font-size="10" font-weight="700">
          ${appState.latest?.power?.singleSpeakerSPL?.toFixed(1) ?? "—"} dB
        </text>
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

  svg.innerHTML = rect + heatCells + title + dims + circles + listener;
  updateHeatmapScaleLabels(heatmap);

  appState.latest = {
    ...appState.latest,
    floorGeom: { W, H, pad, scale, roomW, roomH, ox, oy, lengthFt, widthFt }
  };
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
  const padBottom = 58;

  const axisLengthM = axis === "length" ? lengthM : widthM;

  // Stejné fyzické měřítko v ose X i Y:
  // 1 metr vodorovně = 1 metr svisle.
  // Šířka grafu zůstává stejná, dynamická je pouze výška.
  const usableW = W - padX * 2;
  const pxPerMeter = usableW / Math.max(0.1, axisLengthM);

  const roomW = usableW;
  const roomH = Math.max(120, heightM * pxPerMeter);
  const H = padTop + roomH + padBottom;

  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.style.aspectRatio = `${W} / ${H}`;

  const ox = padX;
  const oy = padTop;
  const floorY = oy + roomH;
  const ceilingY = oy;

  const mountHeightM = mountingHeightFt / FEET_PER_METER;
  const listenerHeightM = listenerHeightFt / FEET_PER_METER;
  const speakerY = floorY - mountHeightM * pxPerMeter;
  const earY = floorY - listenerHeightM * pxPerMeter;

  const halfAngleRad = Math.max(1, Math.min(179, speaker.coverageAngle)) * Math.PI / 360;
  const verticalDistanceToEarM = Math.max(0.05, mountHeightM - listenerHeightM);
  const halfCoverageAtEarM = Math.tan(halfAngleRad) * verticalDistanceToEarM;

  const uniqueAxisPositions = [...new Set(
    placements.map(p => {
      const ft = axis === "length" ? p.y : p.x;
      return Number((ft / FEET_PER_METER).toFixed(4));
    })
  )].sort((a,b) => a-b);

  const listenerAxisM = (axis === "length" ? listenerYFt : listenerXFt) / FEET_PER_METER;
  const listenerSpl = calculateSectionListenerSpl(axis, listenerAxisM);

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
    <text x="${W/2}" y="${floorY + 34}" text-anchor="middle" fill="#9ba8b7" font-size="12">
      ${axis === "length" ? "délka" : "šířka"} ${axisLengthM.toFixed(1)} m
    </text>
    <text x="${ox - 34}" y="${oy + roomH/2}" text-anchor="middle" fill="#9ba8b7" font-size="12"
      transform="rotate(-90 ${ox - 34} ${oy + roomH/2})">
      výška ${heightM.toFixed(1)} m
    </text>
  `;

  const coneSvg = uniqueAxisPositions.map(posM => {
    const cx = ox + posM * pxPerMeter;
    const bottomY = earY;
    const halfWidthPx = halfCoverageAtEarM * pxPerMeter;
    const pts = conePolygonPoints(cx, speakerY, bottomY, halfWidthPx);

    return `
      <polygon points="${pts}"
        fill="rgba(255,122,26,0.10)"
        stroke="rgba(255,150,70,0.65)"
        stroke-width="1.2"/>
    `;
  }).join("");

  const speakersSvg = uniqueAxisPositions.map(posM => {
    const cx = ox + posM * pxPerMeter;
    return `
      <g>
        <line x1="${cx}" y1="${ceilingY}" x2="${cx}" y2="${speakerY}"
          stroke="#5c6672" stroke-width="1"/>
        <circle cx="${cx}" cy="${speakerY}" r="6"
          fill="#ff7a1a" stroke="#ffd5b7" stroke-width="1.2"/>
      </g>
    `;
  }).join("");

  const listenerCx = ox + listenerAxisM * pxPerMeter;
  const splLabel = Number.isFinite(listenerSpl) ? `${listenerSpl.toFixed(1)} dB` : "—";

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

  svg.innerHTML = defs + roomRect + `<g clip-path="url(#${clipId})">${coneSvg}</g>` + earLine + floorCeilingLabels + speakersSvg + listenerSvg;

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
      `úhel ${speaker.coverageAngle.toFixed(0)}° • rozteč ${spacingM.toFixed(2)} m`;
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

  drawFloorPlan({
    lengthM: s.lengthM,
    widthM: s.widthM,
    lengthFt: s.lengthFt,
    widthFt: s.widthFt,
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
  if (!select) return;
  const current = select.value || "edge-to-edge";
  select.innerHTML = "";
  for (const [key, mode] of Object.entries(COVERAGE_MODES).sort((a,b) => a[1].variation - b[1].variation)) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = `${mode.label} (cca ±${mode.variation} dB)`;
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


const PRICE_DATA = new Map();

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
    code: speaker.avCode || "",
    priceItem: getPriceByAvCode(speaker.avCode)
  });

  if (amplifierRecommendation?.found) {
    const a = amplifierRecommendation.amp;
    rows.push({
      name: `${a.manufacturer || ""} ${a.model}`.trim(),
      qty: amplifierRecommendation.ampCount || 1,
      code: a.avCode || "",
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
        <td>${row.name}</td>
        <td>${row.qty}×</td>
        <td>${row.code || "—"}</td>
        <td>${formatCzk(price)}</td>
        <td>${formatCzk(subtotal)}</td>
      </tr>
    `;
  }).join("");

  totalEl.textContent = complete ? formatCzk(total) : "—";

  if (PRICE_DATA.size > 0) {
    statusEl.textContent = complete ? "Ceny načteny" : "Ceny částečně dostupné";
    noteEl.textContent = complete
      ? "Ceny jsou uvedeny včetně DPH."
      : "U některých položek chybí cena nebo kód produktu; celková cena proto není zobrazena.";
  } else {
    statusEl.textContent = "Připraveno pro cenový feed";
    noteEl.textContent =
      "Položky a množství jsou připravené. V další fázi se ceny doplní z denně aktualizovaného AV Integra feedu podle kódu produktu.";
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
  const headroomFactor = numValue(
    uc.ampHeadroomFactor,
    AMP_RULES.AMP_HEADROOM_WITHOUT_SUBS || 1.2
  );
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

function updateAmplifierUI(result) {
  const model = document.getElementById("amplifierModelValue");
  const required = document.getElementById("amplifierRequiredPowerValue");
  const capacity = document.getElementById("amplifierCapacityValue");
  const utilization = document.getElementById("amplifierUtilizationValue");
  const code = document.getElementById("amplifierCodeValue");
  const detail = document.getElementById("amplifierDetail");

    const reservePct = Math.max(0, Math.round((result.headroomFactor - 1) * 100));
  const requiredLabel = document.getElementById("amplifierRequiredPowerLabel");
  if (requiredLabel) {
    requiredLabel.textContent = `Požadovaný výkon včetně ${reservePct}% rezervy`;
  }
  required.textContent = `${result.requiredPower.toFixed(0)} W`;

  if (!result.found) {
    model.textContent = "Nenalezen vhodný model";
    capacity.textContent = "—";
    utilization.textContent = "—";
    code.textContent = "—";
    detail.textContent = "V databázi není aktivní zesilovač, který splní požadovaný výkon a limity rozdělení zóny.";
    return;
  }

  model.textContent = `${result.ampCount > 1 ? result.ampCount + "× " : ""}${result.amp.model}`;
  capacity.textContent = `${result.totalCapacity.toFixed(0)} W`;
  utilization.textContent = `${result.utilization.toFixed(0)} %`;
  code.textContent = result.amp.avCode || "kód není v AV Integra feedu";
  const danteText = result.amp.hasDante ? "Dante" : "bez Dante";
  const dspText = result.amp.hasDSP ? "DSP" : "bez DSP";
  detail.textContent =
    `${result.splitsNeeded} výkonový${result.splitsNeeded === 1 ? "" : "é"} výstup${result.splitsNeeded === 1 ? "" : "y"} pro zónu; ` +
    `${result.amp.powerPerZone.toFixed(0)} W na výstup; ${dspText}, ${danteText}.`;
}

function calculate() {
  const lengthM = Number(document.getElementById("length").value);
  const widthM = Number(document.getElementById("width").value);
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

  const placements = calculatePlacements(coverage);

  const power = calculatePower({
    speaker,
    targetSPL,
    ambientNoise,
    useCase,
    voltage
  }, coverage);

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
    totalPower: coverage.count * selectedTap,
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
    tap: selectedTap
  });

  const visualHeatmap = prepareRenderedHeatmap(heatmap);
  const splStats = heatmap;

  if (appState.listenerXFt === null || appState.listenerXFt > widthFt) {
    appState.listenerXFt = widthFt / 2;
  }
  if (appState.listenerYFt === null || appState.listenerYFt > lengthFt) {
    appState.listenerYFt = lengthFt / 2;
  }

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
    coverage,
    recommendedCoverage
  });

  document.getElementById("resultTitle").textContent = speaker.model;
  updateSuitabilityUI(suitability);
  document.getElementById("speakerCount").textContent = `${coverage.count} ks`;
  document.getElementById("layoutValue").textContent = `${coverage.columns} × ${coverage.rows}`;
  document.getElementById("tapValue").textContent = `${selectedTap} W`;
  document.getElementById("listenerSplValue").textContent = `${listenerSPL.toFixed(1)} dB`;
  document.getElementById("averageSplValue").textContent = `${heatmap.average.toFixed(1)} dB`;
  document.getElementById("minimumSplValue").textContent = `${heatmap.min.toFixed(1)} dB`;
  document.getElementById("maximumSplValue").textContent = `${heatmap.max.toFixed(1)} dB`;
  document.getElementById("spreadSplValue").textContent = `${heatmap.spread.toFixed(1)} dB`;

  document.getElementById("recommendedModelValue").textContent = recommendedSpeaker.model;
  const uc = USE_CASES[useCase];
  const ambientBased = ambientNoise + uc.snrAboveAmbient;
  const targetSource = targetSPL > uc.targetSPL
    ? `${uc.label}; ${ambientNoise.toFixed(0)} dB hluk + ${uc.snrAboveAmbient} dB rezerva`
    : uc.label;
  document.getElementById("targetSplLabel").textContent = `Cílové SPL (${targetSource})`;
  document.getElementById("targetSplValue").textContent = `${targetSPL.toFixed(0)} dB`;
  document.getElementById("coverageModeValue").textContent =
    `${coverage.densityLabel} / ±${coverage.expectedSPLVariation} dB`;
  document.getElementById("listenerDistanceValue").textContent = formatMetersFromFeet(coverage.listenerDistance);
  document.getElementById("coverageDiameterValue").textContent = formatMetersFromFeet(coverage.coverageDiameter);
  document.getElementById("spacingXValue").textContent = formatMetersFromFeet(coverage.spacingX);
  document.getElementById("spacingYValue").textContent = formatMetersFromFeet(coverage.spacingY);
  document.getElementById("recommendedTapValue").textContent = `${power.recommendedTap.toString().replace(".", ",")} W`;
  document.getElementById("selectedTapValue").textContent = `${selectedTap.toString().replace(".", ",")} W`;
  document.getElementById("zonePowerValue").textContent = `${adjustedPower.totalPower.toFixed(0)} W`;
  updateAmplifierUI(amplifierRecommendation);
  updatePriceSummary({ speaker, speakerCount: coverage.count, amplifierRecommendation });
  document.getElementById("listenerPositionValue").textContent =
    `${(appState.listenerXFt / FEET_PER_METER).toFixed(1)} × ${(appState.listenerYFt / FEET_PER_METER).toFixed(1)} m`;

  appState.latest = {
    lengthM, widthM, heightM, lengthFt, widthFt,
    placements, coverage, speaker, power: adjustedPower, heatmap, visualHeatmap, splStats,
    recommendedSpeaker, recommendedCoverage, amplifierRecommendation,
    listenerHeightFt, mountingHeightFt
  };

  drawFloorPlan({
    lengthM,
    widthM,
    lengthFt,
    widthFt,
    placements,
    coverage,
    speakerModel: speaker.model,
    heatmap: visualHeatmap,
    listenerXFt: appState.listenerXFt,
    listenerYFt: appState.listenerYFt,
    listenerSPL
  });
  drawAllSectionViews();
}

populateSpeakerOverrideOptions();

document.getElementById("speakerOverride").addEventListener("change", calculate);

document.getElementById("speakerType").addEventListener("change", (e) => {
  document.getElementById("pendantHeightRow").classList.toggle("hidden", e.target.value !== "pendant");
});


document.getElementById("ambientNoisePreset").addEventListener("change", (e) => {
  const custom = e.target.value === "custom";
  document.getElementById("ambientCustomRow").classList.toggle("hidden", !custom);
  calculate();
});

document.getElementById("calculateBtn").addEventListener("click", calculate);

document.getElementById("heatmapScaleMode")?.addEventListener("change", () => {
  if (!appState.latest) return;
  refreshListenerOnly();
});


["length","width","height","ambientNoiseCustom","useCase","listenerPosition","coverageDensity","speakerType","pendantHeight","voltage","ampPriority","dantePreference","tapOverride"]
  .forEach(id => {
    document.getElementById(id).addEventListener("change", () => {
      if (["length","width"].includes(id)) {
        appState.listenerXFt = null;
        appState.listenerYFt = null;
      }
      calculate();
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

  appState.listenerXFt = xM * FEET_PER_METER;
  appState.listenerYFt = yM * FEET_PER_METER;
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
  calculate();
}

initializeApp();
