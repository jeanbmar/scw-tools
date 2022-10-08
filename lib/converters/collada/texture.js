const Image = require('./image');

class Texture {
    static isTexPath(path) {
        return Image.isImagePath(path);
    }

    static getId(path) {
        return Image.getId(path);
    }

    static from(path) {
        return {
            '@texture': `${this.getId(path)}-sampler`,
            '@texcoord': 'UVMap',
        };
    }
}

module.exports = Texture;
