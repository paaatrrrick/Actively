const hamburger = document.querySelector(".hamburger")
const navItem = document.querySelector(".nav-item")
const navMenu = document.querySelector(".nav-menu")
var canUpdate = false

hamburger.addEventListener("click", async (e) => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
    const collection = document.getElementsByClassName("check");
    dataArr = []
    for (c in collection) {
        if (typeof collection[c].text != 'undefined') {
            dataArr.push(collection[c].text)
        }
    }
    if (canUpdate == true && dataArr.length > 0) {
        console.log('sending Data')
        console.log(dataArr)

        const data = {
            desiredSports: dataArr
        };

        console.log('sending ' + String(data))

        await fetch('/updateSportInterests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        //is this an issue?
        location.reload(true);
    }

})


for (var navI of document.querySelectorAll(".nav-item")) {
    navI.addEventListener("click", function (evt) {
        evt.target.classList.toggle("check");
        canUpdate = true
    }, false);
}
