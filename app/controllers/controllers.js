//app/controller/pointController.js

import dbQuery from '../db/dev/dbQuery';

import {status} from '../helpers/status';
import {checkExist} from '../helpers/helpers';

async function createPoint (feature) {

  const createPointQuery = `INSERT INTO POINT(name, geom)
  values($1, ST_GeomFromText($2, 4326))
  returning id, name, geom`;

  const point = "POINT(" + feature.geometry.coordinates.toString().replace(',', ' ') + ")"

  const values = [
    feature.properties.name,
    point
  ]

  try {
    const { rows } = await dbQuery.query(createPointQuery, values)
    const dbResponse = rows[0]
    
    const resFeature = {
      type: "Feature",
      geometry: {
        type: "",
        coordinates: []
      },
      properties: {}
    }
    
    resFeature.id = dbResponse.id
    resFeature.properties.name = dbResponse.name
    resFeature.properties.geom = dbResponse.geom
    resFeature.geometry.coordinates = feature.geometry.coordinates
    resFeature.geometry.type = feature.geometry.type
    // console.log(featureObject)

    return resFeature
  } catch (err) {
    return err
  }
}

async function createLinePolygon (feature) {
  
  const createLineQuery = `INSERT INTO LineString(name, geom, long, description)
  values($1, ST_GeomFromText($2, 4326), ST_Length(ST_GeomFromText($2, 4326)), $3)
  returning id, name, geom, long, description`;

  const createPolygonQuery = `INSERT INTO Polygon(name, geom, area, description)
  values($1, ST_GeomFromText($2, 4326), ST_Area(ST_GeomFromText($2, 4326)), $3)
  returning id, name, geom, area, description`;

  const arrCoordinate = []
  const arrCoordinateStart = feature.geometry.type == "LineString" ? feature.geometry.coordinates : feature.geometry.coordinates[0]

  arrCoordinateStart.forEach(element => {
    const coor = element.toString().replace(',', ' ')
    arrCoordinate.push(coor)
  });

  const coordinatesLine = "LINESTRING(" + arrCoordinate.toString() + ")"
  const coordinatesPolygon = "POLYGON((" + arrCoordinate.toString() + "))"

  const values = [
    feature.properties.name,
    feature.geometry.type == "LineString" ? coordinatesLine : coordinatesPolygon,
    feature.properties.description
  ]

  try {
    const { rows } = await dbQuery.query(feature.geometry.type == "LineString" ? createLineQuery : createPolygonQuery, values)
    const dbResponse = rows[0]
    // console.log(dbResponse)

    // const resFeature = ...featureObject
    const resFeature = {
      type: "Feature",
      geometry: {
        type: "",
        coordinates: []
      },
      properties: {}
    }

    resFeature.id = dbResponse.id
    resFeature.properties.name = dbResponse.name
    resFeature.properties.geom = dbResponse.geom
    resFeature.properties.description = dbResponse.description
    if (dbResponse.long == null) {
      resFeature.properties.area = dbResponse.area
    } else {
      resFeature.properties.long = dbResponse.long
    }
    resFeature.geometry.coordinates = feature.geometry.coordinates
    resFeature.geometry.type = feature.geometry.type

    return resFeature
  } catch (err) {
    return err
  }
}

async function createAll(req, res) {
  const {features} = req.body;
  // console.log(features)
  const data = {
    type: "FeatureCollection",
    features: []
  }
  for (var i = 0; i < features.length; i++) {
    if (features[i].geometry.type == "Point") {
      data.features.push(await createPoint(features[i]))
    } else if (features[i].geometry.type == "LineString" || features[i].geometry.type == "Polygon") {
      data.features.push(await createLinePolygon(features[i]))
    }
  }
  const successMessage = {
    data: data
  }
  return res.status(status.created).send(successMessage)
}

