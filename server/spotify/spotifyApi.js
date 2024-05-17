class SpotifyAPI {
    static spotifyApiUri = 'https://api.spotify.com/v1';

    static async Get(path, req, res) {
        try {
            const result = await fetch(this.spotifyApiUri + path, {
                method: 'GET',
                headers: { Authorization: `Bearer ${req.cookies.authToken}` },
            });
            
            return await this.handleResponseStatus(result, res);
        } catch (err) {
            res.status(500);
            return err;
        }
    }

    static async getSongByISRC(isrc, req, res) {
        const params = new URLSearchParams({
            type: 'track',
            q: `isrc:${isrc}`,
        });
    
        let currentTrack = await SpotifyAPI.Get(`/search?${params.toString()}`, req, res);
        currentTrack = currentTrack.tracks.items[0];

        const artists = currentTrack.artists.map((artist) => artist.name);
        const title = currentTrack.name;

        return {
            artists: artists,
            title: title
        }
    } 

    static async handleResponseStatus(result, res) {
        res.status(result.status);

        if (result.status === 204) {
            return {};
        }

        const json = await result.json();

        if (result.status >= 400 && result.status <= 429) {
            return json.error;
        }

        return json;
    }
}

module.exports = {
    SpotifyAPI,
};
