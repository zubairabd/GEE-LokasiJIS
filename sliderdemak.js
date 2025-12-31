// === BANJIR DEMAK (SLIDER) ===

// 1. Lokasi: Demak / Kudus (Area Banjir)
var lokasi = ee.Geometry.Point([110.7674, -6.8943]); 
Map.centerObject(lokasi, 13); 

// 2. Data KIRI (Sebelum Banjir - Maret 2023)
var gambarKiri = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
    .filterDate('2023-03-01', '2023-03-30')
    .filterBounds(lokasi)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .median();

// 3. Data KANAN (Saat Banjir - Maret 2024)
var gambarKanan = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
    .filterDate('2024-03-18', '2024-03-30')
    .filterBounds(lokasi)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30))
    .median();

// 4. Label
var labelKiri = 'Maret 2023 (Normal)';
var labelKanan = 'Maret 2024 (Banjir Besar)';

// === MESIN UI ===
var visParams = {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000};
var leftMap = ui.Map();
var rightMap = ui.Map();
leftMap.addLayer(gambarKiri, visParams, labelKiri);
rightMap.addLayer(gambarKanan, visParams, labelKanan);
var label1 = ui.Label(labelKiri, {position: 'bottom-left', fontWeight: 'bold', padding: '5px'});
var label2 = ui.Label(labelKanan, {position: 'bottom-right', fontWeight: 'bold', padding: '5px'});
leftMap.add(label1);
rightMap.add(label2);
var linker = ui.Map.Linker([leftMap, rightMap]);
var splitPanel = ui.SplitPanel({
  firstPanel: leftMap,
  secondPanel: rightMap,
  orientation: 'horizontal',
  wipe: true,
  style: {stretch: 'both'}
});
ui.root.widgets().reset([splitPanel]);
leftMap.centerObject(lokasi, 13);
