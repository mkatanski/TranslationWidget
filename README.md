#Translation Fields - jQuery form widget

##Documentation

Let me introduce you a widget which you can use to enable sending variables in different languages.  

### Preparing your HTML

* You can use this widget in every `<form>` tag in your HTML document.
* To do it, you need to write this block of code inside your `<form>`:

```html
    <form action="#" class="form-horizontal">
        <div class="control-group">
            <label class="control-label">Word-to-translate</label>
            <div class="controls">
                <input type="text" name="word-to-translate" class="m-wrap lang-translation" disabled />
            </div>
        </div>
    </form>
```

All this classes are compatibile with Twitter Bootstrap.
Rest of code is dynamicly generated by JQuery script.

* To make widget work you need to add CSS styles and JS script to HTML document:

```html
    <link rel="Stylesheet" type="text/css" href="css/form-widget.css" />
    <script type="text/javascript" src="js/form-widget.js"></script>
```

* General JQuery script is also needed:

```html
    <script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
    <script src="http://code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
```

* By default we are using basic Twitter Bootstrap CSS and JS, but also you can style it by yourself.  
You can download it from here http://getbootstrap.com/2.3.2/getting-started.html#contents and move unpacked directory to your widget folder and than add lines:

```html
    <link href="bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">
    <script src="bootstrap/js/bootstrap.min.js"></script>
```

* `<label>` and `<input name="">` should contain the same word which will be word that you want to translate on languages.  
Add as many `<div class="control-group">` with content as many words you want to be translated.

### JS configuration

* First check out list of languages which is placed in JS file (that is js/form-widget.js):

It is TEMPORARY way to modify languages list. In the future it will change.

* There is no need to modify anything else in .html and .js files.

### Usage

* To add new translation click at icon on the left side.
* Select language you want and write this word in this language.
* By clicking "Apply" small box with abbreviation appears.
* You can update this word immidietly or remove this translation by clicking "x" on the right side of language box.
* Add more translations to this word.
* After submit, variables to send look like: word-to-translate[XX]=translation where XX is language abbreviation for example: cat[PL]=kot
* Do with this variables what you want 

## License

<a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-sa/3.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Translation Fields</span> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/">Creative Commons Attribution-ShareAlike 3.0 Unported License</a> and also under the
[MIT License](LICENSE.txt).

## Contact/Help

dduda@nexway.com <br>
mmaron@nexway.com <br>
alas@gmail.com <br>
kgorecki@nexway.com
