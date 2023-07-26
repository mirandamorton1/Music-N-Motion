(async () => {
    const iframe = document.querySelector("iframe")


    const token = 'BQAwZTimRKTVmWl6V2mJvu2E3hkNWFYFTRidSrdrmkAOQDIowuT3Kw9fx0rRaMF6bzKdxVYi9gFyAw-FC-omPHXC2Ce8tfeXSl7Vn8MguRCp839tM5AyE_PzyfHEw-ICSd8Qp_osCG9K0fIAV7wfxGw7Pbcju79iASvSTkwF5VA4GdFRmK3WPIA19q7yiQe_AYlhSFdIwnpFSOetDk75mM_ugOtcgZ9m5as8WrvjU7anbjFe0qm69zzafIal_fn8Eo4x7TnJW76HNCtWprLJYdnG';
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