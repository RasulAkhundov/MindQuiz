$(document).ready(async function() {
    
    //Logout
    $("#logout").click(function() {
        Cookies.remove('user');
        window.location.href = "/";
    });

    let tokenMe = Cookies.get('user');

    if(tokenMe) {
        let userData = parseJwt(tokenMe);

        let userMe = await axios.get(`${window.development}/api/user/${userData._id}`).then(res => res.data.userInfo);

        if(userMe.email !== "resul.axundov2002@mail.ru") {
            $("ul .admin-panel").css("display", "none");
        }

        let userName = userMe.username;
        let userImage = userMe.image;
        let level = userMe.level;
        let xp = userMe.xp;
        let levelUpXp = userMe.levelUpXp;

        //LEVEL XP LEVELUPXP
        $(".profile-modal .level .label, .about-profile .level .label").text(`Səviyyə: ${level}`);
        $(".profile-modal .level .bar-span, .about-profile .level .bar-span").text(`${xp} / ${levelUpXp}xp`);

        //Header User Profile display checking
        $(".header-image-cover").css("display", "flex");
        $(".play-side .about-profile").css("display", "flex");
        $(".header-image-cover .header-image, .about-profile-image").css("background", `url(${userImage})`);
        $(".profile-modal .username").text(userName);

        let userProfileToggle = false;

        $(".header-image-cover").click(function() {
            if(userProfileToggle === false) {
                $(".profile-modal").fadeIn(300);
                userProfileToggle = true;
            } else {
                $(".profile-modal").fadeOut(300);
                userProfileToggle = false;
            }
        });
        $(document).on('click', function(e) {
            if(!(($(e.target).closest("#profile-modal").length > 0 ) ||
            ($(e.target).closest("#header-image-cover").length > 0 ))) {
                $(".profile-modal").fadeOut(300);
                userProfileToggle = false;
            }
        })
    } else {
        //Header User Profile display checking
        $(".header-login-text").css("display", "flex");
        $(".quizez-box").css("height", "90%");
        $("ul .admin-panel").css("display", "none");
    }
})
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