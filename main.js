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

//this key will only be available for the duration of this assignment
var API = "AIzaSyDuVl16HHJwyCAmjVY0j79oVmgu03nhFu4";

$(document).ready(function() {
    
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
    
    //On click random button button
    $('#pick-button').click(function() {
        
        //AJAX call to Google Translate API
        $.ajax({
            //always POST for translation since sending data
            method: "POST", 
            url: "https://translation.googleapis.com/language/translate/v2?key=" + API,
            data: {
                q: $('#language-input').val(),
                target: $('#language-dropdown').val()
            },
        })
        //when complete, save translated text to local storage
        .done(function(response){
            
            //translations[0] includes translated text in foreign language
            localStorage.setItem('translations',response.data.translations[0]);
                
        })
        //error
        .fail(function() {
            console.log("error");
        });
    });  
});