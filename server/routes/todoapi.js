var express = require('express');
var router = express.Router();
var ToDo = require('../models/todo')

/*Get To-Do List*/
router.get('/', function (req, res) {
  ToDo.find(function (err, todos) {
    if (err) {
      res.status(400)
      return res.json({error: err });
    }
    res.json({ todos });
  })
});

/*Add To-Do List*/
router.post('/', function (req, res) {
  if (!req.body.name || !req.body.todos) {
    res.status(400);
    res.json({ error: "Bad Request" });
  } else {
    var todoObj = new ToDo({name: req.body.name,entries:req.body.todos});
    todoObj.save(function (err) {
      if (err) {
        res.status(400)
        return res.json({error: err });

      }
      res.json({ message: "New todo created.", todo: todoObj });
    });
  }
});

/*Update To-Do List*/
router.put('/:id', function (req, res) {
  if (!req.body.name || !req.params.id) {
    res.status(400);
    res.json({ error: "Bad Request" });
  } else {
    ToDo.findByIdAndUpdate(req.params.id, { name: req.body.name }, function (err) {
      if (err) {
        res.status(400);
        return res.json({  error: err });
      }
      res.json({ message: "ToDo Updated" });

    })

  }
});

/*Get To-Do List for ID*/
router.get('/:id', function (req, res) {
  console.log(req.params.id)
  ToDo.findById(req.params.id, function (err, todo) {
    if (err) {
      res.status(400)
      return res.json({ error: err });
    }
    if (todo) {
      res.json(todo);
    }
    else {
      res.status(400);
      res.json({ message: "No ToDo found, check your Id" });
    }
  });
});


/*Delete To-Do List*/
router.delete('/:id', function (req, res) {
  ToDo.deleteOne({ _id: req.params.id }, function (err) {
    if (err) {
      res.status(400)
      return res.json({  error: err });
    }
    res.json({ message: "ToDo deleted" })
  });
});


/*Add a To-Do to List*/
router.post('/:id/entry', function (req, res) {
  if (!req.body || !req.params.id) {
    res.status(400);
    res.json({ error: "Bad Request" });
  } else {
    ToDo.findById(req.params.id, function (err,todo) {
      if (err) {
        res.status(400);
        return res.json({  error: err });
      }
      else{
        Array.prototype.push.apply(todo.entries, req.body)
        todo.save(function (err1) {
          if(err1){
            res.status(400);
            return res.json({  error: err1 });
          }
          res.json({ message: "ToDo Added" });
        })

      }
    });
  }
});

/*Add a To-Do to List*/
router.put('/:id/entry', function (req, res) {
  if (!req.body || !req.params.id) {
    res.status(400);
    res.json({ error: "Bad Request" });
  } else {
    ToDo.findById(req.params.id, function (err,todo) {
      if (err) {
        res.status(400);
        return res.json({  error: err });
      }
      else{
        todo.entries = req.body
        todo.save(function (err1) {
          if(err1){
            res.status(400);
            return res.json({  error: err1 });
          }
          res.json({ message: "ToDo Updated" });
        })

      }
    });
  }
});


/*Delete To-Do from List*/
router.delete('/:id/entry/:todoid', function (req, res) {

  ToDo.findByIdAndUpdate({ _id: req.params.id },{ $pull: {entries: { _id: req.params.todoid } } } ,function (err,todo) {
    if (err) {
      res.status(400)
      return res.json({  error: err });
    }
    if(!todo){
      res.status(400)
      return res.json({  error: "To-Do list not available" });
    }
    res.json({ message: "ToDo deleted",todo:todo})
  });
});

/*Update To-Do from a list */
router.put('/:id/entry/:todoid', function (req, res) {
  if(!req.body.completed){
    res.status(400)
      return res.json({  error: "Bad request" });
  }
  ToDo.findById(req.params.id, function (err,todo) {
    if (err) {
      res.status(400);
      return res.json({  error: err });
    }
    else{
      todo.entries.id(req.params.todoid)["completed"] = (req.body.completed.toLowerCase() === 'true')
      todo.save(function (err) {
        if (err) {
          res.status(400)
          return res.json({error: err });
  
        }
        res.json({ message: "To-Do status updated.", todo: todo });
      });
    }
  });

});


module.exports = router;
