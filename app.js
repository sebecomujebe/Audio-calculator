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

const USE_CASES = {
  foreground: { label: "Foreground Music", targetSPL: 85, snrAboveAmbient: 10 },
  speech: { label: "Speech Reinforcement", targetSPL: 78, snrAboveAmbient: 15 },
  paging: { label: "Paging / Announcement", targetSPL: 80, snrAboveAmbient: 15 },
  general: { label: "General Purpose", targetSPL: 80, snrAboveAmbient: 12 },
  background: { label: "Background Music", targetSPL: 75, snrAboveAmbient: 6 },
  utility: { label: "Utility", targetSPL: 70, snrAboveAmbient: 5 },
};

const SPEAKERS = [
  { model:"PS-C41RT", sensitivity:87, coverageAngle:120, type:"Ceiling", maxPower:60, taps:[3.125,6.25,12.5,25], taps100:[6.25,12.5,25], wooferSize:4 },
  { model:"PS-C43RT", sensitivity:87, coverageAngle:120, type:"Ceiling", maxPower:60, taps:[3.75,7.5,15,30], taps100:[7.5,15,30], wooferSize:4 },
  { model:"PS-C61RT", sensitivity:91, coverageAngle:120, type:"Ceiling", maxPower:100, taps:[4,8,16,32], taps100:[8,16,32], wooferSize:6 },
  { model:"PS-C63RT", sensitivity:91, coverageAngle:120, type:"Ceiling", maxPower:120, taps:[7.5,15,30,60], taps100:[15,30,60], wooferSize:6 },
  { model:"PS-C83RT", sensitivity:91, coverageAngle:120, type:"Ceiling", maxPower:160, taps:[7.5,15,30,60], taps100:[15,30,60], wooferSize:8 },
  { model:"PS-C85RT (Horn)", sensitivity:93, coverageAngle:80, type:"Ceiling", maxPower:300, taps:[15,30,60,120], taps100:[30,60,120], wooferSize:8 },
  { model:"PS-C85RT (Collar)", sensitivity:93, coverageAngle:120, type:"Ceiling", maxPower:300, taps:[15,30,60,120], taps100:[30,60,120], wooferSize:8 },
  { model:"PS-P43T", sensitivity:87, coverageAngle:120, type:"Pendant", maxPower:60, taps:[3.75,7.5,15,30], taps100:[7.5,15,30], wooferSize:4 },
  { model:"PS-P63T", sensitivity:88, coverageAngle:120, type:"Pendant", maxPower:120, taps:[7.5,15,30,60], taps100:[15,30,60], wooferSize:6 },
  { model:"PS-P83T", sensitivity:90, coverageAngle:120, type:"Pendant", maxPower:160, taps:[7.5,15,30,60], taps100:[15,30,60], wooferSize:8 },
  { model:"PS-P85T (Horn)", sensitivity:88, coverageAngle:80, type:"Pendant", maxPower:300, taps:[15,30,60,120], taps100:[30,60,120], wooferSize:8 },
  { model:"PS-P85T (Collar)", sensitivity:88, coverageAngle:120, type:"Pendant", maxPower:300, taps:[15,30,60,120], taps100:[30,60,120], wooferSize:8 },
];

function toFeet(m) {
  return m * FEET_PER_METER;
}

