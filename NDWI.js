// === BAGIAN 1: LOKASI (DEMAK/KUDUS) ===
// Titik fokusi area persawahan yang tenggelam
var lokasi = ee.Geometry.Point([110.7674, -6.8943]); 

Map.centerObject(lokasi, 13);

// === BAGIAN 2: DATA SEBELUM & SESUDAH ===

// KONDISI NORMAL
var sebelum = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
    .filterDate('2023-03-01', '2023-03-30')
    .filterBounds(lokasi)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .median();

// KONDISI BANJIR (Maret 2024)
var saatBanjir = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
    .filterDate('2024-03-18', '2024-03-30') // Momen pasca tanggul jebol
    .filterBounds(lokasi)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30))
    .median();

// === BAGIAN 3: MENGHITUNG NDWI (INDEX AIR) ===
// Rumus NDWI = (Green - NIR) / (Green + NIR)
// Sentinel-2: Green = B3, NIR = B8

var ndwiBanjir = saatBanjir.normalizedDifference(['B3', 'B8']);

// === BAGIAN 4: LOGIKA THRESHOLDING (PENTING!) ===
// .gt(0) -> "Greater Than 0"

var areaAir = ndwiBanjir.gt(0); 
// Hasil hanya angka 1 (Air) dan 0 (Bukan Air)

var areaAirVisual = areaAir.updateMask(areaAir); 
// .updateMask membuat yang bukan air jadi transparan

// === BAGIAN 5: TAMPILKAN ===

// Layer 1: Peta Asli Saat Banjir (Warna Coklat Keruh)
Map.addLayer(saatBanjir, {bands:['B4','B3','B2'], min:0, max:3000}, 'Foto Asli Banjir');

// Layer 2: Hasil Deteksi Air (Warna Biru Terang)
Map.addLayer(areaAirVisual, {palette: ['blue']}, 'Deteksi Luas Banjir');
