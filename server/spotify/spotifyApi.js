class SpotifyAPI {
    static spotifyApiUri = 'https://api.spotify.com/v1';

    static async Get(path, req, res) {
        const result = await fetch(this.spotifyApiUri + path, {
            method: 'GET',
            headers: { Authorization: `Bearer ${req.cookies.authToken}` },
        });

        return await this.handleResponseStatus(result, res);
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
