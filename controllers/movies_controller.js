var movies = require('../models/movies');

var sortNameAsc = function(a, b) {
    if (a.name > b.name) {
        return 1;
    }
    if (a.name < b.name) {
        return -1;
    }

    return 0;
};

module.exports = {
    index: function(req, res, next) {
        var result = movies;

        var stars = parseInt(req.query.stars);
        if (stars) {
            result = result.filter(function(movie) {
                return movie.stars === stars;
            });
        }

        var order = req.query.order;
        if (order === 'asc') {
            result = result.sort(sortNameAsc);
        } else if (order === 'dsc') {
            result = result.sort(sortNameAsc).reverse();
        }

        res.status(200).json(result);
    },

    show: function(req, res, next) {
        var id = req.params.id;
        res.status(200).json(movies[id]);
    },

    create: function(req, res, next) {
        movies.push(req.body);
        res.status(200).json(movies);
    },

    update: function(req, res, next) {
        var index = req.params.id;
        movies[index] = req.body;
        res.status(200).json(movies[index]);
    },

    destroy: function(req, res, next) {
        var index = req.params.id;
        movies.splice(index, 1);
        res.sendStatus(204);
    }
};
