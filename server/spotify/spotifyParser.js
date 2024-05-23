
class SpotifyParser {
    static parseUserInfo(userinfo) {
        const images = null;

        if(userinfo.images.length) {
            images = {
                default: userinfo.images[0].url,
                large: userinfo.images[1].url,
            };
        }

        return {
            user: {
                id: userinfo.id,
                displayName: userinfo.display_name,
                url: userinfo.external_urls.spotify,
            },
            images: images,
            country: userinfo.country,
            hasPremium: userinfo.product === 'premium',
        };
    }

    static parsePlayerInfo(playerInfo) {
        let parsed = {
            player: {
                playing: playerInfo.is_playing,
                progress: playerInfo.progress_ms,
                duration: playerInfo.item.duration_ms,
                device: playerInfo.device.name,
            },
            itemType: playerInfo.currently_playing_type,
            item: {
                title: playerInfo.item.name,
                artists: playerInfo.item.artists.map((artist) => ({
                    name: artist.name,
                    url: artist.external_urls.spotify,
                })),
                images: {
                    default: playerInfo.item.album.images[1].url,
                    large: playerInfo.item.album.images[0].url,
                },
                url: playerInfo.item.external_urls.spotify,
                isrc: playerInfo.item.external_ids.isrc,
                popularity: playerInfo.item.popularity,
            }
        };

        return parsed;
    }
};

module.exports = {
    SpotifyParser,
}