function getSpeaker(model) {
  return SPEAKERS.find(s => s.model === model);
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

function getDefaultSpeaker({speakerType, useCase, effectiveHeightFt, lengthFt, widthFt, ambientNoise, roomHeightFt}) {
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

  const densityModes = {
    "center-to-center": { multiplier: 0.5, variation: 1, label: "Center-to-center" },
    "min-overlap": { multiplier: 0.707, variation: 2, label: "Minimum overlap" },
    "balanced": { multiplier: 0.85, variation: 3, label: "Balanced" },
    "edge-to-edge": { multiplier: 1, variation: 4, label: "Edge-to-edge" },
    "extended": { multiplier: 1.4, variation: 7, label: "Extended" }
  };

  const density = densityModes[coverageDensity] || densityModes["min-overlap"];
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
  const arrayGain = 10 * Math.log10(coverage.count);

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

  const combinedSPL = singleSpeakerSPL + arrayGain;

  return {
    requiredTap,
    recommendedTap,
    singleSpeakerSPL,
    combinedSPL,
    snr: combinedSPL - ambientNoise,
    totalPower: recommendedTap * coverage.count
  };
}

function drawFloorPlan({lengthM, widthM, placements, coverage, speakerModel}) {
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
  const radius = Math.max(8, Math.min(22, coverage.coverageDiameter * ftToM * scale * 0.08));

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

  const circles = placements.map((p, idx) => {
    const xM = p.x * ftToM;
    const yM = p.y * ftToM;
    const cx = ox + xM * scale;
    const cy = oy + yM * scale;

    return `
      <g>
        <circle cx="${cx}" cy="${cy}" r="${radius + 6}" fill="rgba(255,122,26,0.12)" stroke="rgba(255,122,26,0.32)" stroke-width="1"/>
        <circle cx="${cx}" cy="${cy}" r="${radius}" fill="#ff7a1a" stroke="#fff" stroke-width="2"/>
        <circle cx="${cx}" cy="${cy}" r="${Math.max(2, radius * 0.28)}" fill="#fff"/>
        <text x="${cx}" y="${cy + radius + 18}" text-anchor="middle" fill="#9ba8b7" font-size="10">${idx + 1}</text>
      </g>`;
  }).join("");

  const listener = `
    <g>
      <circle cx="${W/2}" cy="${H/2}" r="14" fill="#5ba5ff" stroke="#fff" stroke-width="2"/>
      <circle cx="${W/2}" cy="${H/2 - 3}" r="4" fill="#fff"/>
      <ellipse cx="${W/2}" cy="${H/2 + 5}" rx="6" ry="7" fill="#fff"/>
    </g>
  `;

  svg.innerHTML = rect + title + dims + circles + listener;
}

function formatMetersFromFeet(ft) {
  return (ft / FEET_PER_METER).toFixed(2) + " m";
}

function calculate() {
  const lengthM = Number(document.getElementById("length").value);
  const widthM = Number(document.getElementById("width").value);
  const heightM = Number(document.getElementById("height").value);
  const ambientNoise = Number(document.getElementById("ambientNoise").value);
  const useCase = document.getElementById("useCase").value;
  const listenerPosition = document.getElementById("listenerPosition").value;
  const coverageDensity = document.getElementById("coverageDensity").value;
  const speakerType = document.getElementById("speakerType").value;
  const voltage = document.getElementById("voltage").value;
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
  const earHeightFt = listenerPosition === "standing"
    ? STANDING_EAR_HEIGHT_FT
    : SEATED_EAR_HEIGHT_FT;
  const effectiveHeightFt = Math.max(MIN_LISTENER_DISTANCE_FT, mountingHeightFt - earHeightFt);

  const speakerModel = getDefaultSpeaker({
    speakerType,
    useCase,
    effectiveHeightFt,
    lengthFt,
    widthFt,
    ambientNoise,
    roomHeightFt: mountingHeightFt
  });

  const speaker = getSpeaker(speakerModel);
  const targetSPL = getTargetSPL(ambientNoise, useCase);

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

  document.getElementById("resultTitle").textContent = speaker.model;
  document.getElementById("speakerCount").textContent = `${coverage.count} ks`;
  document.getElementById("layoutValue").textContent = `${coverage.columns} × ${coverage.rows}`;
  document.getElementById("tapValue").textContent = `${power.recommendedTap} W`;
  document.getElementById("splValue").textContent = `${power.combinedSPL.toFixed(1)} dB`;

  document.getElementById("targetSplValue").textContent = `${targetSPL.toFixed(0)} dB`;
  document.getElementById("coverageModeValue").textContent =
    `${coverage.densityLabel} / ±${coverage.expectedSPLVariation} dB`;
  document.getElementById("listenerDistanceValue").textContent = formatMetersFromFeet(coverage.listenerDistance);
  document.getElementById("coverageDiameterValue").textContent = formatMetersFromFeet(coverage.coverageDiameter);
  document.getElementById("spacingXValue").textContent = formatMetersFromFeet(coverage.spacingX);
  document.getElementById("spacingYValue").textContent = formatMetersFromFeet(coverage.spacingY);
  document.getElementById("zonePowerValue").textContent = `${power.totalPower.toFixed(0)} W`;

  drawFloorPlan({
    lengthM,
    widthM,
    placements,
    coverage,
    speakerModel: speaker.model
  });
}

document.getElementById("speakerType").addEventListener("change", (e) => {
  document.getElementById("pendantHeightRow").classList.toggle("hidden", e.target.value !== "pendant");
});

document.getElementById("calculateBtn").addEventListener("click", calculate);

["length","width","height","ambientNoise","useCase","listenerPosition","coverageDensity","speakerType","pendantHeight","voltage"]
  .forEach(id => {
    document.getElementById(id).addEventListener("change", calculate);
  });

calculate();
