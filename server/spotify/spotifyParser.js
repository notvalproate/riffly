
class SpotifyParser {
    static parseUserInfo(userinfo) {
        return {
            user: {
                id: userinfo.id,
                displayName: userinfo.display_name,
                url: userinfo.external_urls.spotify,
            },
            images: {
                default: userinfo.images[0].url,
                large: userinfo.images[1].url,
            },
            country: userinfo.country,
            hasPremium: userinfo.product === 'premium',
        };
    }
};

module.exports = {
    SpotifyParser,
}