// === BAGIAN 1: LOKASI & DATA ===

// Lokasi: Gelora Bung Karno (GBK) & Hutan Kota
// titik tengah Senayan
var lokasi = ee.Geometry.Point([106.8026, -6.2183]); 

Map.centerObject(lokasi, 15);

// Ambil Data Sentinel-2 Terbaru (2023-2024)
var sentinels = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
    .filterDate('2023-01-01', '2024-05-01') // Data setahun terakhir
    .filterBounds(lokasi)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)) // Filter awan
    .median(); // Ambil rata-rata bersih

// === BAGIAN 2: MENGHITUNG NDVI ===
// Rumus: (NIR - Red) / (NIR + Red)
// Sentinel-2: Band 8 adalah NIR, Band 4 adalah Red

var ndvi = sentinels.normalizedDifference(['B8', 'B4']).rename('NDVI');

// === BAGIAN 3: PENGATURAN WARNA (VISUALISASI) ===

var ndviParams = {
  min: 0.0,  // Nilai 0 = Tidak ada vegetasi (Beton/Air)
  max: 0.8,  // Nilai 0.8 = Vegetasi sangat lebat (Hutan)
  palette: [
    'red',    // Merah = Bangunan / Beton / Air
    'yellow', // Kuning = Rumput jarang / Tanah
    'green',  // Hijau Muda = Tanaman Kebun
    'darkgreen' // Hijau Tua = Pohon Besar / Hutan Lebat
  ]
};

// === TAMPILKAN ===
// Layer 1: Foto Asli
Map.addLayer(sentinels, {bands:['B4','B3','B2'], min:0, max:3000}, 'Foto Asli');

// Layer 2: Hasil Analisis NDVI
Map.addLayer(ndvi, ndviParams, 'Peta Kesehatan Tanaman (NDVI)');
