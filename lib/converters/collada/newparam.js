const Texture = require('./texture');

class Newparam {
    static from(texPath) {
        return {
            '@sid': `${Texture.getId(texPath)}-sampler`,
            sampler2D: {
                instance_image: {
                    '@url': `#${Texture.getId(texPath)}`,
                },
            },
        };
    }
}

module.exports = Newparam;
