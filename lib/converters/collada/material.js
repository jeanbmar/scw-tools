class Material {
    static from(scMaterial) {
        return {
            '@id': scMaterial.id,
            instance_effect: {
                '@url': `#${scMaterial.id}-effect`,
            },
        };
    }
}

module.exports = Material;
