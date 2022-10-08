const Header = require('./schemas/tags/header');
const Material = require('./schemas/tags/material');
const Camera3D = require('./schemas/tags/camera-3d');
const Geometry = require('./schemas/tags/geometry');
const Node = require('./schemas/tags/node');
const Wend = require('./schemas/tags/wend');

class SCWFile {
    constructor() {
        this.materials = [];
        this.cameras = [];
        this.geometries = [];
        this.nodes = [];
        this.dependencies = new Set();
    }

    static decode(smartBuf) {
        const file = new this();
        file.decode(smartBuf);
        return file;
    }

    decode(smartBuf) {
        const fileSignature = smartBuf.readString(4);
        if (fileSignature !== 'SC3D') {
            throw new Error(`invalid file signature ${fileSignature}`);
        }
        do {
            const tagSize = smartBuf.readUInt32BE();
            const tagSignature = smartBuf.readString(4);
            switch (tagSignature) {
            case 'HEAD':
                if (this.header) {
                    throw new Error('found header tag, but header is already defined');
                }
                this.header = Header.decode(smartBuf, this);
                break;
            case 'MATE':
                this.materials.push(Material.decode(smartBuf, this));
                break;
            case 'CAME':
                this.cameras.push(Camera3D.decode(smartBuf));
                break;
            case 'GEOM':
                this.geometries.push(Geometry.decode(smartBuf, this));
                break;
            case 'NODE':
                for (let i = smartBuf.readUInt16BE(); i; i -= 1) {
                    this.nodes.push(Node.decode(smartBuf));
                }
                break;
            case 'WEND':
                Wend.decode(smartBuf);
                break;
            default:
                throw new Error(`unknown tag signature ${tagSignature} (${tagSize} bytes)`);
            }
            smartBuf.readUInt32BE();
        } while (smartBuf.remaining());
    }

    merge(scw) {
        this.materials.push(...scw.materials);
        this.cameras.push(...scw.cameras);
        this.geometries.push(...scw.geometries);
        this.nodes.push(...scw.nodes);
    }

    importDiffuseTex(texPath) {
        this.materials.forEach((material) => {
            if (material.diffuseTex === '.') {
                material.diffuseTex = texPath;
            }
        });
    }
}

module.exports = SCWFile;
