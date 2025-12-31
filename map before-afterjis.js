// === PENGATURAN LOKASI JIS ===

// Koordinat JIS (Papanggo, Tanjung Priok)
var lokasi = ee.Geometry.Point([106.8596, -6.1253]); 

// Zoom ukuran 15
Map.centerObject(lokasi, 15); 

// ========================================================
// === PENGATURAN WAKTU ===

// TAHUN LAMA (Era Taman BMW)
var dataLama = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
    .filterDate('2017-08-01', '2018-06-30') 
    .filterBounds(lokasi)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .median(); 

// TAHUN BARU (Era JIS Sudah Jadi)
// Ambil data setahun terakhir (2023-2024)
var dataBaru = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
    .filterDate('2023-01-01', '2024-05-01')
    .filterBounds(lokasi)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .median();

// ========================================================
// === VISUALISASI ===

var visParams = {
  bands: ['B4', 'B3', 'B2'], 
  min: 0,
  max: 3000, // Kecerahan standar
};

// Tampilkan
Map.addLayer(dataLama, visParams, 'Lokasi Sebelum Ada JIS (2016)');
Map.addLayer(dataBaru, visParams, 'JIS Sekarang (2024)');
