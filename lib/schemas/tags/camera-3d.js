const Tag = require('../tag');

class Camera3D extends Tag {
    decode(smartBuf) {
        this.id = smartBuf.readString(smartBuf.readUInt16BE());
        this.zNear = smartBuf.readFloatBE();
        this.zFar = smartBuf.readFloatBE();
        this.xFov = smartBuf.readFloatBE();
        this.yFov = smartBuf.readFloatBE();
        this.aspectRatio = smartBuf.readFloatBE();
    }
}

module.exports = Camera3D;
