(async () => {
    const iframe = document.querySelector("iframe")


    const token = 'BQDfnvO8Vvfhah62xGkgtT8-3rml7NUC6OE6PV1IfljO5JnhbJp8ljp2Z4LFmMBDLyVAVib7xcmvOleqA9xYj8NzINNzaO1d74-IG3j9I56TcdL8YGB7_UhPRHDBa1DAHYd-2CSbFfT4C0F4koEBLwGo_MCmYycLsugoDI5iNfu2rp9Hp1YYo7j1rvylteW6PzzyrFlRAd2s0yqdvQhwbUX_FBLahY0bfegqUBjP09dUUIp5gtLx_T_lR_YcsiMibo2rgV3bU2_90CTZuWgJEO1o';
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