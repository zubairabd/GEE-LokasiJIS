// === TAMBANG FREEPORT PAPUA ===

// 1. Lokasi: Grasberg Open Pit
var lokasi = ee.Geometry.Point([137.1171, -4.0534]); 
Map.centerObject(lokasi, 13); 

// 2. Data KIRI (Tahun 2016)
var gambarKiri = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
    .filterDate('2016-01-01', '2016-12-30')
    .filterBounds(lokasi)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .median();

// 3. Data KANAN (Tahun 2024)
var gambarKanan = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
    .filterDate('2023-01-01', '2024-05-01')
    .filterBounds(lokasi)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .median();

// 4. Label
var labelKiri = 'Kondisi 2016';
var labelKanan = 'Kondisi 2024';

// =======================================================
// === BAGIAN MESIN UI ===
// =======================================================

// Visualisasi RGB (True Color)
var visParams = {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000};

// Membuat Wadah Peta Kiri & Kanan
var leftMap = ui.Map();
var rightMap = ui.Map();

// Memasukkan Gambar ke Peta
leftMap.addLayer(gambarKiri, visParams, labelKiri);
rightMap.addLayer(gambarKanan, visParams, labelKanan);

// Membuat Label Tulisan
var label1 = ui.Label(labelKiri, {position: 'bottom-left', fontWeight: 'bold', padding: '5px'});
var label2 = ui.Label(labelKanan, {position: 'bottom-right', fontWeight: 'bold', padding: '5px'});
leftMap.add(label1);
rightMap.add(label2);

// Linker 
var linker = ui.Map.Linker([leftMap, rightMap]);

// Membuat Panel Pembelah (Split Panel)
var splitPanel = ui.SplitPanel({
  firstPanel: leftMap,
  secondPanel: rightMap,
  orientation: 'horizontal',
  wipe: true, // Efek Slider
  style: {stretch: 'both'}
});

// Reset Tampilan Utama
ui.root.widgets().reset([splitPanel]);
leftMap.centerObject(lokasi);
