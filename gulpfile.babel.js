'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';
import uglify from 'gulp-uglify';
import cleanCSS from 'gulp-clean-css';
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';
import del from 'del';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';

const DIR = {
  SRC: 'public',
  DEST: 'dist'
};

const SRC = {
  JS: DIR.SRC + '/javascripts/**/*.js',
  VENDOR: DIR.SRC + '/vendor/**/*.*',
  TINYMCE: DIR.SRC + '/vendor/plugins/tinymce/**/*.*',
  UPLOADS: DIR.SRC + '/uploads/**/*.*',
  CSS: DIR.SRC + '/stylesheets/*.css',
  HTML: DIR.SRC + '/*.html',
  IMAGES: DIR.SRC + '/images/**/*.*'
};

const DEST = {
  JS: DIR.DEST + '/javascripts',
  VENDOR: DIR.DEST + '/vendor',
  TINYMCE: DIR.DEST + '/vendor/tinymce',
  UPLOADS: DIR.DEST + '/uploads',
  CSS: DIR.DEST + '/stylesheets',
  CSS_IMAGES: DIR.DEST + '/stylesheets/images',
  HTML: DIR.DEST + '/',
  IMAGES: DIR.DEST + '/images',
  FONTS: DIR.DEST + '/fonts'
};

gulp.task('js', () => {
  return gulp.src(SRC.JS, { base: './public/javascripts' })
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(uglify({ output: { max_line_len: 0 } }))
      .pipe(sourcemaps.write('../maps'))
      .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
      .pipe(gulp.dest(DEST.JS));
});

// SRC.VENDOR, { base: './public/vendor' }
gulp.task('vendor', () => {
  return gulp.src([
    DIR.SRC + '/vendor/' + 'plugins/requirejs/require.2.3.2.js',
    DIR.SRC + '/vendor/' + 'plugins/jQuery/jquery-2.2.3.min.js',
    DIR.SRC + '/vendor/' + 'jquery-private.js',
    DIR.SRC + '/vendor/' + 'plugins/jQueryUI/jquery-ui.min.js',
    DIR.SRC + '/vendor/' + 'bootstrap/js/bootstrap.min.js',
    DIR.SRC + '/vendor/' + 'plugins/jszip/dist/jszip.min.js',
    DIR.SRC + '/vendor/' + 'plugins/datatables.net/js/jquery.dataTables.min.js',
    DIR.SRC + '/vendor/' + 'plugins/datatables.net-bs/js/dataTables.bootstrap.min.js',
    DIR.SRC + '/vendor/' + 'plugins/datatables.net-buttons/js/dataTables.buttons.min.js',
    DIR.SRC + '/vendor/' + 'plugins/datatables.net-responsive/js/dataTables.responsive.min.js',
    DIR.SRC + '/vendor/' + 'plugins/datatables.net-responsive-bs/js/responsive.bootstrap.min.js',
    DIR.SRC + '/vendor/' + 'plugins/datatables.net-buttons-bs/js/buttons.bootstrap.min.js',
    DIR.SRC + '/vendor/' + 'plugins/datatables.net-buttons/js/buttons.html5.min.js',
    DIR.SRC + '/vendor/' + 'plugins/datatables.net-buttons/js/buttons.print.min.js',
    DIR.SRC + '/vendor/' + 'plugins/moment/moment.2.11.2.min.js',
    DIR.SRC + '/vendor/' + 'plugins/daterangepicker/daterangepicker.js',
    DIR.SRC + '/vendor/' + 'plugins/datepicker/bootstrap-datepicker.js',
    DIR.SRC + '/vendor/' + 'plugins/select2/select2.full.min.js',
    DIR.SRC + '/vendor/' + 'plugins/fastclick/fastclick.min.js',
    DIR.SRC + '/vendor/' + 'dist/js/app.min.js',
    DIR.SRC + '/vendor/' + 'plugins/jquery_cookie/jquery.cookie.1.4.1.js',
    DIR.SRC + '/vendor/' + 'plugins/jquery_validate/jquery.validate.min.js',
    DIR.SRC + '/vendor/' + 'plugins/slimScroll/jquery.slimscroll.min.js',
    DIR.SRC + '/vendor/' + 'plugins/bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
    DIR.SRC + '/vendor/' + 'plugins/es6-promise/dist/es6-promise.min.js',
    DIR.SRC + '/vendor/' + 'plugins/vimeo-player-js/dist/player.min.js',
    DIR.SRC + '/vendor/' + 'plugins/pace/pace.min.js',
    DIR.SRC + '/vendor/' + 'lodash.min.js',
    DIR.SRC + '/vendor/' + 'handlebars/dist/handlebars.min.js',
    DIR.SRC + '/vendor/' + 'text/text.js',
    DIR.SRC + '/vendor/' + 'dom-checkbox.js',
    DIR.SRC + '/vendor/' + 'plugins/tag-it/tag-it.min.js',
    DIR.SRC + '/vendor/' + 'aquaplayer/js/nplayer.js',
    DIR.SRC + '/vendor/' + 'aquaplayer/js/nplayer_ui.js',
    DIR.SRC + '/vendor/' + 'aquaplayer/js/cdnproxy.js',
    DIR.SRC + '/vendor/' + 'aquaplayer/js/nplayer_conf.js',
    DIR.SRC + '/vendor/' + 'fine-uploader/fine-uploader/fine-uploader.min.js',
    DIR.SRC + '/vendor/' + 'fine-uploader/fine-uploader/fine-uploader.core.min.js',
    DIR.SRC + '/vendor/' + 'jquery-file-uploader/jquery.fileupload.js',
    DIR.SRC + '/vendor/' + 'jquery-file-uploader/jquery.iframe-transport.js',
    DIR.SRC + '/vendor/' + 'jquery-file-uploader/jquery.ui.widget.js'
    // DIR.SRC + '/vendor/' + 'plugins/smoothstate/jquery.smoothstate.min.js'
  ])
  .pipe(uglify())
  .pipe(gulp.dest(DEST.VENDOR));
});

