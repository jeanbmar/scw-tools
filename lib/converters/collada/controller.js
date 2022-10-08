class Controller {
    static from(scGeometry) {
        const controller = {
            '@id': `${scGeometry.id}-skin`,
            skin: {
                '@source': `#${scGeometry.id}-mesh`,
                bind_shape_matrix: scGeometry.bindShapeMatrix.join(' '),
                source: [
                    {
                        '@id': `${scGeometry.id}-skin-joint`,
                        Name_array: {
                            '@id': `${scGeometry.id}-skin-joint-array`,
                            '@count': scGeometry.skinJoints.length,
                            '#text': scGeometry.skinJoints.map((skinJoint) => skinJoint.jointNode).join(' '),
                        },
                        technique_common: {
                            accessor: {
                                '@source': `#${scGeometry.id}-skin-joint-array`,
                                '@count': scGeometry.skinJoints.length,
                                '@stride': 1,
                                param: [
                                    { '@name': 'JOINT', '@type': 'name' },
                                ],
                            },
                        },
                    },
                    {
                        '@id': `${scGeometry.id}-skin-bind_pose`,
                        float_array: {
                            '@id': `${scGeometry.id}-skin-bind_pose-array`,
                            '@count': scGeometry.skinJoints.length * 16,
                            '#text': scGeometry.skinJoints.map((skinJoint) => skinJoint.inverseBindMatrix).flat().join(' '),
                        },
                        technique_common: {
                            accessor: {
                                '@source': `#${scGeometry.id}-skin-bind_pose-array`,
                                '@count': scGeometry.skinJoints.length,
                                '@stride': 16,
                                param: [
                                    { '@name': 'TRANSFORM', '@type': 'float4x4' },
                                ],
                            },
                        },
                    },
                    {
                        '@id': `${scGeometry.id}-skin-weight`,
                        float_array: {
                            '@id': `${scGeometry.id}-skin-weight-array`,
                            '@count': scGeometry.weights.length,
                            '#text': scGeometry.weights.flat().join(' '),
                        },
                        technique_common: {
                            accessor: {
                                '@source': `#${scGeometry.id}-skin-weight-array`,
                                '@count': scGeometry.weights.length,
                                '@stride': 1,
                                param: [
                                    { '@name': 'WEIGHT', '@type': 'float' },
                                ],
                            },
                        },
                    },
                ],
                joints: {
                    input: [
                        { '@semantic': 'JOINT', '@source': `#${scGeometry.id}-skin-joint` },
                        { '@semantic': 'INV_BIND_MATRIX', '@source': `#${scGeometry.id}-skin-bind_pose` },
                    ],
                },
                vertex_weights: {
                    '@count': scGeometry.vertexCount.length,
                    input: [
                        { '@semantic': 'JOINT', '@source': `#${scGeometry.id}-skin-joint`, '@offset': 0 },
                        { '@semantic': 'WEIGHT', '@source': `#${scGeometry.id}-skin-weight`, '@offset': 1 },
                    ],
                    vcount: scGeometry.vertexCount.join(' '),
                    v: scGeometry.vertexWeights.join(' '),
                },
            },
        };
        return controller;
    }
}

module.exports = Controller;
