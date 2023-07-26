(async () => {
    const iframe = document.querySelector("iframe")


    const token = 'BQAe86zC_uGy9thvwiR3M15Tc76G-ZdXI1wX839kdPhk0VzOGmNUjmm0ktEBRuPxYJA2aJbSMK55RXLSvR65kF3YlunB21ZF7vQ0JBgRXyDFlDZx8hkKh8-oo8VTmiDYw42C69Rr6BlmVamFx7vU6PUSSXE6XK5pSOZvOiloyQ84bGREAHSLtfK8yni8HfKeCf3XUV8Y1KDMWFUAE_VlFCn26F65MuRtn0o8ifg6rqRq-QnRQftJHduK_R_om1AOQ9C-5KHjSTCF86grxN14nftD';
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
        "name": "My recommendation playlist",
        "description": "Playlist created by the tutorial on developer.spotify.com",
        "public": false
    })
    console.log(playlist)
    await fetchWebApi(
        `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(',')}`,
        'POST'
    );

    return playlist;
    }

    const genre = "heavy-metal";
    const tracksUri = await getTracksByGenre(genre);
    const createdPlaylist = await createPlaylist(tracksUri);
    console.log(createdPlaylist.name, createdPlaylist.id);
    iframe.src = `https://open.spotify.com/embed/playlist/${createdPlaylist.id}?utm_source=generator&theme=0`;
})()