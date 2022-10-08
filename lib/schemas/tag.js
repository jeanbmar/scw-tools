class Tag {
    static decode(smartBuf, ...args) {
        const tag = new this();
        tag.decode(smartBuf, ...args);
        return tag;
    }

    // eslint-disable-next-line class-methods-use-this
    decode() {
        // override when needed
    }
}

module.exports = Tag;
