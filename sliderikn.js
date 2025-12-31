// ===IKN ===

// 1. Lokasi: Titik Nol Nusantara / Istana Negara
var lokasi = ee.Geometry.Point([116.7063, -0.9632]); 
Map.centerObject(lokasi, 14); 

// 2. Data KIRI (Hutan - 2019)
var gambarKiri = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
    .filterDate('2019-01-01', '2019-12-30')
    .filterBounds(lokasi)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .median();

// 3. Data KANAN (Konstruksi Masif - 2024)
var gambarKanan = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
    .filterDate('2024-01-01', '2024-05-01')
    .filterBounds(lokasi)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .median();

// 4. Label
var labelKiri = '2019 (Hutan Tanaman)';
var labelKanan = '2024 (Pembangunan IKN)';

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