async function updateAll(req, res) {
  const {features} = req.body;
  console.log('update' + features[0].geometry.type + features[0].id)

  if (!await checkExist(features[0].id, features[0].geometry.type)) {
    const errorMessage = {
      error: 'Id tidak dapat ditemukan'
    }
    return res.status(status.notfound).send(errorMessage)
  }

  if (features[0].geometry.type == "Point") {
    const updatePointQuery = `Update Point
    set name = $1, geom = ST_GeomFromText($2, 4326)
    where id = $3
    returning *`;
  
    const point = "POINT(" + features[0].geometry.coordinates.toString().replace(',', ' ') + ")"
    console.log(point)

    const values = [
      features[0].properties.name,
      point,
      features[0].id
    ]

    try {
      const { rows } = await dbQuery.query(updatePointQuery, values)
      const successMessage = {
        message: "Point dengan id " +  features[0].id + " berhasil di update"
      }
      return res.status(status.created).send(successMessage)
    } catch (err) {
      const errorMessage = {
        error: 'Server Bermasalah'
      }
      return res.status(status.notfound).send(errorMessage)
    }
  } else if (features[0].geometry.type == "LineString") {
    const updateLineQuery = `Update LineString
    set name=$1, geom = ST_GeomFromText($2, 4326), long = ST_Length(ST_GeomFromText($2, 4326)), description = $3
    where id = $4
    returning *`
    const arrCoordinate = []

    features[0].geometry.coordinates.forEach(element => {
      const coor = element.toString().replace(',', ' ')
      arrCoordinate.push(coor)
    });

    const coordinates = "LINESTRING(" + arrCoordinate.toString() + ")"

    const values = [
      features[0].properties.name,
      coordinates,
      features[0].properties.description,
      features[0].id
    ]

    try {
      const { rows } = await dbQuery.query(updateLineQuery, values)
      const successMessage = {
        message: "Line dengan id " +  features[0].id + " berhasil di update"
      }
      return res.status(status.created).send(successMessage)
    } catch (err) {
      const errorMessage = {
        error: 'Server Bermasalah'
      }
      return res.status(status.notfound).send(errorMessage)
    }
  } else if (features[0].geometry.type == "Polygon") {
    const updateLineQuery = `Update polygon
    set name=$1, geom = ST_GeomFromText($2, 4326), area = ST_Area(ST_GeomFromText($2, 4326)), description = $3
    where id = $4
    returning *`
    const arrCoordinate = []

    features[0].geometry.coordinates[0].forEach(element => {
      const coor = element.toString().replace(',', ' ')
      arrCoordinate.push(coor)
    });

    const coordinates = "POLYGON((" + arrCoordinate.toString() + "))"
    
    const values = [
      features[0].properties.name,
      coordinates,
      features[0].properties.description,
      features[0].id
    ]

    try {
      const { rows } = await dbQuery.query(updateLineQuery, values)
      const successMessage = {
        message: "Polygon dengan id " +  features[0].id + " berhasil di update"
      }
      return res.status(status.created).send(successMessage)
    } catch (err) {
      const errorMessage = {
        error: 'Server Bermasalah'
      }
      return res.status(status.notfound).send(errorMessage)
    }
  }
}

async function deleteAll(req, res) {
  const {features} = req.body;
  console.log('delete' + features[0].geometry.type + features[0].id)

  if (!await checkExist(features[0].id, features[0].geometry.type)) {
    const errorMessage = {
      error: 'Id tidak dapat ditemukan'
    }
    return res.status(status.notfound).send(errorMessage)
  }

  const deletePointQuery = "Delete from point where id=$1"
  const deleteLineQuery = "Delete from lineString where id=$1"
  const deletePolygonQuery = "Delete from polygon where id=$1"
  let usedQuery = ""
  
  if (features[0].geometry.type == "Point") {
    usedQuery = deletePointQuery
  } else if (features[0].geometry.type == "LineString") {
    usedQuery = deleteLineQuery
  } else if (features[0].geometry.type == "Polygon") {
    usedQuery = deletePolygonQuery
  }

  try {
    const { rows } = await dbQuery.query(usedQuery, [features[0].id])
    const successMessage = {
      message: features[0].geometry.type + "dengan id " +  features[0].id + " berhasil di update"
    }
    return res.status(status.created).send(successMessage)
  } catch (err) {
    const errorMessage = {
      error: 'Server Bermasalah'
    }
    return res.status(status.notfound).send(errorMessage)
  }
}

async function getFeatures(req, res) {
  const {type} = req.query

  let usedQuery = ""

  if (type == "polygon") {
    usedQuery = "Select ST_AsGeoJSON(ST_Transform(geom,4326)), id, name, description, area from polygon"
  } else if (type == "line") {
    usedQuery = "Select ST_AsGeoJSON(ST_Transform(geom,4326)), id, name, description, long from linestring"
  } else if (type == "point"){
    usedQuery = "Select ST_AsGeoJSON(ST_Transform(geom,4326)), id, name from point"
  }
  const data = {
    type: "FeatureCollection",
    features: []
  }
  const featureObject = {
    type: "Feature",
    geometry: {
      type: "",
      coordinates: []
    },
    properties: {
      name: "",
      description: "",
    }
  }

  try {
    const { rows } = await dbQuery.query(usedQuery, [])
    rows.forEach(element => {
      const resFeature = Object.assign({}, featureObject)
      resFeature.geometry = JSON.parse(element.st_asgeojson)
      delete element.st_asgeojson
      resFeature.properties = Object.assign({}, element)
      data.features.push(resFeature)
    });
    console.log(data)
    const successMessage = {
      data: data
    }
    return res.status(status.success).send(successMessage)
  } catch (err) {
    const errorMessage = {
      error: 'Server Bermasalah'
    }
    return res.status(status.notfound).send(errorMessage)
  }
}

export {
  createAll,
  updateAll,
  deleteAll,
  getFeatures
}