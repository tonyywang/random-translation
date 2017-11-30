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

//function for randomizing prompt
function question() {
    
    //array of strings for prompt
    var questions = [
        "How are you feeling today?",
        "What did you last eat?",
        "What is your favorite sport?",
        "What colors are your clothing today?",
        "Is the weather good or bad?",
        "Do you have a favorite word?",
        "What are your hobbies?",
        "Where have you traveled to?",
    ];
    
    //randomization function
    var randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    return randomQuestion;
}

$(document).ready(function() {
    
    //add random prompt
    $('.question').append('<p>' + question() + '</p>');
    
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