[참고](https://velopert.com/1344)

sudo npm install -g gulp
sudo npm install -g graceful-fs lodash

npm install -save-dev gulp gulp-util
npm install --save-dev babel-core babel-preset-es2015
npm install --save-dev gulp-uglify gulp-clean-css gulp-htmlmin gulp-imagemin del

**.babelrc 생성**
```javascript
{
  "presets": ["es2015"]
}
```

**gulpfile.babel.js 작성**
```javascript
'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';
import uglify from 'gulp-uglify';
import cleanCSS from 'gulp-clean-css';
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';
import del from 'del';

const DIR = {
    SRC: 'public',
    DEST: 'dist'
};

const SRC = {
    JS: DIR.SRC + '/javascripts/*.js',
    CSS: DIR.SRC + '/stylesheets/*.css',
    HTML: DIR.SRC + '/*.html',
    IMAGES: DIR.SRC + '/images/*'
};

const DEST = {
    JS: DIR.DEST + '/javascripts',
    CSS: DIR.DEST + '/stylesheets',
    HTML: DIR.DEST + '/',
    IMAGES: DIR.DEST + '/images'
};

gulp.task('js', () => {
    return gulp.src(SRC.JS)
           .pipe(uglify())
           .pipe(gulp.dest(DEST.JS));
});

gulp.task('css', () => {
    return gulp.src(SRC.CSS)
           .pipe(cleanCSS({compatibility: 'ie8'}))
           .pipe(gulp.dest(DEST.CSS));
});

gulp.task('html', () => {
    return gulp.src(SRC.HTML)
          .pipe(htmlmin({collapseWhitespace: true}))
          .pipe(gulp.dest(DEST.HTML))
});

gulp.task('images', () => {
    return gulp.src(SRC.IMAGES)
           .pipe(imagemin())
           .pipe(gulp.dest(DEST.IMAGES));
});

gulp.task('clean', () => {
    return del.sync([DIR.DEST]);
});

gulp.task('watch', () => {
    let watcher = {
        js: gulp.watch(SRC.JS, ['js']),
        css: gulp.watch(SRC.CSS, ['css']),
        html: gulp.watch(SRC.HTML, ['html']),
        images: gulp.watch(SRC.IMAGES, ['images'])
    };

    let notify = (event) => {
        gutil.log('File', gutil.colors.yellow(event.path), 'was', gutil.colors.magenta(event.type));
    };

    for(let key in watcher) {
        watcher[key].on('change', notify);
    }
});

gulp.task('default', ['clean', 'js', 'css', 'html', 'images', 'watch'], () => {
    gutil.log('Gulp is running');
});
```