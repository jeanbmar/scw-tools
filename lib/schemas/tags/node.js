const Tag = require('../tag');
const Matrix4x4 = require('../matrix-4x4');

class Node extends Tag {
    decode(smartBuf) {
        this.id = smartBuf.readString(smartBuf.readUInt16BE());
        this.parentId = smartBuf.readString(smartBuf.readUInt16BE());
        this.instances = [];
        for (let j = smartBuf.readUInt16BE(); j; j -= 1) {
            const tagSignature = smartBuf.readString(4);
            const instance = {};
            switch (tagSignature) {
            case 'CAME': // camera
                instance.type = 'camera';
                instance.url = smartBuf.readString(smartBuf.readUInt16BE());
                instance.node_came_2 = smartBuf.readString(smartBuf.readUInt16BE());
                break;
            case 'GEOM': // mesh
                instance.type = 'mesh';
                instance.url = smartBuf.readString(smartBuf.readUInt16BE());
                instance.materials = [];
                for (let k = smartBuf.readUInt16BE(); k; k -= 1) {
                    instance.materials.push([
                        smartBuf.readString(smartBuf.readUInt16BE()),
                        smartBuf.readString(smartBuf.readUInt16BE()),
                    ]);
                }
                break;
            case 'CONT': // skin
                instance.type = 'skin';
                instance.url = smartBuf.readString(smartBuf.readUInt16BE());
                instance.materials = [];
                for (let k = smartBuf.readUInt16BE(); k; k -= 1) {
                    instance.materials.push([
                        smartBuf.readString(smartBuf.readUInt16BE()),
                        smartBuf.readString(smartBuf.readUInt16BE()),
                    ]);
                }
                break;
            default:
                throw new Error(`unknown tag signature ${tagSignature} in node tag`);
            }
            this.instances.push(instance);
        }
        this.frameCount = smartBuf.readUInt16BE();
        this.frames = [];
        if (this.frameCount) {
            this.mask = smartBuf.readUInt8();
            for (let j = 0; j < this.frameCount; j += 1) {
                const transformation = {
                    frameId: smartBuf.readUInt16BE(),
                    quaternion: [0, 0, 0, 1],
                    position: [0, 0, 0],
                    scale: [1, 1, 1],
                    get matrix() {
                        const { position, quaternion, scale } = transformation;
                        return Matrix4x4.compose(position, quaternion, scale);
                    },
                };
                if (j === 0 || (this.mask & 1)) {
                    transformation.quaternion = [
                        Math.fround(smartBuf.readInt16BE() / 32512),
                        Math.fround(smartBuf.readInt16BE() / 32512),
                        Math.fround(smartBuf.readInt16BE() / 32512),
                        Math.fround(smartBuf.readInt16BE() / 32512),
                    ];
                }
                if (j === 0 || (this.mask & 2)) {
                    transformation.position[0] = smartBuf.readFloatBE();
                }
                if (j === 0 || (this.mask & 4)) {
                    transformation.position[1] = smartBuf.readFloatBE();
                }
                if (j === 0 || (this.mask & 8)) {
                    transformation.position[2] = smartBuf.readFloatBE();
                }
                if (j === 0 || (this.mask & 0x10)) {
                    transformation.scale[0] = smartBuf.readFloatBE();
                }
                if (j === 0 || (this.mask & 0x20)) {
                    transformation.scale[1] = smartBuf.readFloatBE();
                }
                if (j === 0 || (this.mask & 0x40)) {
                    transformation.scale[2] = smartBuf.readFloatBE();
                }
                this.frames.push(transformation);
            }
        }
        return this;
    }
}

module.exports = Node;
