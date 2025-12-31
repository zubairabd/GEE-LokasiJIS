// =======================================================
// BAGIAN 1: PENGATURAN DATA
// =======================================================

// 1. Pilih Lokasi
var lokasi = ee.Geometry.Point([106.8596, -6.1253]);
Map.centerObject(lokasi, 15); // Zoom Level

// 2. Siapkan Data "KIRI" (Masa Lalu / Sebelum)
// Menggunakan Sentinel-2 (Rentang 2015-2017)
var gambarKiri = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
    .filterDate('2015-08-01', '2017-06-30')
    .filterBounds(lokasi)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .median();

// 3. Siapkan Data "KANAN" (Masa Kini / Sesudah)
// Menggunakan Sentinel-2 (Rentang 2023-2024)
var gambarKanan = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
    .filterDate('2023-01-01', '2024-05-01')
    .filterBounds(lokasi)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .median();

// 4. Label Tulisan
var labelKiri = 'Tahun 2016 (Tanah Kosong)';
var labelKanan = 'Tahun 2024 (Stadion JIS)';

// =======================================================
// BAGIAN 2: MESIN UI
// =======================================================

// Visualisasi RGB
var visParams = {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000};

// Membuat Peta Kiri & Kanan
var leftMap = ui.Map();
var rightMap = ui.Map();

// Memasukkan Gambar ke Peta
leftMap.addLayer(gambarKiri, visParams, labelKiri);
rightMap.addLayer(gambarKanan, visParams, labelKanan);

// Menambahkan Label Tulisan di Peta
var label1 = ui.Label(labelKiri, {position: 'bottom-left', fontWeight: 'bold', padding: '5px'});
var label2 = ui.Label(labelKanan, {position: 'bottom-right', fontWeight: 'bold', padding: '5px'});
leftMap.add(label1);
rightMap.add(label2);

// Kunci Lokasi 
var linker = ui.Map.Linker([leftMap, rightMap]);

// Membuat Panel Pembelah (Split Panel)
var splitPanel = ui.SplitPanel({
  firstPanel: leftMap,
  secondPanel: rightMap,
  orientation: 'horizontal',
  wipe: true, // Ini yang bikin efek slider geser
  style: {stretch: 'both'}
});

// Reset Tampilan Utama (Root)
ui.root.widgets().reset([splitPanel]);
leftMap.centerObject(lokasi, 15);
