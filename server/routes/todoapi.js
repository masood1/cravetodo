var express = require("express");
var router = express.Router();
var ToDo = require("../models/todo");
var passport = require("passport");
require("../config/passport")(passport);

/*Get To-Do List*/
router.get("/", passport.authenticate("jwt", { session: false }), function(
  req,
  res
) {
  var token = getToken(req.headers);
  if (token) {
    ToDo.find(function(err, todos) {
      if (err) {
        res.status(400);
        return res.json({ error: err });
      }
      res.json({ todos });
    });
  } else {
    return res.status(403).send({ success: false, msg: "Unauthorized." });
  }
});

/*Add To-Do List*/
router.post("/", passport.authenticate("jwt", { session: false }), function(
  req,
  res
) {
  console.log("Post call check ", req);
  var token = getToken(req.headers);
  if (token) {
    if (!req.body.name || !req.body.todos) {
      res.status(400);
      res.json({ error: "Bad Request" });
    } else {
      var todoObj = new ToDo({ name: req.body.name, entries: req.body.todos });
      todoObj.save(function(err) {
        if (err) {
          res.status(400);
          return res.json({ error: err });
        }
        res.json({ message: "New todo created.", todo: todoObj });
      });
    }
  } else {
    return res.status(403).send({ success: false, msg: "Unauthorized." });
  }
});

/*Update To-Do List*/
router.put("/:id", passport.authenticate("jwt", { session: false }), function(
  req,
  res
) {
  var token = getToken(req.headers);
  if (token) {
    if (!req.body.name || !req.params.id) {
      res.status(400);
      res.json({ error: "Bad Request" });
    } else {
      ToDo.findByIdAndUpdate(req.params.id, { name: req.body.name }, function(
        err
      ) {
        if (err) {
          res.status(400);
          return res.json({ error: err });
        }
        res.json({ message: "ToDo Updated" });
      });
    }
  } else {
    return res.status(403).send({ success: false, msg: "Unauthorized." });
  }
});

/*Get To-Do List for ID*/
router.get("/:id", passport.authenticate("jwt", { session: false }), function(
  req,
  res
) {
  console.log(req.params.id);
  var token = getToken(req.headers);
  if (token) {
    ToDo.findById(req.params.id, function(err, todo) {
      if (err) {
        res.status(400);
        return res.json({ error: err });
      }
      if (todo) {
        res.json(todo);
      } else {
        res.status(400);
        res.json({ message: "No ToDo found, check your Id" });
      }
    });
  } else {
    return res.status(403).send({ success: false, msg: "Unauthorized." });
  }
});

/*Delete To-Do List*/
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      ToDo.deleteOne({ _id: req.params.id }, function(err) {
        if (err) {
          res.status(400);
          return res.json({ error: err });
        }
        res.json({ message: "ToDo deleted" });
      });
    } else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

/*Add a To-Do to List*/
router.post(
  "/:id/entry",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      if (!req.body || !req.params.id) {
        res.status(400);
        res.json({ error: "Bad Request" });
      } else {
        ToDo.findById(req.params.id, function(err, todo) {
          if (err) {
            res.status(400);
            return res.json({ error: err });
          } else {
            Array.prototype.push.apply(todo.entries, req.body);
            todo.save(function(err1) {
              if (err1) {
                res.status(400);
                return res.json({ error: err1 });
              }
              res.json({ message: "ToDo Added" });
            });
          }
        });
      }
    } else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

/*Add a To-Do to List*/
router.put(
  "/:id/entry",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      if (!req.body || !req.params.id) {
        res.status(400);
        res.json({ error: "Bad Request" });
      } else {
        ToDo.findById(req.params.id, function(err, todo) {
          if (err) {
            res.status(400);
            return res.json({ error: err });
          } else {
            todo.entries = req.body;
            todo.save(function(err1) {
              if (err1) {
                res.status(400);
                return res.json({ error: err1 });
              }
              res.json({ message: "ToDo Updated" });
            });
          }
        });
      }
    } else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

/*Delete To-Do from List*/
router.delete(
  "/:id/entry/:todoid",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      ToDo.findByIdAndUpdate(
        { _id: req.params.id },
        { $pull: { entries: { _id: req.params.todoid } } },
        function(err, todo) {
          if (err) {
            res.status(400);
            return res.json({ error: err });
          }
          if (!todo) {
            res.status(400);
            return res.json({ error: "To-Do list not available" });
          }
          res.json({ message: "ToDo deleted", todo: todo });
        }
      );
    } else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

/*Update To-Do from a list */
router.put(
  "/:id/entry/:todoid",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      if (!req.body.completed) {
        res.status(400);
        return res.json({ error: "Bad request" });
      }
      ToDo.findById(req.params.id, function(err, todo) {
        if (err) {
          res.status(400);
          return res.json({ error: err });
        } else {
          todo.entries.id(req.params.todoid)["completed"] =
            req.body.completed.toLowerCase() === "true";
          todo.save(function(err) {
            if (err) {
              res.status(400);
              return res.json({ error: err });
            }
            res.json({ message: "To-Do status updated.", todo: todo });
          });
        }
      });
    } else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

getToken = function(headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(" ");
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
module.exports = router;
