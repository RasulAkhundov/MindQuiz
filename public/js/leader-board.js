$(document).ready(async function() {
    //getting player for leader board
    let board = await axios.get(`${window.development}/api/leader-board-players`).then(res => res.data.board);

    board.map((b, i) => {
        $("#player-table").append(`
            <tr>
                <td class="player-length">${i += 1}</td>
                <td class="player-image"><img src="${b.image}" alt=""></td>
                <td class="player-name">${b.username}</td>
                <td class="player-cup-image">${b.cup} <img src="/assets/cup.png" alt=""></td>
            </tr>
        `)
    })
    //first player
    $("#player-table tr:nth-child(1), #player-table tr:nth-child(1) .player-length").css("background", 'linear-gradient(to bottom, #ffe34d 5%, #ccac00 100%)');
    //second player
    $("#player-table tr:nth-child(2), #player-table tr:nth-child(2) .player-length").css("background", 'linear-gradient(to bottom, #c0c0c0 5%, #9a9a9a 100%)');
    //third player
    $("#player-table tr:nth-child(3), #player-table tr:nth-child(3) .player-length").css("background", 'linear-gradient(to bottom, #d7995b 5%, #b9722d 100%)');

    //getting one player me for leader board
    let tokenMe = Cookies.get('user');
    let userData = parseJwt(tokenMe);
    //user me
    let userMe = await axios.get(`${window.development}/api/user/${userData._id}`).then(res => res.data.userInfo);
    console.log(userMe)
    let boardMe = await axios.get(`${window.development}/api/leader-board-me/${userMe.cup}`).then(res => res.data.boardMe);
    
    //givving board me information
    $(`#player-table tr:nth-child(${boardMe}), #player-table tr:nth-child(${boardMe}) .player-length, .player-me tr`).css("background", 'linear-gradient(to bottom, #6fbad4 5%, #399cbd 100%)');
    $(`#player-table tr:nth-child(${boardMe}) .player-name`).css('color', '#ffffff');
    $(".player-me .player-length").text(`${boardMe}`);
    $(".player-me .player-image img").attr('src', userMe.image);
    $(".player-me .player-name").text(`${userMe.username}`);
    $(".player-me .player-cup-image").html(`${userMe.cup} <img src="/assets/cup.png" alt="">`);

    if(boardMe === 1) {
        $(".player-me .player-length").css("background", 'linear-gradient(to bottom, #ffe34d 5%, #ccac00 100%)');
    } else if(boardMe === 2) {
        $(".player-me .player-length").css("background", 'linear-gradient(to bottom, #c0c0c0 5%, #9a9a9a 100%)');
    } else if(boardMe === 3) {
        $(".player-me .player-length").css("background", 'linear-gradient(to bottom, #d7995b 5%, #b9722d 100%)');
    }
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