const hamburger = document.querySelector(".bp-hamburger")
const navItem = document.querySelector(".bp-nav-item")
const navMenu = document.querySelector(".bp-nav-menu")
var canUpdate = false

const hamburgers = document.getElementsByClassName("bp-hamburger")
for (let i = 0; i < hamburgers.length; i++) {
    hamburgers[i].addEventListener("click", async (e) => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
        const collection = document.getElementsByClassName("check");
        dataArr = []
        const state = document.getElementById('stateId')
        const city = document.getElementById('cityId')
        if (!hamburger.classList.contains('active')) {
            for (c of collection) {
                if (typeof c.id != 'undefined') {
                    dataArr.push(c.id)
                }
            }
            if (canUpdate == true && dataArr.length > 0) {
                console.log('inside here')
                const data = {
                    desiredSports: dataArr,
                    state: state.value,
                    city: city.value
                };

                console.log('sending ' + String(data))

                await fetch('/updateSportInterests', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                canUpdate = false
                location.reload(true);
            }
        }
    })
}

const stateSelector = document.getElementById('stateId')
stateSelector.addEventListener("change", (e) => {
    canUpdate = true
})

const citySelector = document.getElementById('cityId')
stateSelector.addEventListener("change", (e) => {
    canUpdate = true
})

const sportBtns = document.getElementsByClassName("bp-nav-item")
for (let i = 0; i < sportBtns.length; i++) {
    sportBtns[i].addEventListener("click", async (e) => {
        sportBtns[i].classList.toggle("check");
        canUpdate = true
    })
}