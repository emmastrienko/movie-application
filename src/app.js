const http = require("http");
const moviesService = require("./moviesService");
const getRequestData = require("./utils");

const PORT = 5000;

const server = http.createServer(async (req, res) => {
  if (req.url === "/movies" && req.method === "GET") {
    moviesService.getMovies((err, movies) => {
      if (err) {
        res.writeHead(500, {
          "content-type": "application/json",
        });
        res.end(JSON.stringify(err));
      } else {
        res.writeHead(200, {
          "content-type": "application/json",
        });
        res.end(JSON.stringify(movies));
      }
    });
  } else if (req.url.match(/\movies\/([0-9]+)/) && req.method === "GET") {
    const id = Number(req.url.split("/")[2]);
    moviesService.getMoviesById(id, (err, movie) => {
      if (err) {
        res.writeHead(404, {
          "content-type": "application/json",
        });
        res.end(JSON.stringify(err));
      } else {
        res.writeHead(200, {
          "content-type": "application/json",
        });
        res.end("respons" + JSON.stringify(movie));
      }
    });
  } else if (req.url === "/movies" && req.method === "POST") {
    const moviesData = await getRequestData(req);

    moviesService.saveMovie(moviesData, (err, newmovie) => {
      if (err) {
        res.writeHead(500, {
          "content-type": "application/json",
        });
        res.end(JSON.stringify(err));
      } else {
        res.writeHead(201, {
          "content-type": "application/json",
        });
        res.end(JSON.stringify(newmovie));
      }
    });
  } else if (req.url.match(/\/movies\/([0-9]+)/) && req.method === "PUT") {
    const id = Number(req.url.split("/")[2]);
    const movieData = await getRequestData(req);

    moviesService.updateMovie(id, movieData, (err, updatedMovie) => {
      if (err) {
        res.writeHead(500, { "content-type": "application/json" });
        res.end(JSON.stringify(err));
      } else {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(updatedMovie));
      }
    });
  } else if (req.url.match(/\/movies\/([0-9]+)/) && req.method === "DELETE") {
    const id = Number(req.url.split("/")[2]);

    moviesService.deleteMovieById(id, (err, deletedMovie) => {
      if (err) {
        res.writeHead(500, { "content-type": "application/json" });
        res.end(JSON.stringify(err));
      } else {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(deletedMovie));
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});
server.on("error", (error) => {
  if (error.code === "EADRINUSE") {
    console.log("Port already in use");
  }
});
