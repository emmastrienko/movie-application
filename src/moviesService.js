const path = require("path");
const fs = require("fs");
const { padEnd } = require("lodash");

const getMovies = (done) => {
  const filePath = path.join(__dirname, "../data/movies.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      done(err, null);
    } else {
      done(null, JSON.parse(data));
    }
  });
};

const getMoviesById = (movieId, done) => {
  const filePath = path.join(__dirname, "../data/movies.json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      done(err, null);
    } else {
      try {
        const parseData = JSON.parse(data).movies;
        const movie = parseData.find(
          (item) => Number(item.id) === Number(movieId)
        );
        if (movie) {
          done(null, JSON.stringify(movie));
        } else {
          done("Could not found the movie by id...", null);
        }
      } catch (parseErr) {
        done(parseErr, null);
      }
    }
  });
};

const saveMovie = function (newMovie, done) {
  const filePath = path.join(__dirname, "../data/movies.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      done(err, null);
      return;
    }
    try {
      const parseData = JSON.parse(data).movies;
      const existMovie = parseData.find(
        (item) => Number(item.id) === Number(newMovie.id)
      );
      if (existMovie) {
        done("Movie already exist", null);
      } else {
        parseData.push(newMovie);
        fs.writeFile(
          filePath,
          JSON.stringify({ movies: parseData }, null, 2),
          (err) => {
            if (err) {
              done(err, null);
            } else {
              done(null, newMovie);
            }
          }
        );
      }
    } catch (err) {
      done(err, null);
    }
  });
};

const updateMovie = function (movieId, updateData, done) {
  const filePath = path.join(__dirname, "../data/movies.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      done(err, null);
      return;
    }
    try {
      const parseData = JSON.parse(data).movies;
      const existingMovieIndex = parseData.findIndex(
        (item) => Number(item.id) === Number(movieId)
      );
      if (existingMovieIndex === -1) {
        done("Movie not found", null);
      } else {
        parseData[existingMovieIndex] = {
          ...parseData[existingMovieIndex],
          ...updateData,
        };

        fs.writeFile(
          filePath,
          JSON.stringify({ movies: parseData }, null, 2),
          (err) => {
            if (err) {
              done(err, null);
            } else {
              done(null, parseData[existingMovieIndex]);
            }
          }
        );
      }
    } catch (err) {
      done(err, null);
    }
  });
};

const deleteMovieById = function (movieId, done) {
  const filePath = path.join(__dirname, "../data/movies.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      done(err, null);
      return;
    }
    try {
      const parseData = JSON.parse(data).movies;
      const index = parseData.findIndex(item => Number(item.id) === Number(movieId));
      if (index === -1) {
        done("Movie not found", null);
      } else {
        const deletedMovie = parseData.splice(index, 1)[0];
        fs.writeFile(
          filePath,
          JSON.stringify({ movies: parseData }, null, 2),
          (err) => {
            if (err) {
              done(err, null);
            } else {
              done(null, deletedMovie);
            }
          }
        );
      }
    } catch (err) {
      done(err, null);
    }
  });
};

module.exports = {
  getMovies,
  getMoviesById,
  saveMovie,
  updateMovie,
  deleteMovieById,
};
