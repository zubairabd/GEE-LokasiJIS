// === LIKUEFAKSI PALU (Balaroa) ===

// 1. Lokasi: Perumnas Balaroa, Palu
var lokasi = ee.Geometry.Point([119.8374, -0.9085]); 
Map.centerObject(lokasi, 15); 

// 2. Data KIRI (Sebelum Gempa - 2017)
var gambarKiri = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
    .filterDate('2017-01-01', '2018-08-01')
    .filterBounds(lokasi)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
    .median();

// 3. Data KANAN (Setelah Gempa & Rata Tanah - 2019/2020)
var gambarKanan = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
    .filterDate('2019-01-01', '2020-12-30')
    .filterBounds(lokasi)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
    .median();

// 4. Label
var labelKiri = '2017 (Perumahan Padat)';
var labelKanan = '2020 (Bekas Likuefaksi)';


// =======================================================
// === BAGIAN MESIN UI===
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

// Linker (Supaya digeser bareng)
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
