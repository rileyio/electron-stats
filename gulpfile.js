var gulp = require('gulp')
var ts = require('gulp-typescript')

// Typescript Config
var tsProject = ts.createProject('tsconfig.json')

// Compile typescript
gulp.task('typescript', function () {
  console.log('gulp -> typescript')

  var tsResult = tsProject
    .src()
    .pipe(tsProject())

  return tsResult
    .js
    .pipe(gulp.dest('app'))
})

gulp.task('watch', () => {
  gulp.watch('./src/**/*.ts', ['typescript'])
})

gulp.task('dev', [
  'watch',
])

gulp.task('build', [
  'dist'
])
