$(document).ready(async function() {

    //checking admin user
    if(!Cookies.get('user')) {
        window.location.href = "/";
    }

    let tokenMe = Cookies.get('user');

    let userData = parseJwt(tokenMe);

    let userMe = await axios.get(`${window.development}/api/user/${userData._id}`).then(res => res.data.userInfo);

    if(userMe.email !== "resul.axundov2002@mail.ru") {
        window.location.href = "/";
    }

    //loading modal closing
    setTimeout(function() {
        $(".loading-modal").css("display", "none");
    }, 1000)

    ////////////////////////
    ////CREATE CATEGORY////
    //////////////////////
    let categoryData = {};
    $("#create-category-btn").click(async function() {
        categoryData.nameAz = $("#create-category-name-az").val();
        categoryData.nameEn = $("#create-category-name-en").val();
        categoryData.nameRu = $("#create-category-name-ru").val();
        categoryData.level = $("#create-category-level").val();
        categoryData.xp = $("#create-category-xp").val();
        categoryData.bioAz = $("#create-biografi-az").val();
        categoryData.bioEn = $("#create-biografi-en").val();
        categoryData.bioRu = $("#create-biografi-ru").val();

        let createCategory = await axios
        .post(`${window.development}/api/create-category`, categoryData)
        .then(res => {
            window.location.href = "/"
            return res.data;
        })
    })

    ////CATGORY IMAGE UPLOAD////
    $("#create-category-image").on('change', function() {
        let image = $(this)[0].files[0];

        if(image.size > 10000000) {
            console.log("File is too large");
            $(this).val("");
        } else {
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = async () => {
                if(!!reader.result) {
                    categoryData.image = reader.result;
                } else {
                    console.log(Error("failed converting to base 64"));
                }
            }
        }
    });

    /////////////////////////
    //Getting Category Data//
    /////////////////////////
    let categoryGet = await axios.get(`${window.development}/api/category-get`).then(res => res.data.categoryGet);

    ///APPENDING CREATE QUIZ CATEGORY///
    categoryGet.map(c => {
        $("#create-quiz-category").append(`
            <option val="${c.nameAz}">${c.nameAz}</option>
        `)
    });


    //////////////////////////
          //Create QUIZ
    ////////////////////////
    let quizData = {};
    $("#create-quiz-btn").click(async function() {
        quizData.category = $('#create-quiz-category').val();
        quizData.questionAz = $('#quiz-question-az').val();
        quizData.questionEn = $('#quiz-question-en').val();
        quizData.questionRu = $('#quiz-question-ru').val();
        quizData.answers = [
            {
                answerA: {
                    az: $('#quiz-answer-a-az').val(),
                    en: $('#quiz-answer-a-en').val(),
                    ru: $('#quiz-answer-a-ru').val(),
                },
                answerB: {
                    az: $('#quiz-answer-b-az').val(),
                    en: $('#quiz-answer-b-en').val(),
                    ru: $('#quiz-answer-b-ru').val(),
                },
                answerC: {
                    az: $('#quiz-answer-c-az').val(),
                    en: $('#quiz-answer-c-en').val(),
                    ru: $('#quiz-answer-c-ru').val(),
                },
                answerD: {
                    az: $('#quiz-answer-d-az').val(),
                    en: $('#quiz-answer-d-en').val(),
                    ru: $('#quiz-answer-d-ru').val(),
                }
            }
        ];
        quizData.correctAnswer = $('input[name=correctAnswer]:checked').val();
        
        ///posting Quiz Data
        let createQuiz = await axios
        .post(`${window.development}/api/create-quiz`, quizData)
        .then(res => {
            window.location.reload();
            return res.data;
        });
    });

    ////QUIZ IMAGE UPLOAD////
    $("#create-quiz-image").on('change', function() {
        let image = $(this)[0].files[0];

        if(image.size > 10000000) {
            console.log("File is too large");
            $(this).val("");
        } else {
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = async () => {
                if(!!reader.result) {
                    quizData.image = reader.result;
                } else {
                    console.log(Error("failed converting to base 64"));
                }
            }
        }
    });
});
// jwt parse
function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
    atob(base64)
        .split("")
        .map(function(c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
}