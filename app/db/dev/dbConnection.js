
//db/dev/dbConnection.js

import pool from './pool';

pool.connect(() => {
  console.log('connected to the db');
});   

const createPolygonTable = () => {
  const polygonCreateQuery = `CREATE TABLE IF NOT EXISTS polygon
    (id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    geom GEOMETRY(POLYGON, 4326),
    area integer,
    description VARCHAR(255))`;

  pool.query(polygonCreateQuery)
    .then((res) => {
      console.log("polygon", res);
      pool.end()
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    })
}

const createLineTable = () => {
  const lineCreateQuery = `CREATE TABLE IF NOT EXISTS linestring
    (id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    geom GEOMETRY(LINESTRING, 4326),
    long integer,
    description VARCHAR(255))`;

  pool.query(lineCreateQuery)
    .then((res) => {
      console.log("line", res);
      pool.end()
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    })
}

const createPointTable = () => {
  const pointCreateQuery = `CREATE TABLE IF NOT EXISTS point
    (id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    geom GEOMETRY(POINT, 4326))`;

  pool.query(pointCreateQuery)
    .then((res) => {
      console.log("point", res);
      pool.end()
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    })
}

const createAllTables = () => {
  createLineTable();
  createPointTable();
  createPolygonTable();
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

export {
  createAllTables
}

require('make-runnable');
