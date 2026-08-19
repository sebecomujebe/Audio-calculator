const APP_VERSION = "0.103";
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

function updateRoomShapeUi() {
  const shape = document.getElementById("roomShape")?.value || "rectangle";
  const roomGrid = document.getElementById("roomDimensionsGrid");
  const heightRow = document.getElementById("heightRow");
  const ambientNoiseRow = document.getElementById("ambientNoiseRow");
  const circleControls = document.getElementById("circleControls");
  const secondCutEnabled = Boolean(document.getElementById("secondCutEnabled")?.checked);

  document.getElementById("lengthRow")?.classList.toggle("hidden", shape === "circle");
  document.getElementById("widthRow")?.classList.toggle("hidden", shape === "circle");
  document.getElementById("lShapeControls")?.classList.toggle("hidden", shape !== "lshape");
  document.getElementById("secondCutControls")?.classList.toggle(
    "hidden",
    shape !== "lshape" || !secondCutEnabled
  );
  circleControls?.classList.toggle("hidden", shape !== "circle");

  // U kruhové místnosti držíme průměr a výšku vedle sebe.
  if (shape === "circle") {
    if (heightRow && circleControls && heightRow.parentElement !== circleControls) {
      circleControls.appendChild(heightRow);
    }
  } else if (heightRow && roomGrid && ambientNoiseRow && heightRow.parentElement !== roomGrid) {
    roomGrid.insertBefore(heightRow, ambientNoiseRow);
  }
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
  const topCuts = cuts.filter(c => c.side === "top").map(c => [c.x1, c.x2]);
  const bottomCuts = cuts.filter(c => c.side === "bottom").map(c => [c.x1, c.x2]);
  const leftCuts = cuts.filter(c => c.side === "left").map(c => [c.y1, c.y2]);
  const rightCuts = cuts.filter(c => c.side === "right").map(c => [c.y1, c.y2]);

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

  for (const c of cuts) {
    if (c.side === "top") {
      segments.push([c.x1,c.y1,c.x1,c.y2], [c.x1,c.y2,c.x2,c.y2], [c.x2,c.y2,c.x2,c.y1]);
    } else if (c.side === "bottom") {
      segments.push([c.x1,c.y2,c.x1,c.y1], [c.x1,c.y1,c.x2,c.y1], [c.x2,c.y1,c.x2,c.y2]);
    } else if (c.side === "left") {
      segments.push([c.x1,c.y1,c.x2,c.y1], [c.x2,c.y1,c.x2,c.y2], [c.x2,c.y2,c.x1,c.y2]);
    } else {
      segments.push([c.x2,c.y1,c.x1,c.y1], [c.x1,c.y1,c.x1,c.y2], [c.x1,c.y2,c.x2,c.y2]);
    }
  }

  return segments;
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

function makeOptimizationSamples(room, maxPoints = 900) {
  const aspect = Math.max(0.1, room.widthM / Math.max(0.1, room.lengthM));
  let nx = Math.max(10, Math.round(Math.sqrt(maxPoints * aspect)));
  let ny = Math.max(10, Math.round(maxPoints / nx));
  nx = Math.min(nx, 80);
  ny = Math.min(ny, 80);

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
  return samples;
}

function placementGeometryScore(placements, room, samples = null, clearanceM = 0) {
  if (!placements?.length) return Infinity;

  const pts = placements.map(p => ({
    xM: p.x / FEET_PER_METER,
    yM: p.y / FEET_PER_METER
  }));
  const testPoints = samples || makeOptimizationSamples(room);

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

  if (!distances.length) return Infinity;
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
        wallPenalty += Math.pow((clearanceM - d) / clearanceM, 2);
      }
    }
    wallPenalty /= Math.max(1, pts.length);
  }

  return max * 0.52 + p90 * 0.28 + std * 0.12 + wallPenalty * 1.8;
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

