const request = require('request-promise');
const { execSync } = require('child_process');
const fs = require('fs');

const mkdirp = require('mkdirp-promise');
const sharp = require('sharp');

const IMAGE_SIZE = 400;
const ATTEMPTS = 10;
const ROUND_RATIO = 100000;

const GENERATE_TEST = true;

const randomCoordsInSquare = ({lat1, lng1, lat2, lng2}) => {
  const minLat = Math.min(lat1, lat2);
  const maxLat = Math.max(lat1, lat2);
  const minLng = Math.min(lng1, lng2);
  const maxLng = Math.max(lng1, lng2);

  const lat = minLat + Math.random() * (maxLat - minLat);
  const lng = minLng + Math.random() * (maxLng - minLng);

  return { lat: Math.round(lat * ROUND_RATIO) / ROUND_RATIO, lng: Math.round(lng * ROUND_RATIO) / ROUND_RATIO };
};

const findPictureForSquare = async (square, country) => {
  const makeUri = (lat, lng) => {
    return [
      'https://maps.googleapis.com/maps/api/js/GeoPhotoService.SingleImageSearch',
        `?pb=!1m5!1sapiv3!5sUS!11m2!1m1!1b0!2m4!1m2!3d${lat}!4d${lng}!2d100!3m18!2m2!1sru!2sRU!`,
        '9m1!1e2!11m12!1m3!1e2!2b1!3e2!1m3!1e3!2b1!3e2!1m3!1e10!2b1!3e2!4m6!1e1!1e2!1e3!1e4!1e8!1e6',
        '&callback=respond'
      ].join('');
  };


  let downloaded = false, attemptsRemaining = ATTEMPTS, city, panoId;

  while(!downloaded && attemptsRemaining > 0) {
    const coords = randomCoordsInSquare(square);
    const uri = makeUri(coords.lat, coords.lng);
    const result = await request.get(uri);

    const respond = async (results) => {
      if (results.length === 1 || !Array.isArray(results[1][3][2])) {
        console.error('Attempt #' + (ATTEMPTS - attemptsRemaining + 1)
          + ' failed! ' + JSON.stringify(coords));
        downloaded = false;
        attemptsRemaining--;
        await execSync('sleep 0.05');
      } else {
        console.log('Success!');
        city = results[1][3][2][0][0];
        panoId = results[1][1][1];
        downloaded = true;
      }
    };

    eval(result);
  }

  if (!downloaded) {
    console.error('Failed!');
    return;
  }

  const rawDir = `${__dirname}/raw/${panoId}`;
  await mkdirp(rawDir);
  execSync(`google_streetview --pano=${panoId} -size=${IMAGE_SIZE}x${IMAGE_SIZE} --save_downloads=${rawDir}`);

  const newPath = `${__dirname}/` + GENERATE_TEST ? 'images_test' : 'images_train';
  await mkdirp(newPath);

  sharp(`${rawDir}/gsv_0.jpg`)
    .resize({ height: Math.round(IMAGE_SIZE * 0.75), width: IMAGE_SIZE })
    .grayscale()
    .toFile(`${newPath}/${panoId}.jpg`);

  const line = [panoId, country].join(',');
  fs.appendFileSync(GENERATE_TEST ? 'dataset_test.csv' : 'dataset_train.csv', line + "\n");
  console.log(line);
};

const places = {
  moscow: {
    count: 10,
    coords: {lat1: 55.894966, lng1: 37.382917, lat2: 55.610124, lng2: 37.819175},
    country: 'ru',
  },
  spb: {
    count: 5,
    coords: {lat1: 60.039628, lng1: 30.145742, lat2: 59.881093, lng2: 30.537374},
    country: 'ru',
  },
  ekb: {
    count: 3,
    coords: {lat1: 56.862860, lng1: 60.538415, lat2: 56.822548, lng2: 60.688518},
    country: 'ru',
  },
  nino: {
    count: 3,
    coords: {lat1: 56.333229, lng1: 43.898472, lat2: 56.277297, lng2: 44.087820},
    country: 'ru',
  },
  kazan: {
    count: 3,
    coords: {lat1: 55.880916, lng1: 49.043136, lat2: 55.744434, lng2: 49.238918},
    country: 'ru',
  },
  krasnodar: {
    count: 3,
    coords: {lat1: 45.067626, lng1: 38.936263, lat2: 45.014970, lng2: 39.047241},
    country: 'ru',
  },

  london: {
    count: 10,
    coords: {lat1: 51.548547, lng1: -0.207508, lat2: 51.439893, lng2: 0.029800},
    country: 'uk'
  },
  birmingham: {
    count: 5,
    coords: {lat1: 52.538597, lng1: -1.991987, lat2: 52.424620, lng2: -1.782344},
    country: 'uk',
  },
  liverpool: {
    count: 3,
    coords: {lat1: 53.449859, lng1: -2.999910, lat2: 53.359085, lng2: -2.822562},
    country: 'uk',
  },
  manchester: {
    count: 3,
    coords: {lat1: 53.499370, lng1: -2.287626, lat2: 53.455022, lng2: -2.191537},
    country: 'uk',
  },
  southampton: {
    count: 3,
    coords: {lat1: 50.953016, lng1: -1.479036, lat2: 50.898672, lng2: -1.317257},
    country: 'uk',
  },
  bristol: {
    count: 3,
    coords: {lat1: 51.469197, lng1: -2.620845, lat2: 51.448589, lng2: -2.554304},
    country: 'uk',
  },
};

(async () => {
  Object.entries(places)
    .forEach(async ([placeName, placeData]) => {
      console.log('Handling: ' + placeName);
      for (let i = 0; i < placeData.count; i++) {
        await findPictureForSquare(placeData.coords, placeData.country);
      }
  });
})();


