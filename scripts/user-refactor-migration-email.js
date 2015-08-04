var _ = require('lodash'),
    mongoose = require('mongoose'),
    chalk = require('chalk'),
    config = require('../config/config'),
    mg = require('../config/lib/mongoose');

mg.loadModels();

// connect to mongoose instance
mg.connect(function (db) {
  var User = mongoose.model('User');
  var Email = mongoose.model('Email');
  
  // retrieve all users
  User.find().exec(function (err, users) {
    if (err) {
      throw err;
    }
    // track processing        
    var processedCount = 0,
        warningCount = 0,
        errorCount = 0;
    
    // report and exit if no users were found
    if (users.length === 0) { reportAndExit(processedCount, warningCount, errorCount) }    ;
    
    // process each user
    for (var i = 0; i < users.length; i++) {
      copyDeprecatedEmail(users[i]);
    }
    
    // update the specified user
    function copyDeprecatedEmail(user) {
      user.updated = Date.now();
      
      // check for existing emails field
      if (!user.emails) {
        user.emails = [];
      }
      
      // build new email object
      var newEmail = new Email({
        address: user.email,
        isPrimary: true // TODO: confirm that we should be setting this email as the Primary. Will depend on other user-refactor changes (Providers)
      });
      
      // check if the email doesn't already exist
      if (user.emails.length && _.some(user.emails, function (email) {
        return email.address === newEmail.address;
      })) {
        processedCount++;
        warningCount++;
        
        // report that this user is getting skipped
        console.log(chalk.green('[' + processedCount + '/' + users.length + ']') + chalk.yellow(' Email ' + newEmail.address + ' already exists. Skipping for ') + chalk.yellow(user.displayName));
        
        // check if we're done
        if (processedCount === users.length) {
          // report results and exit
          reportAndExit(processedCount, warningCount, errorCount);
        }
      } else {
        // add the email to the emails field
        user.emails.push(newEmail);
        // save updated user
        user.save(updateCallback(user));
      }
    }
    
    // callback for user update
    function updateCallback(user) {
      return function (err) {
        processedCount++;
        
        if (err) {
          errorCount++;
          // check if we should output errors here
          if (config.mailer.options.debug) {
            console.log('Error: ', err);
          } // report failed
          console.error('[' + processedCount + '/' + users.length + '] ' + chalk.red('Could not add email to emails for ' + user.displayName));
        } else { // report success
          console.log(chalk.green('[' + processedCount + '/' + users.length + ']') + ' Added email to emails for ' + chalk.yellow(user.displayName));
        }
        
        // check if we're done
        if (processedCount === users.length) {
          // report results and exit
          reportAndExit(processedCount, warningCount, errorCount);
        }
      }
    }
    
    // report the processing results and exit
    function reportAndExit(processedCount, warningCount, errorCount) {
      var successCount = processedCount - errorCount;
      console.log();
      console.log('Processed ' + chalk.green(successCount) + ' of ' + chalk.yellow(processedCount) + ' users successfully. With ' + chalk.yellow(warningCount + ' warnings'));
      process.exit(0);
    }

  });
});
