$(document).ready(async function() {
    /////////////////////////
    //Getting Category Data//
    /////////////////////////
    let href = new URL(window.location.href);
    let id = href.searchParams.get('id');

    let categoryGet = await axios.get(`${window.development}/api/category?id=${id}`).then(res => res.data.categoryGet);

    $("#category-image").css("background-image", `url('${categoryGet.image}')`);
    $("#category-name").text(`${categoryGet.nameAz}`);
    $("#correct-point").html(`+${categoryGet.xp} <img src="/assets/cup.png">`);
    $("#wrong-point").html(`-${categoryGet.xp} <img src="/assets/cup.png">`);
    $("#difficulty-level").append(
        loop(categoryGet.level).map(level => {
            return `<img src="/assets/stars.svg" class="star-img">`
        })
    )
    $("#answered-time").text(`10s`);
    $("#biografi").text(`${categoryGet.bioAz}`);
    function loop(length) {
        let count = [];
        for (let i = 0; i < length; i++) {
          count.push(i);
        }
        return count;
    }

    //time ticking sound
    let timeTickingSnd = new Audio('/assets/sounds/clock-ticking.wav');
    //Start Count Sound
    let countSnd = new Audio('/assets/sounds/count-sound.wav');
    //won Sound
    let wonSnd = new Audio('/assets/sounds/cheer-sound.wav');

    let second = 20;

    let gameCountDown;

    //Getting Quiz Data
    let quizLength = 0;

    ////////////////////////////
    //getting quiz
    //////////////////////////
    $('#play-quiz').click(async function() {

        setTimeout(function() {
            //Quiz start box display flex
            $(".quiz-starter-wrapper").css('display', 'flex');
        }, 500);
        setTimeout(function() {
            countSnd.play();
        }, 1000);
        setTimeout(function() {
            countSnd.play();
        }, 2000);
        setTimeout(function() {
            countSnd.play();
        }, 3000);
        setTimeout(function() {
            countSnd.play();
        }, 4000);
        setTimeout(function() {
            //Count number display none
            $(".quiz-starter-wrapper .count-number").css('display', 'none');
            // Timer display flex
            $(".quiz-starter-wrapper .timer").css('display', 'flex');
            // Quiz box display flex
            $(".quiz-starter-wrapper .quiz-cover").css('display', 'flex');

            //time ticking
            timeTickingSnd.play();

            //Quiz timer count down interval
            gameCountDown = setInterval(function() {
                second -= 1;
                // giving time to span
                $(".quiz-starter-wrapper .timer span").text(second);
                //giving length to timer wrapper
                $(".quiz-starter-wrapper .timer .timer-wrapper").css({
                    width: 0,
                    transition: '20s linear'
                })

                // timer length color giving
                //if second less than 20
                if(second <= 20) {
                    $(".quiz-starter-wrapper .timer .timer-wrapper").css({
                        background: 'linear-gradient(to bottom, #00b300 5%, #006700 100%)'
                    })
                }
                //if second less than 10
                if(second <= 10) {
                    $(".quiz-starter-wrapper .timer .timer-wrapper").css({
                        background: 'linear-gradient(to bottom, #ffff34 5%, #e6e600 100%)'
                    })
                }
                //if second less than 5
                if(second <= 5) {
                    $(".quiz-starter-wrapper .timer .timer-wrapper").css({
                        background: 'linear-gradient(to bottom, #ff3333 5%, #e60000 100%)'
                    })
                }
                //if second is equal to 0
                if(second == 0) {
                    //game over sound
                    let gameOverSnd = new Audio('/assets/sounds/game-over.wav');
                    gameOverSnd.play();

                    timeTickingSnd.pause();

                    //timer display none
                    $(".quiz-starter-wrapper .timer").css('display', 'none');

                    //game over text display flex
                    gameOver();

                    getXp();
                }
            }, 1000);
        }, 4500);

        let quizData = await axios.get(`${window.development}/api/get-quiz/${categoryGet.nameAz}`).then(res => res.data.quizData);

        ///first quiz append
        $(".quiz-cover").append(`
            <div class="quiz">
                <h2 id="quiz-header">${quizData[quizLength].questionAz}</h2>
                <img id="quiz-image" src="${quizData[quizLength].image}">
                <div class="quiz-buttons">
                    <div class="line">
                        <button type="button" value="A" id="quiz-variant-a">${quizData[quizLength].answers[0].answerA.az}</button>
                        <button type="button" value="B" id="quiz-variant-b">${quizData[quizLength].answers[0].answerB.az}</button>
                    </div>
                    <div class="line">
                        <button type="button" value="C" id="quiz-variant-c">${quizData[quizLength].answers[0].answerC.az}</button>
                        <button type="button" value="D" id="quiz-variant-d">${quizData[quizLength].answers[0].answerD.az}</button>
                    </div>
                </div>
            </div>
        `);

        //if dont have image. remove image
        if(!quizData[quizLength].image) {
            $(document).find('.quiz #quiz-image').css('display', 'none');
        }

        //append after first chooes
        $(document).on('click', '.quiz button', function() {
            //if button value is equal to correct answer value
            if($(this).val() === quizData[quizLength].correctAnswer) {

                //correct sound
                let correctSnd = new Audio('/assets/sounds/correct.wav');
                correctSnd.play();

                //correct button background changing
                $(this).css({
                    background: 'linear-gradient(to bottom, #00b300 5%, #006700 100%)',
                    color: 'white'
                });

                //quiz length
                quizLength += 1;

                //appending next quiz after 500ms timeout
                setTimeout(function() {
                    second = 20;

                    //giving second to timer span
                    $(".quiz-starter-wrapper .timer span").text(second);
                    $(".quiz-starter-wrapper .timer .timer-wrapper").css({
                        width: '100%',
                        transition: '0s linear',
                        background: 'linear-gradient(to bottom, #00b300 5%, #006700 100%)'
                    })

                    //removing previous quiz box
                    $(".quiz").remove();

                    //appending next quiz information
                    if(quizLength < 5) {
                        $(".quiz-cover").append(`
                            <div class="quiz">
                                <h2 id="quiz-header">${quizData[quizLength].questionAz}</h2>
                                <img id="quiz-image" src="${quizData[quizLength].image}">
                                <div class="quiz-buttons">
                                    <div class="line">
                                        <button type="button" value="A" id="quiz-variant-a">${quizData[quizLength].answers[0].answerA.az}</button>
                                        <button type="button" value="B" id="quiz-variant-b">${quizData[quizLength].answers[0].answerB.az}</button>
                                    </div>
                                    <div class="line">
                                        <button type="button" value="C" id="quiz-variant-c">${quizData[quizLength].answers[0].answerC.az}</button>
                                        <button type="button" value="D" id="quiz-variant-d">${quizData[quizLength].answers[0].answerD.az}</button>
                                    </div>
                                </div>
                            </div>
                        `);

                        //if dont have image. remove image
                        if(!quizData[quizLength].image) {
                            $(document).find('.quiz #quiz-image').css('display', 'none');
                        }
                    }
                }, 500);

                if(quizLength === 5) {
                    timeTickingSnd.pause();
                    
                    //removing second for counting
                    clearInterval(gameCountDown);

                    //won sound
                    wonSnd.play();

                    //timer display none
                    $(".quiz-starter-wrapper .timer").css('display', 'none');

                    ///QUIZ RESULT PROFILE AND ANIMATION
                    wonGame();

                    getXp();
                }
            } else {
                console.log("no")
                getXp();
            }
        })
        console.log(quizData);

        //GAME OVER FUNCTION
        function gameOver() {
            $(".quiz-res-profile").css("display", 'flex');
            $(".quiz-res-profile h2").text('Uduzdun!');
            setTimeout(() => {
                $(".quiz-res-profile .about-profile").addClass('quiz-res-animation');
            }, 200);
            setTimeout(() => {
                $(".quiz-res-profile button:first-child").addClass('quiz-res-animation');
            }, 400);
            setTimeout(() => {
                $(".quiz-res-profile button:last-child").addClass('quiz-res-animation');
            }, 600);
            //quiz box dislay none
            $(".quiz-starter-wrapper .quiz-cover").css('display', 'none');
        }

        //GAME WON FUNCTION
        function wonGame() {
            $(".quiz-res-profile").css("display", 'flex');
            $(".quiz-res-profile h2").text('Qazandin!');
            setTimeout(() => {
                $(".quiz-res-profile .about-profile").addClass('quiz-res-animation');
            }, 200);
            setTimeout(() => {
                $(".quiz-res-profile button:first-child").addClass('quiz-res-animation');
            }, 400);
            setTimeout(() => {
                $(".quiz-res-profile button:last-child").addClass('quiz-res-animation');
            }, 600);
        }

        ///GETTING XP
        function getXp() {
            let xp = categoryGet.xp * quizLength;
            console.log(xp);
        }
    })
})