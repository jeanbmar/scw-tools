const fs = require('fs');
const path = require('path');
const { SmartBuffer } = require('smart-buffer');
const SCWFile = require('../../scw-file');
const Collada = require('./collada');

class SCW2DAE {
    // use cwd to resolve dependencies
    static loadFile(scwPath, cwd) {
        const buf = fs.readFileSync(scwPath);
        const scw = SCWFile.decode(SmartBuffer.fromBuffer(buf));
        // load and merge dependencies
        scw.dependencies.forEach((assetFile) => {
            const depSCW = this.loadFile(path.join(cwd, assetFile), cwd);
            scw.merge(depSCW);
        });
        return scw;
    }

    static convert(scwPath, outputPath, options) {
        options = {
            diffuseTex: null,
            cwd: path.join(path.dirname(scwPath), '..'),
            debug: false, // output JSON files with models
            ...options,
        };
        const scw = this.loadFile(scwPath, options.cwd);
        if (options.diffuseTex !== null) {
            scw.importDiffuseTex(options.diffuseTex);
        }
        const outputDir = path.dirname(outputPath);
        fs.mkdirSync(outputDir, { recursive: true });
        const dae = Collada.load(scw);
        fs.writeFileSync(outputPath, dae.toXML());
        if (options.debug) {
            const debugFileName = `${path.basename(outputPath, path.extname(outputPath))}.json`;
            fs.writeFileSync(path.join(outputDir, debugFileName), JSON.stringify(scw, null, 2));
        }
    }
}

module.exports = SCW2DAE;
