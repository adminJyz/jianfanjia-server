'use strict'

/**
  Release build as command  gulp release (-a|-b|-c)
*/

var gulp = require('gulp');
var minimist = require('minimist')
var runSequence = require('run-sequence');
var bump = require('gulp-bump');
var gutil = require('gulp-util');
var git = require('gulp-git');
var fs = require('fs');
var concat = require('gulp-concat');


// -------------------------------- Common Function ----------------------------------------
function getPackageJsonVersion() {
  // 这里我们直接解析 json 文件而不是使用 require，这是因为 require 会缓存多次调用，这会导致版本号不会被更新掉
  return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
};

function getMajor_Minor(version) {
  let arr = version.split('.');
  arr.pop();
  return arr.join('_');
}
// -------------------------------- End Common Function ----------------------------------------

gulp.task('default', function () {
  console.log('please use command "gulp release (-a|-b|-c)" or "gulp deploy (-pro|-test|-dev)"');
});

gulp.task('code', function () {
  return gulp.src(['api/**/*.js'])
    .pipe(concat('code.txt'))
    .pipe(gulp.dest('./'));
});

// -------------------------------- Release Function ----------------------------------------
gulp.task('bump-version', function () {
  var argv = minimist(process.argv.slice(3));
  var type = {
    type: "patch"
  };
  if (argv.a) {
    type = {
      type: "major"
    };
  } else if (argv.b) {
    type = {
      type: "minor"
    };
  }

  return gulp.src(['./package.json']).pipe(bump(type).on('error', gutil.log)).pipe(gulp.dest('./'));
});

gulp.task('commit-changes', function () {
  return gulp.src('.')
    .pipe(git.commit('[Release] Bumped version number: ' +
      getPackageJsonVersion(), {
        args: '-a'
      }));
});

gulp.task('push-changes', function (cb) {
  git.push('origin', 'phase2', cb);
});

gulp.task('create-new-tag', function (cb) {
  var version = getPackageJsonVersion();
  git.tag('build-' + version, 'Created Tag for version: ' + version,
    function (error) {
      if (error) {
        return cb(error);
      }
      git.push('origin', 'build-' + version, cb);
    });
});

gulp.task('release', function (callback) {
  runSequence(
    'bump-version',
    'commit-changes',
    'push-changes',
    'create-new-tag',
    function (error) {
      if (error) {
        console.log(error.message);
      } else {
        console.log('RELEASE FINISHED SUCCESSFULLY');
      }
      callback(error);
    });
});
// -------------------------------- End Release Function ----------------------------------------

// -------------------------------- Deploy Function ----------------------------------------
gulp.task('deploy', function (callback) {

});

gulp.task('cp-config', function () {
  const argv = minimist(process.argv.slice(3));
  var path = './apiconfig.dev.js';
  if (argv.test) {
    path = './apiconfig.test.js';
  } else if (argv.pro) {
    path = './apiconfig.pro.js';
  }

  gulp.src(path).pipe(gulp.dest('./apiconfig.js'));
});

gulp.task('upgrade', function () {
  require('./upgrade_script/2_6_to_2_7/update_designers.js')
});
// -------------------------------- End Deploy Function ----------------------------------------
