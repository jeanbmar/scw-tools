class Matrix4x4 extends Array {
    constructor() {
        // this matrix is transposed vs three.js matrices
        super();
        this.push(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }

    static decode(smartBuf) {
        const matrix = new this();
        for (let i = 0; i < 16; i += 1) {
            matrix[i] = smartBuf.readFloatBE();
        }
        return matrix;
    }

    static compose(position, quaternion, scale) {
        const matrix = new this();
        const [x, y, z, w] = quaternion;
        const [sx, sy, sz] = scale;
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const xy = x * y2;
        const xz = x * z2;
        const yy = y * y2;
        const yz = y * z2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;
        matrix[0] = (1 - (yy + zz)) * sx;
        matrix[1] = (xy - wz) * sy;
        matrix[2] = (xz + wy) * sz;
        matrix[3] = position[0]; // eslint-disable-line prefer-destructuring
        matrix[4] = (xy + wz) * sx;
        matrix[5] = (1 - (xx + zz)) * sy;
        matrix[6] = (yz - wx) * sz;
        matrix[7] = position[1]; // eslint-disable-line prefer-destructuring
        matrix[8] = (xz - wy) * sx;
        matrix[9] = (yz + wx) * sy;
        matrix[10] = (1 - (xx + yy)) * sz;
        matrix[11] = position[2]; // eslint-disable-line prefer-destructuring
        matrix[12] = 0;
        matrix[13] = 0;
        matrix[14] = 0;
        matrix[15] = 1;
        return matrix;
    }
}

module.exports = Matrix4x4;
