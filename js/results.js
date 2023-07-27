document.getElementById("workout-name").innerText += localStorage.getItem("name");
document.getElementById("equipment").innerText += localStorage.getItem("equipment");



(async () => {
    const iframe = document.querySelector("iframe")


    const token = 'BQAGyN2r6ADBW9NKI_Sqpxv2EVAHS8F3NW-S51hLIY3wCFF48HpXptISdXn7t52ASCzWfkr_rSwtcmdUg-vu02Ij6IoDGemrZ9toILxbAOj96p8nas6yOGVxTggqYHsDL1JTu-_G6NIvEnzJdrYOB5iYGzJKirUADh8lJkq_FJS9JpT4wTrPkTUa3J_0MJNy3M19in51ykHqdrBXBPYJv9TLG7JcJGr0b7UAS8WmI-pRcrPk9RGbc07uV9uUAPwyusVBmZHmrcR1YKZMX1kFH8UB';
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