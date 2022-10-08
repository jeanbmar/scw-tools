const builder = require('xmlbuilder');
const Controller = require('./controller');
const Effect = require('./effect');
const Geometry = require('./geometry');
const Image = require('./image');
const Material = require('./material');
const Node = require('./node');

class Collada {
    constructor() {
        this.xml = {
            COLLADA: {
                '@xmlns': 'http://www.collada.org/2008/03/COLLADASchema',
                '@version': '1.5.0',
                asset: {
                    contributor: {
                        author: 'brawler.gg',
                        authoring_tool: 'SCW Tools',
                    },
                    created: new Date().toISOString(),
                    modified: new Date().toISOString(),
                    up_axis: 'Y_UP',
                },
                library_images: { image: [] },
                library_effects: { effect: [] },
                library_materials: { material: [] },
                library_geometries: { geometry: [] },
                library_controllers: { controller: [] },
                library_visual_scenes: { visual_scene: [] },
            },
        };
        this.imageFiles = [];
    }

    toXML() {
        return builder.create(this.xml, { version: '1.0', encoding: 'utf-8' })
            .end({ pretty: true });
    }

    static load(scw) {
        const collada = new this();
        collada.load(scw);
        return collada;
    }

    load(scw) {
        // build images
        this.imageFiles = [...Image.getImages(scw.materials)];
        const images = this.imageFiles.map((imagePath) => Image.from(imagePath));
        this.xml.COLLADA.library_images.image = [...images];

        // build effects
        const effects = scw.materials.map((scMaterial) => Effect.from(scMaterial));
        this.xml.COLLADA.library_effects.effect = [...effects];

        // build materials
        const materials = scw.materials.map((scMaterial) => Material.from(scMaterial));
        this.xml.COLLADA.library_materials.material = [...materials];

        // build geometries
        const geometries = scw.geometries.map((scGeometry) => Geometry.from(scGeometry));
        this.xml.COLLADA.library_geometries.geometry = [...geometries];

        // build controllers
        const controllers = scw.geometries.filter((scGeometry) => scGeometry.skinJoints.length > 0)
            .map((scGeometry) => Controller.from(scGeometry));
        this.xml.COLLADA.library_controllers.controller = [...controllers];

        // build armatures (ref https://github.com/assimp/assimp/blob/master/test/models/Collada/library_animation_clips.dae)
        const armatures = Node.buildHierarchy(scw.nodes);
        this.xml.COLLADA.library_visual_scenes.visual_scene = {
            '@id': 'default-scene',
            node: [...armatures],
        };
        this.xml.COLLADA.scene = { instance_visual_scene: { '@url': '#default-scene' } };
    }
}

module.exports = Collada;
