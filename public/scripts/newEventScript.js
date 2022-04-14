const createBtn = document.getElementById("createEvent")
const elements = document.getElementsByClassName('input')



createBtn.addEventListener("click", async (e) => {
    console.log('here123')
    datee = new Date()
    console.log(datee.getTimezoneOffset())

    var returnVar = true
    for (const element of elements) {
        if (element.value == "") {
            element.classList.add('badInput')
            returnVar = false
        } else {
            element.classList.add('goodInput')
        }
    };

    if (returnVar) {
        function helper(date1) {
            var hours = date1.getHours()
            var amPm = 'AM'
            if (hours > 11) {
                amPm = 'PM'
                hours = hours - 12
            }
            if (hours === 0) {
                hours = 12
            }
            return ' at ' + String(hours) + " " + amPm
        }
        const timeInput = document.getElementById("time").value;
        const locationInput = document.getElementById("location").value;
        const turnoutInput = document.getElementById("turnout").value;
        const skillInput = document.getElementById("skill").value;
        const radioInput = document.querySelector('input[type="radio"]:checked').value;
        const descriptionInput = document.getElementById("description").value;

        const d = new Date(timeInput);
        var today = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1)
        var notifcation = 'nothing'

        if (d.getDate() == today.getDate() & d > today) {
            notifcation = 'today' + helper(d)
        } else if (d.getHours() < 9 & d.getDate() == d.getDate()) {
            notifcation = 'tomorrow' + helper(d)
        }
        console.log(notifcation)
        const data = {
            type: radioInput,
            location: locationInput,
            time: d,
            skill: skillInput,
            description: descriptionInput,
            turnout: turnoutInput,
            notifcation: notifcation
        };

        console.log('here123')

        await fetch('/newEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        window.location.replace("/dashboard");


        // await fetch('/newEvent', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data),
        // })
        // window.location.replace("./dashboard");
        // document.location.href = './dashboard';
    }
})
