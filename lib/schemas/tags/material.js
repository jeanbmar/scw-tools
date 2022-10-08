const Tag = require('../tag');

class Material extends Tag {
    constructor() {
        super();
        this.diffuseTex = null;
        this.diffuseColor = null;
        this.specularTex = null;
        this.specularColor = null;
        this.colorizeTex = null;
        this.colorizeColor = null;
        this.emissionTex = null;
        this.emissionColor = null;
    }

    decode(smartBuf, fileSCW) {
        this.id = smartBuf.readString(smartBuf.readUInt16BE());
        this.shader = smartBuf.readString(smartBuf.readUInt16BE());
        this.params = smartBuf.readUInt8(); // e.g. Material::isOpaque
        this.mate_4 = smartBuf.readUInt8();
        this.ambientColor = smartBuf.readUInt32BE();
        if (smartBuf.readUInt8()) {
            this.diffuseTex = smartBuf.readString(smartBuf.readUInt16BE());
        } else {
            this.diffuseColor = smartBuf.readUInt32BE();
        }
        if (smartBuf.readUInt8()) {
            this.specularTex = smartBuf.readString(smartBuf.readUInt16BE())
        } else {
            this.specularColor = smartBuf.readUInt32BE();
        }
        this.stencilTex = smartBuf.readString(smartBuf.readUInt16BE());
        this.normalTex = smartBuf.readString(smartBuf.readUInt16BE());
        if (smartBuf.readUInt8()) {
            this.colorizeTex = smartBuf.readString(smartBuf.readUInt16BE());
        } else {
            this.colorizeColor = smartBuf.readUInt32BE();
        }
        if (smartBuf.readUInt8()) {
            this.emissionTex = smartBuf.readString(smartBuf.readUInt16BE());
        } else {
            this.emissionColor = smartBuf.readUInt32BE();
        }
        this.opacityTex = smartBuf.readString(smartBuf.readUInt16BE());
        this.mate_17 = smartBuf.readFloatBE();
        this.mate_18 = smartBuf.readFloatBE();
        this.lightmapDiffuseTex = smartBuf.readString(smartBuf.readUInt16BE());
        this.lightmapSpecularTex = smartBuf.readString(smartBuf.readUInt16BE());
        this.bakedLightmapTex = (fileSCW.header.version >= 2) ? smartBuf.readString(smartBuf.readUInt16BE()) : null;
        this.shaderConfig = smartBuf.readUInt32BE();
        if (this.shaderConfig & 0x8000) {
            this.mate_23 = smartBuf.readFloatBE();
            this.mate_24 = smartBuf.readFloatBE();
            this.mate_25 = smartBuf.readFloatBE();
            this.mate_26 = smartBuf.readFloatBE();
        }
    }
}

module.exports = Material;
