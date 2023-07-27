(async () => {
    const workoutName = document.getElementById("workout-name") 
    const typeOfWorkout = localStorage.getItem("name");
    let workoutTypeToPage = " "
    workoutTypeToPage += typeOfWorkout.replace(/_/g, ' ')
    workoutName.innerText += workoutTypeToPage
    const equipment = document.getElementById("equipment")
    const typeOfEquipment = localStorage.getItem("equipment");
    let equipmentToPage = " "
    equipmentToPage += typeOfEquipment.replace(/_/g, ' ').replace(/\b\w/g, (match) => match.toLocaleUpperCase());
    equipment.innerText += equipmentToPage
    
    const category = localStorage.getItem("category")
    const iframe = document.querySelector("iframe")

    const token = 'BQClPN1Tp57KDvVkT7WCIvO--vHTm3eUNfWez-gO9BflyTNgjKolNhBMZTZ_Ua3CtDA-AHuFij_Fdld80v8WM4AihTFgPt1TOaBi5_6M0kh8Q0LPsWCcxO69Pc4yTRK9LNN6-6KxmlN28GNQcV-UobyCkNxmpDyJc9fDS5HFMUlfUs1xm9FE8F4eispYCp8gcrTVywnJ0wrVrUKzG9BfzUTrpeqD1mJn33fPzLWxKI8jl0Hf5bebtn0CKyPRBMFoQ8LDKAh4_-QeeQjZegD2I9xp';
    async function fetchWebApi(endpoint, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
        method,
        body:JSON.stringify(body)
    });

    return await res.json();
    }


    async function getTracksByGenre(genre) {
        const response = await fetchWebApi(`v1/search?q=genre:${encodeURIComponent(genre)}&type=track&limit=10`, 'GET');

        return response.tracks.items.map(item => item.uri);
        
      }


    async function createPlaylist(tracksUri){
    const { id: user_id } = await fetchWebApi('v1/me', 'GET')

    const playlist = await fetchWebApi(
        `v1/users/${user_id}/playlists`, 'POST', {
        "name": "Your recommendation workout playlist ",
        "description": "Playlist created by the tutorial on developer.spotify.com",
        "public": false
        
    })
    await fetchWebApi(
        `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(',')}`,
        'POST'
    );

    return playlist;
    }

    let genre = ""

    if(category == "olympic_weightlifting"){
        genre = "metalcore";
    } else if(category == "cardio"){
        genre = "power";
    } else if(category == "ploymetrics"){
        genre = "workout";
    } else if(category == "powerlifting"){
        genre = "heavy-metal";
    } else if(category == "strength"){
        genre = "punk-rock";
    } else if(category == "stretching"){
        genre = "dance";
    } else if(category == "strongman"){
        genre = "death-metal";
    } else{
        genre = "power-pop";
    }


    const tracksUri = await getTracksByGenre(genre);
    const createdPlaylist = await createPlaylist(tracksUri);
    iframe.src = `https://open.spotify.com/embed/playlist/${createdPlaylist.id}?utm_source=generator&theme=0`;
})()