function optimizePlacementsForRoom(basePlacements, coverage, room, mode = "balanced") {
  const base = basePlacements.map(p => ({...p}));
  const clearanceM = recommendedWallClearanceMeters(coverage, room);

  if (!base.length || room.shape === "rectangle") {
    return {
      placements: base,
      optimized: false,
      method: "Pravidelná mřížka",
      improvementPct: 0,
      clearanceM
    };
  }

  const samples = makeOptimizationSamples(room);
  const baseScore = placementGeometryScore(base, room, samples, clearanceM);

  // Circle uses its own symmetry-preserving optimizer.
  if (room.shape === "circle") {
    const regular = generateCircularRingPlacements(base.length, room, clearanceM);
    const regularScore = placementGeometryScore(regular, room, samples, clearanceM);

    if (mode === "regular") {
      return {
        placements: regular,
        optimized: false,
        method: "Pravidelné centrované rozmístění",
        improvementPct: baseScore > 0 ? Math.max(0, (baseScore - regularScore) / baseScore * 100) : 0,
        clearanceM
      };
    }

    const radiusOptimized = optimizeCircularRadius(regular, room, clearanceM, samples);
    const optimizedScore = placementGeometryScore(radiusOptimized, room, samples, clearanceM);

    if (mode === "balanced") {
      // Balanced in a circle never breaks symmetry. It only adjusts ring radius.
      return {
        placements: radiusOptimized,
        optimized: true,
        method: "Vyvážené centrované rozmístění",
        improvementPct: regularScore > 0 ? Math.max(0, (regularScore - optimizedScore) / regularScore * 100) : 0,
        clearanceM
      };
    }

    // Coverage mode may use a slightly broader radial search, but still
    // preserves the centroid and the ring structure.
    const coverageOptimized = optimizeCircularRadius(radiusOptimized, room, clearanceM * 0.85, samples);
    const coverageScore = placementGeometryScore(coverageOptimized, room, samples, clearanceM * 0.85);

    return {
      placements: coverageOptimized,
      optimized: true,
      method: "Centrované rozmístění pro nejlepší pokrytí",
      improvementPct: regularScore > 0 ? Math.max(0, (regularScore - coverageScore) / regularScore * 100) : 0,
      clearanceM
    };
  }

  // L-shaped rooms keep the grid/alignment logic.
  const regular = generateRegularLPlacements(base, coverage, room, clearanceM);
  const regularScore = placementGeometryScore(regular, room, samples, clearanceM);

  if (mode === "regular") {
    return {
      placements: regular,
      optimized: false,
      method: "Pravidelné zarovnání L",
      improvementPct: baseScore > 0 ? Math.max(0, (baseScore - regularScore) / baseScore * 100) : 0,
      clearanceM
    };
  }

  const coverageCandidate = relaxPlacements(regular, room, 6, 0.60, clearanceM);
  const coverageScore = placementGeometryScore(coverageCandidate, room, samples, clearanceM);

  if (mode === "balanced") {
    const balanced = blendPlacements(regular, coverageCandidate, room, 0.35, clearanceM);
    const balancedScore = placementGeometryScore(balanced, room, samples, clearanceM);

    return {
      placements: balanced,
      optimized: true,
      method: "Vyvážené rozmístění L",
      improvementPct: regularScore > 0 ? Math.max(0, (regularScore - balancedScore) / regularScore * 100) : 0,
      clearanceM
    };
  }

  return {
    placements: coverageCandidate,
    optimized: true,
    method: "Optimalizované pokrytí L",
    improvementPct: regularScore > 0 ? Math.max(0, (regularScore - coverageScore) / regularScore * 100) : 0,
    clearanceM
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
  tap,
  room
}) {
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

  const average = cells.length ? 10 * Math.log10(sumLinear / cells.length) : 0;
  if (!cells.length) { min = 0; max = 0; }

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
const AUDIO_BASE_VOLUME = 0.32;

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
  audio.volume = Math.max(0.03, Math.min(1, AUDIO_BASE_VOLUME * relativeGain));

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
  const floorDefs = `<defs>${roomClipPath(room, ox, oy, scale, floorClipId)}</defs>`;

  const title = `<text x="${W/2}" y="${oy - 22}" text-anchor="middle"
    fill="#dfe6ee" font-size="16" font-weight="700">${speakerModel}</text>`;

  const dims = `
    <text x="${W/2}" y="${oy + roomH + 34}" text-anchor="middle"
      fill="#dfe6ee" font-size="16" font-weight="700">${widthM.toFixed(1)} m</text>
    <text x="${ox - 26}" y="${H/2}" text-anchor="middle"
      fill="#dfe6ee" font-size="16" font-weight="700"
      transform="rotate(-90 ${ox - 26} ${H/2})">${lengthM.toFixed(1)} m</text>
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

  svg.innerHTML = floorDefs + rect + `<g clip-path="url(#${floorClipId})">${heatCells}</g>` + title + dims + circles + listener;
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
        <td>${
          getPriceItemUrl(row.priceItem)
            ? `<a class="price-product-link" href="${escapeHtml(getPriceItemUrl(row.priceItem))}" target="_blank" rel="noopener noreferrer" title="Otevřít produkt na AV Integra">${escapeHtml(row.name)}</a>`
            : escapeHtml(row.name)
        }</td>
        <td>${row.qty}×</td>
        <td>${escapeHtml(row.code || "—")}</td>
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
      : "U některých položek chybí cena nebo kód produktu; celková cena proto není zobrazena.";
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
    detail.textContent = "V databázi není aktivní zesilovač, který splní požadovaný výkon a limity rozdělení zóny.";
    return;
  }

  model.textContent = `${result.ampCount > 1 ? result.ampCount + "× " : ""}${result.amp.model}`;
  capacity.textContent = `${result.totalCapacity.toFixed(0)} W`;
  utilization.textContent = `${result.utilization.toFixed(0)} %`;
  const danteText = result.amp.hasDante ? "Dante" : "bez Dante";
  const dspText = result.amp.hasDSP ? "DSP" : "bez DSP";
  detail.textContent =
    `${result.splitsNeeded} výkonový${result.splitsNeeded === 1 ? "" : "é"} výstup${result.splitsNeeded === 1 ? "" : "y"} pro zónu; ` +
    `${result.amp.powerPerZone.toFixed(0)} W na výstup; ${dspText}, ${danteText}.`;
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
  const placementOptimizationMode = document.getElementById("placementOptimization")?.value || "balanced";
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

  const placementOptimization = optimizePlacementsForRoom(
    basePlacements,
    coverage,
    room,
    placementOptimizationMode
  );
  const placements = placementOptimization.placements;
  const effectiveCoverage = {...coverage, count: placements.length};

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
  updateSuitabilityUI(suitability);
  document.getElementById("speakerCount").textContent = `${effectiveCoverage.count} ks`;
  document.getElementById("layoutValue").textContent =
    room.shape === "rectangle"
      ? `${coverage.columns} × ${coverage.rows}`
      : placementOptimization.method;
  document.getElementById("tapValue").textContent = `${selectedTap} W`;
  document.getElementById("listenerSplValue").textContent = `${listenerSPL.toFixed(1)} dB`;
  document.getElementById("averageSplValue").textContent = `${heatmap.average.toFixed(1)} dB`;
  document.getElementById("minimumSplValue").textContent = `${heatmap.min.toFixed(1)} dB`;
  document.getElementById("maximumSplValue").textContent = `${heatmap.max.toFixed(1)} dB`;
  document.getElementById("spreadSplValue").textContent = `${heatmap.spread.toFixed(1)} dB`;
  const splWithin3Pct = calculateSplToleranceCoverage(heatmap, 3);
  document.getElementById("splWithin3Value").textContent = `${splWithin3Pct.toFixed(0)} %`;

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
    `${coverageNames[coverageDensity] || coverage.densityLabel} / ±${coverage.expectedSPLVariation} dB`;
  const optimizationImprovementText =
    Number.isFinite(placementOptimization.improvementPct)
      ? ` • geometrické zlepšení ${placementOptimization.improvementPct.toFixed(1).replace(".", ",")} %`
      : "";

  document.getElementById("placementOptimizationValue").textContent =
    room.shape === "rectangle"
      ? "Pravidelná mřížka"
      : `${placementOptimization.method}${optimizationImprovementText}`;
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
    spacingSummary.textContent = `${(coverage.spacingX / FEET_PER_METER).toFixed(1).replace(".", ",")} × ${(coverage.spacingY / FEET_PER_METER).toFixed(1).replace(".", ",")} m`;
  }

  const coverageSummary = document.getElementById("coverageSummaryValue");
  if (coverageSummary) {
    coverageSummary.textContent = `Ø ${(coverage.coverageDiameter / FEET_PER_METER).toFixed(1).replace(".", ",")} m`;
  }

  const optimizationSummary = document.getElementById("optimizationSummaryValue");
  if (optimizationSummary) {
    optimizationSummary.textContent =
      room.shape === "rectangle"
        ? "Pravidelná mřížka"
        : `${placementOptimization.improvementPct.toFixed(1).replace(".", ",")} %`;
    optimizationSummary.title =
      room.shape === "rectangle"
        ? "Pravidelná obdélníková mřížka"
        : placementOptimization.method;
  }

  const roomAreaSummary = document.getElementById("roomAreaSummaryValue");
  if (roomAreaSummary) roomAreaSummary.textContent = `${room.areaM2.toFixed(1).replace(".", ",")} m²`;

  const targetSplSummary = document.getElementById("targetSplSummaryValue");
  if (targetSplSummary) targetSplSummary.textContent = `${targetSPL.toFixed(0)} dB`;

  const ambientNoiseSummary = document.getElementById("ambientNoiseSummaryValue");
  if (ambientNoiseSummary) ambientNoiseSummary.textContent = `${ambientNoise.toFixed(0)} dB`;
  updateAmplifierUI(amplifierRecommendation);
  updatePriceSummary({ speaker, speakerCount: effectiveCoverage.count, amplifierRecommendation });
  document.getElementById("listenerPositionValue").textContent =
    `${(appState.listenerXFt / FEET_PER_METER).toFixed(1)} × ${(appState.listenerYFt / FEET_PER_METER).toFixed(1)} m`;
  updateSpeakerCoordinatesTable(placements);

  appState.latest = {
    lengthM, widthM, heightM, lengthFt, widthFt,
    placements, coverage: effectiveCoverage, room, placementOptimization, placementOptimizationMode, speaker, power: adjustedPower, heatmap, visualHeatmap, splStats,
    recommendedSpeaker, recommendedCoverage, amplifierRecommendation,
    listenerHeightFt, mountingHeightFt
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
  audioPlayToggle.textContent = spatialAudio.paused ? "Spustit" : "Pozastavit";
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
  calculate();
});



["length","width","height","ambientNoiseCustom","useCase","listenerPosition","coverageDensity","speakerType","pendantHeight","voltage","ampPriority","dantePreference","tapOverride","lCutSide","lCutWidth","lCutLength","lCutOffset","secondCutEnabled","lCutSide2","lCutWidth2","lCutLength2","lCutOffset2","diameter","placementOptimization"]
  .forEach(id => {
    document.getElementById(id).addEventListener("change", () => {
      if (id === "secondCutEnabled") updateRoomShapeUi();
      if (["length","width","lCutSide","lCutWidth","lCutLength","lCutOffset","secondCutEnabled","lCutSide2","lCutWidth2","lCutLength2","lCutOffset2","diameter"].includes(id)) {
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
