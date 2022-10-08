const Tag = require('../tag');

class Header extends Tag {
    decode(smartBuf, fileSCW) {
        this.version = smartBuf.readUInt16BE();
        this.frameRate = smartBuf.readUInt16BE();
        this.head_5 = smartBuf.readUInt16BE();
        this.head_6 = smartBuf.readUInt16BE();
        this.materialsFile = smartBuf.readString(smartBuf.readUInt16BE());
        if (smartBuf.remaining()) {
            this.head_8 = smartBuf.readUInt8() !== 0;
        }
        if (this.materialsFile !== '') {
            fileSCW.dependencies.add(this.materialsFile);
        }
    }
}

module.exports = Header;
