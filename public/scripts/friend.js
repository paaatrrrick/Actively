function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
async function friendUpdate(id, location, btnId) {
    const data = {
        id: id
    };
    await fetch(`/${location}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    const button = document.getElementById(btnId)
    if (location === 'addFriend') {
        button.innerHTML = 'Added!'
    } else {
        button.innerHTML = 'Removed'
    }
    button.onclick = null;
}

function createFriends(friendlist) {
    console.log(friendlist)
    const container = document.getElementById('container')
    if (friendlist.length === 0) {
        const friendDiv = document.createElement("div");
        friendDiv.classList.add('friendDiv')
        const noOneH4 = document.createElement("h4");
        noOneH4.classList.add('noOneH4')
        noOneH4.innerHTML = 'Sorry no one was found'
        friendDiv.appendChild(noOneH4)
        container.appendChild(friendDiv)
    } else {
        for (let i = 0; i < friendlist.length; i++) {
            const friendDiv = document.createElement("div");
            friendDiv.classList.add('friendDiv');
            const leftside = document.createElement("a");
            leftside.href = `/profile/${friendlist[i].id}`
            leftside.classList.add('leftside');
            const img = document.createElement("img");
            if (friendlist[i].icon) {
                img.src = friendlist[i].icon;
            } else {
                img.src = 'https://ucarecdn.com/a0411345-97eb-44ba-be97-1a1ac4ec79d9/';
            }
            const h3 = document.createElement("h3");
            h3.innerHTML = friendlist[i].first + ' ' + friendlist[i].last;
            leftside.appendChild(img)
            leftside.appendChild(h3)
            friendDiv.appendChild(leftside)
            const friend = document.createElement("button")
            friend.classList.add('friend')
            if (friendlist[i].isFriend) {
                friend.innerHTML = 'Unfriend';
                friend.classList.add('remove');
                const id = uuid();
                friend.id = id;
                friend.onclick = function (id) { friendUpdate(friendlist[i].id, 'removeFriend', friend.id); };

            } else {
                friend.innerHTML = 'Friend +';
                friend.classList.add('add');
                const id = uuid();
                friend.id = id;
                friend.onclick = function (id) { friendUpdate(friendlist[i].id, 'addFriend', friend.id); };
            }
            friendDiv.appendChild(friend)
            container.appendChild(friendDiv)
        }
    }
}

const first = document.getElementById('first')
const last = document.getElementById('last')
const search = document.getElementById('search')
search.addEventListener("click", async (e) => {
    const friendDivs = document.getElementsByClassName('friendDiv')
    for (let i = 0; i < friendDivs.length; i++) {
        friendDivs[i].classList.add('displayNone')
    }
    const data1 = {
        first: first.value,
        last: last.value
    };
    await fetch('/findFriends', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data1),
    })
        .then(res => {
            return res.json()
        })
        .then(response => { createFriends(response.key) })
        .catch(error => console.log(error))
    console.log('done123')
});