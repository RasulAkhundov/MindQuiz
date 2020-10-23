$(document).ready(function() {
    //Dashboard linking with token
    if(localStorage.getItem('user')) {
        window.location.href = "/";
    }

    ///PASSWORD SEEN
    let passSeenToggle = false;
    $(".password i").click(function() {
        if(passSeenToggle === false) {
            $(".password i").removeClass('fa-eye');
            $(".password i").addClass('fa-eye-slash');
            $(".password input").attr('type', 'text');
            passSeenToggle = true;
        } else {
            $(".password i").removeClass('fa-eye-slash');
            $(".password i").addClass('fa-eye');
            $(".password input").attr('type', 'password');
            passSeenToggle = false;
        }
    })

    //Page reload loading modal
    setTimeout(function() {
        $(".loading-modal").css("display", "none");
    }, 1000)
    ///Input Validation

    let ImageRandom = Math.floor(Math.random() * 6);

    let formData = {};
    $("#reg-btn").click(async function() {
        formData.email = $("#reg_email").val();
        formData.username = $("#reg_username").val();
        formData.password = $("#reg_password").val();
        formData.gender = $("#male").val() || $("#female").val();

        if($("#male")[0].checked === true) {
            formData.image = `/assets/user-image/male/${ImageRandom}.svg`
        }
        if($("#female")[0].checked === true) {
            formData.image = `/assets/user-image/female/${ImageRandom}.svg`
        }

        if(formData.email === "" ||
        formData.username === "" ||
        formData.password === "" ||
        $("#male")[0].checked === false &&
        $("#female")[0].checked === false) {
            $(".error-box span").text('Zehmet olmasa bütün boşluqları doldurun');
        } else {
            $(".loading-modal").css("display", "flex");
            $(".error-box span").remove();

            setTimeout(async function() {
                const token = await axios
                .post(`${window.development}/api/register`, formData)
                .then(res => res.data)
                if(token.user) {
                    Cookies.set('user', token.user, { expires: 365 } );
                    window.location.href = "/"
                } else {
                    $(".loading-modal").css("display", "none");
                    console.log(token.error);
                    if(token.error) {
                        if(token.error.errors.username && token.error.errors.email){
                            $(".error-box").append(`
                                <span>Bu e-poçt və istifadəci adı artıq istifadə olunur!</span>
                            `)
                        } else if(token.error.errors.email) {
                            $(".error-box").append(`
                                <span>Bu e-poçt artıq istifadə olunur!</span>
                            `)
                        } else {
                            $(".error-box").append(`
                                <span>Bu istifadəci adı artıq istifadə olunur!</span>
                            `)
                        }
                    }
                    token.alert.forEach(function(error) {
                        $(".error-box").append(`
                            <span>${error.msg}</span>
                        `)
                    })
                }
            }, 1000)
        }
    })

    $("#log-btn").click(async function() {
        formData.email = $("#log_email").val();
        formData.password = $("#log_password").val();

        if(formData.email === "" || formData.password === "") {
            $(".error-box span").text('Zehmet olmasa bütün boşluqları doldurun');
        } else {
            $(".loading-modal").css("display", "flex");
            $(".error-box span").remove();
            
            setTimeout(async function() {
                $(".reg-log-box .err").css("display", "none");
                const token = await axios
                .post(`${window.development}/api/login`, formData)
                .then(res => res.data);
                if(token.user) {
                    Cookies.set('user', token.user, { expires: 365 } );
                    window.location.href = "/"
                } else {
                    $(".loading-modal").css("display", "none");
                    console.log(token)
                    $(".error-box").append(`
                        <span>${token.alert.msg}</span>
                    `)
                }
            }, 1000)
        }
    })
})