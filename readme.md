# Krusty Template

Use BrowserSync to serve static html, and use twig to generate html, postCSS as CSS compiler.

## Installation
### Clone the project
Clone the project
Go to project folder
Copy `.env.json.example` , and edit your desired port in it.

### Install
install node modules
```
npm install
```

install plugins
```
bower install
```

run gulp
```
gulp
```

### Access
Once you set on the `.env.json` file, where you changed your port or leave it as is for default, you can access your site on:
```
http://localhost:3070/
```

## Template

### PostCSS
- SCSS
- [Lost](https://github.com/peterramsing/lost) - Grid system

### Twig
- [Twig](http://twig.sensiolabs.org/) - Template Engine

### Icon Font
place your `*.svg` files on `src/fonts/icons` while gulp is running, or re-run it with `gulp build`, you can view the sample page on `public/fonts/template/icon-sample.html`.

## Gulp
### Options
- `gulp` to watch all your files
- `gulp build` when you first clone project, rebuild the project, or when you add some plugins and svg icons.

## Bower
Consists of following plugins
- [jQuery](https://jquery.com/) - Javascript Library
- [Slick](http://kenwheeler.github.io/slick/) - Carousel

### Troubleshoot
##### Lodash related?
follow this [link](https://www.npmjs.com/package/lodash) and install lodash

##### Browsersync related?
install browsersync with
```
npm install -g browser-sync
```