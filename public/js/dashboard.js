$(document).ready(async function() {

    /////////////////////////
    //Getting Category Data//
    /////////////////////////
    let categoryGet = await axios.get(`${window.development}/api/category-get`).then(res => res.data.categoryGet);

    categoryGet.map(c => {
        $("#dash-category-comp").append(`
            <div class="col-6 col-sm-4 px-2 mb-3 quiz" style="cursor: pointer;" data-id="${c._id}">
                <div class="quiz-comp-image" style="background-image: url(${c.image})"></div>
                <div class="quiz-name">${c.nameAz}</div>
                <div class="stars">
                    
                </div>
            </div>
        `)
        $(`div[data-id=${c._id}]`)
        .find($(".stars"))
        .append(
            loop(c.level).map(level => {
                return `<img src="/assets/stars.svg">`
            })
        )

        
    })
    function loop(length) {
        let count = [];
        for (let i = 0; i < length; i++) {
          count.push(i);
        }
        return count;
    }

    ///////////////////////////
    //Category Sending locate//
    //////////////////////////
    $(".quiz").click(function() {
        let id = $(this).data('id');

        window.location.href = `/category?id=${id}`
    })
})