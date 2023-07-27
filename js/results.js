document.getElementById("workout-name").innerText += localStorage.getItem("name");
document.getElementById("how-to").innerText += localStorage.getItem("instructions");



(async () => {
    const iframe = document.querySelector("iframe")


    const token = 'BQD5Jm3soT6osltie1shSlUAVRj_-zyqKYty5USw-Ot5KD6AGQukO8lQRS1_Ak3rWpgp2Aj3fSUAUizk4YN5yTtyEpfWpEf7zn3LjQcJesMt0GPD-cPrwiWpyVspr1BPfuXiaqc4Bdk-OqFHNiOjJqtGbb6SjIAZo8o6lSBGJSpSqluzwvF-gmzCaL7PIt74yaMv5x2w2QutEbbrRBkK4pt9ktXdnJ7TEsIsPyChbTJQ1aelxfDdhsV8o0SOhXuT4TC2nasMwXLNfGxd6q-ODUWP';
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