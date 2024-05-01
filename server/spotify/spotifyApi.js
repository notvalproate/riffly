class SpotifyAPI {
    static spotifyApiUri = 'https://api.spotify.com/v1';

    static async Get(path, req, res) {
        const result = await fetch(this.spotifyApiUri + path, {
            method: "GET", headers: { Authorization: `Bearer ${req.cookies.authToken}` }
        });

        res.status(result.status);

        if(result.status === 204) {
            return {};
        }

        return await result.json();
    }
}

module.exports = {
    SpotifyAPI
};
