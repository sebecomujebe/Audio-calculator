const APP_VERSION = "0.71.1";
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
  foreground: { label: "Hlavní hudební ozvučení", targetSPL: 85, snrAboveAmbient: 10 },
  speech: { label: "Zesílení řeči", targetSPL: 78, snrAboveAmbient: 15 },
  paging: { label: "Hlášení / oznámení", targetSPL: 80, snrAboveAmbient: 15 },
  general: { label: "Univerzální ozvučení", targetSPL: 80, snrAboveAmbient: 12 },
  background: { label: "Hudba na pozadí", targetSPL: 75, snrAboveAmbient: 6 },
  utility: { label: "Jednoduché užitkové ozvučení", targetSPL: 70, snrAboveAmbient: 5 },
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
    "center-to-center": { multiplier: 0.5, variation: 1, label: "Střed ke středu" },
    "min-overlap": { multiplier: 0.707, variation: 2, label: "Minimální překrytí" },
    "balanced": { multiplier: 0.85, variation: 3, label: "Vyvážené překrytí" },
    "edge-to-edge": { multiplier: 1, variation: 4, label: "Hrana k hraně" },
    "extended": { multiplier: 1.4, variation: 7, label: "Rozšířené rozestupy" }
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
  // Adaptivní přesná síť:
  // cílíme na cca 0,5 m mezi vzorky; u extrémně velkých prostor
  // dovolíme až 0,75 m, aby výpočet zůstal rychlý.
  const targetStepM = 0.5;
  const maxStepM = 0.75;
  const lengthM = lengthFt / FEET_PER_METER;
  const widthM = widthFt / FEET_PER_METER;

  let stepM = targetStepM;
  let nx = Math.max(12, Math.ceil(widthM / stepM));
  let ny = Math.max(12, Math.ceil(lengthM / stepM));

  // Ochrana výkonu pro opravdu velké haly: max ~40 000 bodů.
  const maxPoints = 40000;
  if (nx * ny > maxPoints) {
    const areaM2 = widthM * lengthM;
    stepM = Math.sqrt(areaM2 / maxPoints);
    stepM = Math.min(maxStepM, Math.max(targetStepM, stepM));
    nx = Math.max(12, Math.ceil(widthM / stepM));
    ny = Math.max(12, Math.ceil(lengthM / stepM));

    // Když by i při 0,75 m bylo bodů příliš, omezíme počet poměrově.
    if (nx * ny > maxPoints) {
      const scale = Math.sqrt(maxPoints / (nx * ny));
      nx = Math.max(12, Math.floor(nx * scale));
      ny = Math.max(12, Math.floor(ny * scale));
    }
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
        xFt, yFt, listenerHeightFt, placements, mountingHeightFt, speaker, tap
      });

      cells.push({ix, iy, spl});
      min = Math.min(min, spl);
      max = Math.max(max, spl);

      // Pro fyzikálně správný průměr hladin pracujeme v lineární energii.
      sumLinear += Math.pow(10, spl / 10);
    }
  }

  const average = 10 * Math.log10(sumLinear / cells.length);

  return {
    nx, ny, cells,
    min,
    max,
    average,
    spread: max - min,
    stepXM: actualStepXM,
    stepYM: actualStepYM,
    points: cells.length
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
  // Ve v0.71 používáme pro grafiku i statistiky stejnou adaptivní mřížku.
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


function heatColor(value, min, max) {
  const span = Math.max(0.001, max - min);
  const t = Math.max(0, Math.min(1, (value - min) / span));
  const hue = 220 - 212 * t;
  return `hsl(${hue} 82% 52%)`;
}

let appState = {
  listenerXFt: null,
  listenerYFt: null,
  draggingListener: false,
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

  svg.innerHTML = rect + heatCells + title + dims + circles + listener;

  appState.latest = {
    ...appState.latest,
    floorGeom: { W, H, pad, scale, roomW, roomH, ox, oy, lengthFt, widthFt }
  };
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

  // Adaptivní přesná síť pro heatmapu i všechny statistiky.
  const heatmap = calculateHeatmap({
    lengthFt,
    widthFt,
    placements,
    mountingHeightFt,
    listenerHeightFt,
    speaker,
    tap: power.recommendedTap
  });

  const visualHeatmap = heatmap;
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
    tap: power.recommendedTap
  });

  const suitability = evaluateSpeakerSuitability({
    selectedSpeaker: speaker,
    recommendedSpeaker,
    speakerType,
    targetSPL,
    heatmap,
    power,
    coverage,
    recommendedCoverage
  });

  document.getElementById("resultTitle").textContent = speaker.model;
  updateSuitabilityUI(suitability);
  document.getElementById("speakerCount").textContent = `${coverage.count} ks`;
  document.getElementById("layoutValue").textContent = `${coverage.columns} × ${coverage.rows}`;
  document.getElementById("tapValue").textContent = `${power.recommendedTap} W`;
  document.getElementById("listenerSplValue").textContent = `${listenerSPL.toFixed(1)} dB`;
  document.getElementById("averageSplValue").textContent = `${heatmap.average.toFixed(1)} dB`;
  document.getElementById("minimumSplValue").textContent = `${heatmap.min.toFixed(1)} dB`;
  document.getElementById("maximumSplValue").textContent = `${heatmap.max.toFixed(1)} dB`;
  document.getElementById("spreadSplValue").textContent = `${heatmap.spread.toFixed(1)} dB`;
  document.getElementById("samplingResolutionValue").textContent =
    `${heatmap.stepXM.toFixed(2)} × ${heatmap.stepYM.toFixed(2)} m (${heatmap.points.toLocaleString("cs-CZ")} bodů)`;

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
  document.getElementById("zonePowerValue").textContent = `${power.totalPower.toFixed(0)} W`;
  document.getElementById("listenerPositionValue").textContent =
    `${(appState.listenerXFt / FEET_PER_METER).toFixed(1)} × ${(appState.listenerYFt / FEET_PER_METER).toFixed(1)} m`;

  appState.latest = {
    lengthM, widthM, lengthFt, widthFt,
    placements, coverage, speaker, power, heatmap, visualHeatmap, splStats,
    recommendedSpeaker, recommendedCoverage,
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

["length","width","height","ambientNoiseCustom","useCase","listenerPosition","coverageDensity","speakerType","pendantHeight","voltage"]
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

calculate();
