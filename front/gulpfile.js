const gulp = require('gulp');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const cleancss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const stylus = require('gulp-stylus');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const base64 = require('gulp-base64');
const inlinesource = require('gulp-inline-source');
const gutil = require('gulp-util');
const fs = require('fs');
const autoprefixer = require('gulp-autoprefixer');

let pages = [];

let firstUpper = (name) => {
    return name.toUpperCase().slice(0, 1) + name.slice(1);
};

let handleJs = (pageName) => {
    gulp.task('js' + firstUpper(pageName), () => {
        return gulp.src('./tpls/' + pageName + '/js/index.js')
            .pipe(uglify())
            .pipe(gulp.dest('./tpls/' + pageName + '/dist/js/'));
    });
};

let handleImg = (pageName) => {
    gulp.task('img' + firstUpper(pageName), () => {
        return gulp.src('./tpls/' + pageName + '/img/*.png')
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()]
            }))
            .pipe(gulp.dest('./tpls/' + pageName + '/dist/img/'));
    });
};

let handleCss = (pageName) => {
    gulp.task('css' + firstUpper(pageName), ['img' + firstUpper(pageName)], () => {
        return gulp.src('./tpls/' + pageName + '/stylus/index.styl')
            .pipe(stylus())
            .pipe(autoprefixer({
                browsers: [
                    '> 5%',
                    'last 3 versions'
                ],
                remove: false
            }))
            .pipe(base64({
                baseDir: './tpls/' + pageName + '/dist/img',
                maxImageSize: 20 * 1024,
                exclude: [/file\.ihuayue\.cn/]
            }))
            .pipe(cleancss())
            .pipe(gulp.dest('./tpls/' + pageName + '/dist/css'));
    });
};

let handleHtml = (pageName) => {
    gulp.task('html' + firstUpper(pageName), ['img', 'js', 'css'].map((item) => item + firstUpper(pageName)), () => {
        return gulp.src('./tpls/' + pageName + '/html/index.html')
            .pipe(inlinesource({
                compress: true,
                ignore: ['png']
            }))
            /*.pipe(htmlmin({
                minifyCSS: true,
                collapseWhitespace: true,
                removeComments: true
            }))*/
            .pipe(rename(pageName + '.html'))
            .pipe(gulp.dest('../view/app'));
    });
};

let build = (pageName) => {
    pages.push(pageName);

    handleJs(pageName);
    handleImg(pageName);
    handleCss(pageName);
    handleHtml(pageName);

    gulp.task('build' + firstUpper(pageName), ['html' + firstUpper(pageName)]);
};

let initPage = (pageName) => {
    if (!pageName) {
        return;
    }

    let baseDir = './tpls/' + pageName + '/';
    let jsDir = baseDir + 'js/';
    let htmlDir = baseDir + 'html/';
    let imgDir = baseDir + 'img/';
    let stylusDir = baseDir + 'stylus/';

    fs.mkdirSync(baseDir);
    fs.mkdirSync(jsDir);
    fs.writeFileSync(jsDir + 'index.js', "(function () {\n  'use strict';\n})();", 'utf8');
    fs.mkdirSync(htmlDir);
    fs.writeFileSync(htmlDir + 'index.html', '', 'utf8');
    fs.mkdirSync(imgDir);
    fs.mkdirSync(stylusDir);
    fs.writeFileSync(stylusDir + 'index.styl', "@import '../../../cssLibs/reset.styl';\n@import '../../../cssLibs/common.styl';", 'utf8');
};

/******************** 增加新页面 start ************************/

build('roseAct');
build('likeRank');
build('jingyuCourse');
build('perfectData');
build('detailShare');

/******************** 增加新页面 end ************************/

gulp.task('buildAll', pages.map((page) => 'build' + firstUpper(page)));

let args = require('minimist')(process.argv.slice(2));
gulp.task('init', () => {
    if (!args.name) {
        gutil.log('请输入新建的页面名称，例如 gulp init --name test');
    } else {
        initPage(args.name)
    }
});