gulp.task('tinymce', () => {
  return gulp.src(SRC.TINYMCE, { base: './public/vendor/plugins/tinymce' })
          .pipe(gulp.dest(DEST.TINYMCE));
});

gulp.task('uploads', () => {
  return gulp.src(SRC.UPLOADS, { base: './public/uploads' })
          .pipe(gulp.dest(DEST.UPLOADS));
});

gulp.task('copy-font', () => {
  return gulp.src([
    DIR.SRC + '/vendor/' + 'font-awesome-4.7.0/fonts/*.*',
    DIR.SRC + '/vendor/' + 'ionicons-2.0.1/fonts/*.*',
    DIR.SRC + '/vendor/' + 'bootstrap/fonts/*.*'
  ])
  .pipe(gulp.dest(DEST.FONTS));
});

gulp.task('copy-css-images', () => {
  return gulp.src([
    DIR.SRC + '/vendor/' + 'plugins/jqueryUI/images/*.*',
    DIR.SRC + '/vendor/' + 'fine-uploader/fine-uploader/*.gif'
  ])
  .pipe(gulp.dest(DEST.CSS_IMAGES));
});

gulp.task('copy-css', () => {
  return gulp.src([
    DIR.SRC + '/vendor/' + 'bootstrap/css/bootstrap.min.css',
    DIR.SRC + '/vendor/' + 'font-awesome-4.7.0/css/font-awesome.min.css',
    DIR.SRC + '/vendor/' + 'ionicons-2.0.1/css/ionicons.min.css',
    DIR.SRC + '/vendor/' + 'dist/css/AdminLTE.css',
    // DIR.SRC + '/vendor/' + 'dist/css/skins/skin-green-light.min.css',
    DIR.SRC + '/vendor/' + 'dist/css/skins/_all-skins.min.css',
    DIR.SRC + '/vendor/' + 'plugins/datepicker/datepicker3.css',
    DIR.SRC + '/vendor/' + 'plugins/daterangepicker/daterangepicker.css',
    DIR.SRC + '/vendor/' + 'plugins/select2/select2.min.css',
    DIR.SRC + '/vendor/' + 'plugins/datatables.net-bs/css/dataTables.bootstrap.min.css',
    DIR.SRC + '/vendor/' + 'plugins/datatables.net-buttons-bs/css/buttons.bootstrap.min.css',
    DIR.SRC + '/vendor/' + 'plugins/datatables.net-responsive-bs/css/responsive.bootstrap.min.css',
    DIR.SRC + '/vendor/' + 'plugins/bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
    DIR.SRC + '/vendor/' + 'plugins/pace/pace.min.css',
    DIR.SRC + '/vendor/' + 'plugins/jQueryUI/jquery-ui.min.css',
    DIR.SRC + '/vendor/' + 'plugins/tag-it/jquery.tagit.min.css',
    DIR.SRC + '/vendor/' + 'aquaplayer/css/nplayer.css',
    DIR.SRC + '/vendor/' + 'aquaplayer/css/nplayer_res.css',
    DIR.SRC + '/vendor/' + 'fine-uploader/fine-uploader/fine-uploader-new.css'
  ])
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(gulp.dest(DIR.DEST + '/stylesheets/'));
});

gulp.task('css', () => {
  return gulp.src(SRC.CSS)
          .pipe(cleanCSS({compatibility: 'ie8'}))
          .pipe(gulp.dest(DEST.CSS));
});

gulp.task('html', () => {
  return gulp.src(SRC.HTML)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(DEST.HTML));
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

  for (let key in watcher) {
    watcher[key].on('change', notify);
  }
});

gulp.task('default', ['clean', 'js', 'vendor', 'tinymce', 'uploads', 'copy-font', 'copy-css-images', 'copy-css', 'css', 'html', 'images', 'watch'], () => {
  gutil.log('Gulp task completed.');
});
