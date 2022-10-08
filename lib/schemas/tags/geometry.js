const Matrix4x4 = require('../matrix-4x4');
const Tag = require('../tag');

class Geometry extends Tag {
    decode(smartBuf, fileSCW) {
        this.id = smartBuf.readString(smartBuf.readUInt16BE());
        this.group = smartBuf.readString(smartBuf.readUInt16BE());
        this.geom_3 = fileSCW.header.version <= 1 ? Matrix4x4.decode(smartBuf) : new Matrix4x4();
        this.sources = [];
        for (let i = smartBuf.readUInt8(); i > 0; i -= 1) {
            const object = {};
            object.semantic = smartBuf.readString(smartBuf.readUInt16BE());
            object.offset = smartBuf.readUInt8();
            object.geom_4_3 = smartBuf.readUInt8();
            object.stride = smartBuf.readUInt8();
            object.scale = Math.fround(smartBuf.readFloatBE() / 32512);
            object.count = smartBuf.readUInt32BE();
            object.data = []; // each group can contain vec3, vec2...
            for (let j = object.count; j; j -= 1) {
                const row = [];
                for (let k = 0; k < object.stride; k += 1) {
                    row.push(smartBuf.readInt16BE());
                }
                object.data.push(row);
            }
            this.sources.push(object);
        }
        this.bindShapeMatrix = smartBuf.readUInt8() === 1 ? Matrix4x4.decode(smartBuf) : new Matrix4x4();
        this.skinJoints = [];
        for (let i = smartBuf.readUInt8(); i > 0; i -= 1) {
            const object = {};
            object.jointNode = smartBuf.readString(smartBuf.readUInt16BE());
            object.inverseBindMatrix = Matrix4x4.decode(smartBuf);
            this.skinJoints.push(object);
        }

        this.weights = [];
        this.vertexWeights = [];
        this.vertexCount = [];
        for (let i = smartBuf.readUInt32BE(); i > 0; i -= 1) {
            const joints = [
                smartBuf.readUInt8(),
                smartBuf.readUInt8(),
                smartBuf.readUInt8(),
                smartBuf.readUInt8(),
            ];
            const weights = [
                Math.fround(smartBuf.readUInt16BE() / 65535),
                Math.fround(smartBuf.readUInt16BE() / 65535),
                Math.fround(smartBuf.readUInt16BE() / 65535),
                Math.fround(smartBuf.readUInt16BE() / 65535),
            ];
            // compute
            let vCount = 0;
            for (let j = 0; j < 4; j += 1) {
                if (weights[j] !== 0) {
                    vCount += 1;
                    this.vertexWeights.push(joints[j]);
                    let weightIndex = this.weights.indexOf(weights[j]);
                    if (weightIndex === -1) {
                        this.weights.push(weights[j]);
                        weightIndex = this.weights.length - 1;
                    }
                    this.vertexWeights.push(weightIndex);
                }
            }
            this.vertexCount.push(vCount);
        }

        this.indices = [];
        for (let i = smartBuf.readUInt8(); i > 0; i -= 1) {
            const object = {};
            object.material = smartBuf.readString(smartBuf.readUInt16BE());
            object.elementCount = smartBuf.readUInt32BE();
            object.sideCount = smartBuf.readUInt8();
            object.indexBufferSize = smartBuf.readUInt8();
            object.primitives = [];
            if (object.indexBufferSize) {
                switch (object.indexBufferSize) {
                case 1:
                    for (let j = 0; j < object.elementCount; j += 1) {
                        const element = [];
                        for (let k = 0; k < object.sideCount; k += 1) {
                            element.push([
                                smartBuf.readUInt8(), smartBuf.readUInt8(), smartBuf.readUInt8(),
                            ]);
                        }
                        object.primitives.push(element);
                    }
                    break;
                case 2:
                    for (let j = 0; j < object.elementCount; j += 1) {
                        const element = [];
                        for (let k = 0; k < object.sideCount; k += 1) {
                            element.push([
                                smartBuf.readUInt16BE(), smartBuf.readUInt16BE(), smartBuf.readUInt16BE(),
                            ]);
                        }
                        object.primitives.push(element);
                    }
                    break;
                case 3:
                    for (let j = 0; j < object.elementCount; j += 1) {
                        const element = [];
                        for (let k = 0; k < object.sideCount; k += 1) {
                            element.push([
                                (smartBuf.readUInt8() << 16) | (smartBuf.readUInt8() << 8) | smartBuf.readUInt8(),
                                (smartBuf.readUInt8() << 16) | (smartBuf.readUInt8() << 8) | smartBuf.readUInt8(),
                                (smartBuf.readUInt8() << 16) | (smartBuf.readUInt8() << 8) | smartBuf.readUInt8(),
                            ]);
                        }
                        object.primitives.push(element);
                    }
                    break;
                case 4:
                    for (let j = 0; j < object.elementCount; j += 1) {
                        const element = [];
                        for (let k = 0; k < object.sideCount; k += 1) {
                            element.push([
                                smartBuf.readUInt32BE(), smartBuf.readUInt32BE(), smartBuf.readUInt32BE(),
                            ]);
                        }
                        object.primitives.push(element);
                    }
                    break;
                default:
                    throw new Error(`unsupported index buffer size ${object.indexBufferSize}`);
                }
            }
            this.indices.push(object);
        }
    }
}

module.exports = Geometry;
