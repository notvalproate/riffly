export default class SpotifyParser {
    static parseUserInfo(userinfo) {
        let images = null;

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
        if(playerInfo.currently_playing_type === 'track') {
            return this.parseTrackInfo(playerInfo);
        } else {
            return this.parseEpisodeInfo(playerInfo);
        }
    }

    static parseTrackInfo(playerInfo) {
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
            },
        };

        return parsed;
    }

    static parseEpisodeInfo(playerInfo) {
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
                description: playerInfo.item.description,
                language: playerInfo.item.language,
                show: {
                    name: playerInfo.item.show.name,
                    url: playerInfo.item.show.external_urls.spotify,
                },
                images: {
                    default: playerInfo.item.images[1].url,
                    large: playerInfo.item.images[0].url,
                },
                url: playerInfo.item.external_urls.spotify,
                id: playerInfo.item.id,
            },
        };

        return parsed;
    }
};

Object.freeze(SpotifyParser);
