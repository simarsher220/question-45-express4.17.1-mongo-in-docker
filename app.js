var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var random = require('random');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var Lead = require('./db_conn');
var app = express();
var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/db')
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/api/leads/', (req, res) => {
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var email = req.body.email;
  var mobile = req.body.mobile;
  var location_type = req.body.location_type;
  var location_string = req.body.location_string;

  console.log("validate fname");
  var resp = validate_existence(first_name, 'First Name');
  if (resp !== true) {
    return res.status(400).send({
      status: 'failure',
      reason: resp
    });
  }

  console.log("validate lname");
  var resp = validate_existence(last_name, 'Last Name');
  if (resp !== true) {
    return res.status(400).send({
      status: 'failure',
      reason: resp
    });
  }

  console.log("validate email");
  resp = validate_existence(email, 'Email');
  if (resp !== true) {
    return res.status(400).send({
      status: 'failure',
      reason: resp
    });
  }

  console.log("validate mobile");
  resp = validate_length(mobile, 10, 'Phone Number')
  if (resp !== true) {
    return res.status(400).send({
      status: 'failure',
      reason: resp
    });
  }
  
  console.log("validate loc type");
  resp = validate_existence(location_type, 'Location Type');
  if (resp !== true) {
    return res.status(400).send({
      status: 'failure',
      reason: resp
    });
  }

  console.log("validate loc string");
  resp = validate_existence(location_string, 'Location String');
  if (resp !== true) {
    return res.status(400).send({
      status: 'failure',
      reason: resp
    });
  }

  console.log("reached here");
  get_lead_db_from_other_info(email, mobile, function(err, lead) {
    if (err) {
      return res.status(500).json({
        'status': 'failure',
        'reason': 'Error occurred!'
      })
    }
    else {
      console.log(lead);
      if (lead != undefined) {
        return res.status(400).json({
          'status': 'failure',
          'reason': 'lead exists!'
        })
      }
      var lead = new Lead(req.body);
      lead.status = 'Created';
      createLead(lead, function(err, lead) {
        if (err) {
          return res.status(500).json({
            'status': 'failure',
            'reason': 'Error occurred!'
          })
        }
        else {
          lead.id = lead._id;
          res.setHeader('Content-Type', 'application/json');
          return res.status(201).send(lead);
        }
      });
    }
  });
});


app.put('/api/leads/:id', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  return res.status(202).json({
    'status': 'success',
  });
});


app.get('/api/leads/:id', (req, res) => {
  var id = req.params.id;
  findLeadById(id, function(err, lead) {
    if (err) {
      return res.status(404).json({
        'status': 'failure',
        'reason': 'lead with the above details already exists!'
      })
    }
    else {
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).send(lead);
    }
  });
});

app.delete('/api/leads/:id', (req, res) => {
  return res.status(400).json({
    'status': 'failure',
    'reason': 'internal error!'
  });
});


app.put('/api/mark_lead/:id', (req, res) => {
  // var id = req.params.id;
  return res.status(400).json({
    'status': 'failure',
    'reason': 'internal error!'
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

var get_lead_db_from_other_info = function(email, mobile, callback) {
  Lead.findOne({$or:[{email: email}, {mobile: mobile}]}).exec(function (err, lead) {
    if(err) {
      return callback(err, undefined);
    } else {
      return callback(undefined, lead);
    }
  });
}

var createLead = function (lead, callback) {
  lead.save(function(err) {
    if(err) {
      return callback(err, undefined);
    } else {
      console.log("Successfully created an employee with id: " + lead._id);
      return callback(undefined, lead);
    }
  });
}

var findLeadById = function(id, callback) {
  Lead.findOne({_id: id.toString()}).exec(function (err, lead) {
    if(err) {
      return callback(err, undefined);
    } else {
      console.log("Successfully created an employee with id: " + lead._id);
      return callback(undefined, lead);
    }
  });
}

var validate_existence = function(input, field_display_name) {  
  if (!input) {
    console.log(input);
    return field_display_name + ' is required';
  }
  return true;
};

var validate_length = function(input, len, field_display_name) {
  var resp = validate_existence(input, field_display_name);
  if (resp === true) {
    if (input.toString().length != len) {
      return field_display_name + ' must be of ' + len + ' characters!';      
    }
    return true;
  } else {
    return resp;
  }
  
};