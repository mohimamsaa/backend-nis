# backend-nis

Install Aplikasi Backend
---------------------

- Jalankan script dibawah ini untuk melakukan install dependencies

> npm install

- Ubah setting environment yang ada pada file .env

> DATABASE_URL=postgres://{username}:{password}@localhost:{port}/{nama-database}

- Setelah itu jalankan script di bawah ini untuk menginisiasi database dan membuat table di database, pastikan bahwa database sudah memiliki extension postgis

> npm run setup

- Kemudian aplikasi backend dapat langsung digunakan pada alamat berikut

> http://localhost:5000


Menjalankan aplikasi ketika sudah melakukan setup
---------------------

- Untuk menjalankan aplikasi gunakan script yang ada di bawah ini

> npm run start

API yang tersedia
---------------------

## Membuat data spasial
> POST /api/v1/create

API ini digunakan untuk membuat data spasial. Body pada data menggunakan format GeoJson seperti di bawah ini
```
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [
                [102.0, 0.0],
                [112.0, 5.0],
                [117.0, 10.0],
                [111.0, 20.0],
                [102.0, 0.0]
            ]
        ]
    },
    "properties": {
        "name": "Sumatera",
        "desription": "Pulau"
    }
  }]
}
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [102.0, 0.0],
          [103.0, 1.0],
          [104.0, 0.0],
          [120.0, 1.0]
        ]
      },
      "properties": {
        "name": "boom",
        "description": "pspspsps",
        "long": 40
      },
  }]
}
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [108, -3]
    },
    "properties": {
      "name": "Sumatra."
    },
  }]
}
```
## Memperbarui data spasial
> POST /api/v1/update

API ini digunakan untuk mengubah data spasial. Body pada data menggunakan format GeoJson seperti di bawah ini
```
{
  "type": "FeatureCollection",
  "features": [{
    "id": "1",
    "type": "Feature",
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [
                [102.0, 0.0],
                [112.0, 5.0],
                [117.0, 10.0],
                [111.0, 20.0],
                [102.0, 0.0]
            ]
        ]
    },
    "properties": {
        "name": "Sumatera",
        "desription": "Pulau"
    }
  }]
}
```
## Menghapus data spasial
> POST /api/v1/delete

API ini digunakan untuk menghapus data spasial. Body pada data menggunakan format GeoJson seperti di bawah ini
```
{
  "type": "FeatureCollection",
  "features": [{
    "id": "2",
    "type": "Feature",
    "geometry": {
        "type": "Polygon"
    }
  }]
}
```

## Mengambil data spasial
> POST /api/v1/get-features?type={tipe data}

API ini digunakan untuk mengambil data spasial yang ada pada database. ada 3 jenis tipe data yaitu polygon, line dan point
Response yang diterima sebagai berikut.
```
"data": {
  "type": "FeatureCollection",
  "features": [
    {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [100, 0],
                    [110, 5],
                    [115, 10],
                    [109, 20],
                    [100, 0]
                ]
            ]
        },
        "properties": {
            "id": 1,
            "name": "Sumatera",
            "description": Pulau,
            "area": 118
        }
    },
    {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [102, 0],
                    [112, 5],
                    [117, 10],
                    [111, 20],
                    [102,0]
                ]
            ]
        },
        "properties": {
            "id": 3,
            "name": "Sumatera",
            "description": Pulau,
            "area": 118
        }
    },
  ]
}
```

# Terima Kasih

Sumber Data GeoJson
---------------------
https://datatracker.ietf.org/doc/rfc7946/?include_text=1
