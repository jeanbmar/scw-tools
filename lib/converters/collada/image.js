const path = require('path');

class Image {
    static isImagePath(assetPath) {
        return assetPath !== undefined && assetPath !== null && assetPath.trim() !== '' && assetPath.trim() !== '.';
    }

    static getId(imagePath) {
        return imagePath.replace(/[\\/#.]/g, '-');
    }

    static getConvertedPath(imagePath) {
        [imagePath] = imagePath.split('#');
        const ext = path.extname(imagePath);
        return `${imagePath.substring(0, imagePath.length - ext.length)}.png`;
    }

    static getImages(scMaterials) {
        const images = new Set();
        scMaterials.forEach((scMaterial) => {
            const candidates = [
                scMaterial.diffuseTex,
                scMaterial.specularTex,
                scMaterial.stencilTex,
                scMaterial.normalTex,
                scMaterial.colorizeTex,
                scMaterial.emissionTex,
                scMaterial.opacityTex,
                scMaterial.lightmapDiffuseTex,
                scMaterial.lightmapSpecularTex,
                scMaterial.bakedLightmapTex,
            ];
            candidates.forEach((candidate) => {
                if (this.isImagePath(candidate)) {
                    images.add(candidate);
                }
            });
        });
        return Array.from(images);
    }

    static from(imagePath) {
        return {
            '@id': this.getId(imagePath),
            init_from: {
                ref: this.getConvertedPath(imagePath),
            },
        };
    }
}

module.exports = Image;
