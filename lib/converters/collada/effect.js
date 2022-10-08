const Texture = require('./texture');
const Newparam = require('./newparam');

class Effect {
    static toColorString(scColor) {
        const { buffer } = new Uint32Array([scColor]);
        return new Uint8Array(buffer).map((byte) => Math.fround(byte / 255)).join(' ');
    }

    static from(scMaterial) {
        const effect = {
            '@id': `${scMaterial.id}-effect`,
            profile_COMMON: {
                newparam: [],
                technique: {
                    '@sid': 'common',
                },
            },
        };
        const phong = {};
        if (scMaterial.emissionColor !== null) {
            phong.emission = { color: this.toColorString(scMaterial.emissionColor) };
        } else if (Texture.isTexPath(scMaterial.emissionTex)) {
            effect.profile_COMMON.newparam.push(Newparam.from(scMaterial.emissionTex));
            phong.emission = { texture: Texture.from(scMaterial.emissionTex) };
        }
        phong.ambient = { color: this.toColorString(scMaterial.ambientColor) };
        if (scMaterial.diffuseColor !== null) {
            phong.diffuse = { color: this.toColorString(scMaterial.diffuseColor) };
        } else if (Texture.isTexPath(scMaterial.diffuseTex)) {
            effect.profile_COMMON.newparam.push(Newparam.from(scMaterial.diffuseTex));
            phong.diffuse = { texture: Texture.from(scMaterial.diffuseTex) };
        }
        if (scMaterial.specularColor !== null) {
            phong.specular = { color: this.toColorString(scMaterial.specularColor) };
        } else if (Texture.isTexPath(scMaterial.specularTex)) {
            effect.profile_COMMON.newparam.push(Newparam.from(scMaterial.specularTex));
            phong.specular = { texture: Texture.from(scMaterial.specularTex) };
        }
        phong.index_of_refraction = { float: 4 };
        effect.profile_COMMON.technique.phong = phong;
        return effect;
    }
}

module.exports = Effect;
