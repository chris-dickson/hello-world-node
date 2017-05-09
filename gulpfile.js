var gulp = require('gulp');

gulp.task('test',function(done) {
    console.log("Run your tests here, any non-zero exit code causes CirlcleCI to fail");
    process.exit(0);
});