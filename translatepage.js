//Dictionary of languages for matching codes in Google Translate API
//This file is long due to a randomization function that 
//picks from all of Google Translate's available.
var languageCode = {
    Afrikaans: "af",
    Albanian: "sq",
    Amharic: "am",
    Arabic:	"ar",
    Armenian: "hy",
    Azeerbaijani: "az",
    Basque: "eu",
    Belarusian: "be",
    Bengali: "bn",
    Bosnian: "bs",
    Bulgarian: "bg",
    Catalan: "ca",
    Cebuano: "ceb",
    Chinese: "zh-CN",
    Chinese: "zh-TW",
    Corsican: "co",
    Croatian: "hr",
    Czech: "cs",
    Danish: "da",
    Dutch: "nl",
    English: "en",
    Esperanto: "eo",
    Estonian: "et",
    Finnish: "fi",
    French: "fr",
    "West Frisian": "fy",
    Galician: "gl",
    Georgian: "ka",
    German: "de",
    Greek: "el",
    Gujarati: "gu",
    "Haitian Creole": "ht",
    Hausa: "ha",
    Hawaiian: "haw",
    Hebrew: "iw",
    Hindi: "hi",
    Hmong: "hmn",
    Hungarian: "hu",
    Icelandic: "is",
    Igbo: "ig",
    Indonesian: "id",
    Irish: "ga",
    Italian: "it",
    Japanese: "ja",
    Javanese: "jw",
    Kannada: "kn",
    Kazakh: "kk",
    Khmer: "km",
    Korean: "ko",
    Kyrgyz: "ky",
    Lao: "lo",
    Latin: "la",
    Latvian: "lv",
    Lithuanian: "lt",
    Luxembourgish: "lb",
    Macedonian: "mk",
    Malagasy: "mg",
    Malay: "ms",
    Malayalam: "ml",
    Maltese: "mt",
    Maori: "mi",
    Marathi: "mr",
    Mongolian: "mn",
    Burmese: "my",
    Nepali: "ne",
    Norwegian: "no",
    Chichewa: "ny",
    Pashto: "ps",
    Persian: "fa",
    Polish: "pl",
    Portuguese: "pt",
    Punjabi: "pa",
    Romanian: "ro",
    Russian: "ru",
    Samoan: "sm",
    "Scottish Gaelic": "gd",
    Serbian: "sr",
    Sesotho: "st",
    Shona: "sn",
    Sindhi: "sd",
    Sinhalese: "si",
    Slovak: "sk",
    Slovenian: "sl",
    Somali: "so",
    Spanish: "es",
    Sundanese: "su",
    Swahili: "sw",
    Swedish: "sv",
    Tagalog: "tl",
    Tajik: "tg",
    Tamil: "ta",
    Telugu: "te",
    Thai: "th",
    Turkish: "tr",
    Ukrainian: "uk",
    Urdu: "ur",
    Uzbek: "uz",
    Vietnamese: "vi",
    Welsh: "cy",
    Xhosa: "xh",
    Yiddish: "yi",
    Yoruba: "yo",
    Zulu: "zu",
};

//this key will only be available for the duration of this assignment
var API = null;

//function for random target language to translate into
function randomLang() {

    //extract language names from languageCode object and create an array
    var keys = Object.keys(languageCode);
    //run randomization function on keys array to choose a random language name
    var randomLangName = keys[Math.floor(Math.random() * keys.length)];
    //pick out the language code from the original object using random language name
    var randomLangCode = languageCode[randomLangName];

    //save name of the target language
    localStorage.setItem('targetlanguage',randomLangName);
    return randomLangCode;
};

function checkKey() {
    
    var insertKey = prompt("Please enter API key:");

    if ( insertKey == null || insertKey == "" ) {
        alert("Please enter API key again to proceed.");
    } else {
        var API = insertKey;
        return API;
    }
}

$(document).ready(function() {
    
    //get original sentence and translation from local storage
    var translation = JSON.parse(localStorage.getItem('translations')); 
    var originalText = JSON.parse(localStorage.getItem('originalText'));
    var randomLangSaved = localStorage.getItem('targetlanguage');
    console.log(translation);
    
    //check for translation
    if ( translation === null ) {
        //if does not exist, empty
        $('#language-input').val("");
        $('#translated-text').val("");
    } else {
        //set input field to show original text
        $('#language-input').val(originalText);
        //show translated text
        $('.translated').append('<p class="translated-text">' + translation.translatedText + '</p>');
        //show target language
        $('.translated-language').append('<p class="translated-text">' + randomLangSaved + '</p>');
        
        //AJAX call to Wikipedia to pull up article based on translated text
        $.ajax({
            
            //only use GET since data is not sent to server
            type: "GET",
            url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&page=" + randomLangSaved + "%20language&redirects=1&prop=text&section=0&disabletoc=1&noimages=1&utf8=1&callback=?",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            headers: { 'Api-User-Agent': 'CMU-PUI/1.0'}
            
        })
        //when complete, format Wikipedia response data
        .done(function(response){
            
            //parse and add div
            var content = response.parse.text["*"];
            //create variable with content added in
            var paragraphs = $('<div></div>').html(content);
 
            paragraphs.find('a').remove(":contains('pronunciation')");
            paragraphs.find('a').remove(":contains(', ')");
            //remove links
            paragraphs.find('a').each(function() { 
                $(this).replaceWith($(this).html());
            });
            //remove references
            paragraphs.find('sup').remove();
            //remove tables
            paragraphs.find('table').remove();
            //remove redirected text
            paragraphs.find('.redirectMsg').remove();
            //remove cite error
            paragraphs.find('.mw-ext-cite-error').remove();
            //remove images
            paragraphs.find('img').remove();
            //remove small words
            paragraphs.find('small').remove();
            //remove internal wikimedia queries like sound files
            paragraphs.find('.internal').remove();

            //finally, add formatted variable data to our web page
            $('.wikipedia').html($(paragraphs).find('p'));

        })
        //error just in case there is an issue
        .fail(function() {
            console.log("error");
        });
    }
      
    //On click random button button
    $('#random-button').click(function() {
        
        var input = $('#language-input').val();
        //save input into form
        localStorage.setItem('originalText',JSON.stringify(input));
        
        if ( input === null || input === "" ) {
            alert("Please enter text.");
        } else {
            $.ajax({

                //always POST for translation since sending data
                method: "POST", 
                url: "https://translation.googleapis.com/language/translate/v2?key=" +         checkKey(),
                data: {
                    q: $('#language-input').val(),
                    target: randomLang()
                }
                
            })
            //when complete, save translated text to local storage
            .done(function(response){

                //save translation to local storage
                localStorage.setItem('translations',JSON.stringify(response.data.translations[0]));

                //use javascript to redirect page
                window.location = "translatepage.html";

            })
            //error handling
            .fail(function() {
                console.log("error");
            });    
        }
    });
});