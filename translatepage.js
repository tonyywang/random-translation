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
    Frisian: "fy",
    Galician: "gl",
    Georgian: "ka",
    German: "de",
    Greek: "el",
    Gujarati: "gu",
    Haitian_Creole: "ht",
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
    Kurdish: "ku",
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
    Scotsgaelic: "gd",
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

//function for random target language to translate into
function randomLang() {

    //extract language names from languageCode object and create an array
    var keys = Object.keys(languageCode);
    //run randomization function on keys array to choose a random language name
    var randomLang = keys[Math.floor(Math.random() * keys.length)];
    //pick out the language code from the original object using random language name
    var randomLangCode = languageCode[randomLang];

    //save name of the target language
    localStorage.setItem('targetlanguage',randomLang);
    return randomLangCode;
};

var API = "AIzaSyDuVl16HHJwyCAmjVY0j79oVmgu03nhFu4";

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
            url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + randomLangSaved + " language" + "&callback=?",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            type: 'POST',
            headers: { 'Api-User-Agent': 'CMU-PUI/1.0'},
            
        })
        //when complete, format Wikipedia response data
        .done(function(response){
            
            //brought to you by Wikipedia
            $('.wikipedia').append('<p class="wiki"> From Wikipedia: </p>');
            
            //parse and add div
            var content = response.parse.text["*"];
            var blurb = $('<div></div>').html(content);
 
            //remove links as they will not work
            blurb.find('a').each(function() { 
                $(this).replaceWith($(this).html()); 
            });
 
            //remove any references
            blurb.find('sup').remove();
 
            //remove cite error
            blurb.find('.mw-ext-cite-error').remove();
            $('.wikipedia').html($(blurb).find('p'));

        })
        //error just in case there is an issue
        .fail(function() {
            console.log("error");
        });
    }
      
    //On click random button button
    $('#random-button').click(function() {
        
        //save input into form
        localStorage.setItem('originalText',JSON.stringify($('#language-input').val()));
        
        $.ajax({
            //always POST for translation since sending data
            method: "POST", 
            url: "https://translation.googleapis.com/language/translate/v2?key=" + API,
            data: {
                q: $('#language-input').val(),
                target: randomLang
            },
        })
        //when complete, save translated text to local storage
        .done(function(response){
            
            console.log(response.data.translations[0]);
            localStorage.setItem('translations',JSON.stringify(response.data.translations[0]));
            var test = localStorage.getItem('translations');
            console.log(test); 
            
        })
        //error handling
        .fail(function() {
            console.log("error");
        });
    });
});