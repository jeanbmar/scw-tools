class Node {
    static buildHierarchy(scNodes) {
        const nodeMap = {};
        const armatures = [];
        scNodes.forEach((sourceNode) => {
            const isArmatureNode = sourceNode.parentId === '';
            const node = {
                '@id': sourceNode.id,
                '@sid': sourceNode.id,
                matrix: [],
                node: [],
                instance_geometry: [],
                instance_controller: [],
            };
            // transformations
            sourceNode.frames.forEach((frame) => {
                node.matrix.push({
                    '@sid': 'transform',
                    '#text': frame.matrix.join(' '),
                });
            });
            // instances
            sourceNode.instances.forEach((sourceInstance) => {
                if (sourceInstance.type === 'mesh') {
                    const instance = {
                        '@url': `#${sourceInstance.url}`,
                        bind_material: {
                            technique_common: {
                                instance_material: sourceInstance.materials.map((material) => ({
                                    '@symbol': material[0],
                                    '@target': `#${material[1]}`,
                                })),
                            },
                        },
                    };
                    node.instance_geometry.push(instance);
                } else if (sourceInstance.type === 'skin') {
                    const instance = {
                        '@url': `#${sourceInstance.url}-skin`,
                        skeleton: '#Root',
                        bind_material: {
                            technique_common: {
                                instance_material: sourceInstance.materials.map((material) => ({
                                    '@symbol': material[0],
                                    '@target': `#${material[1]}`,
                                    bind_vertex_input: {
                                        '@semantic': 'UVMap',
                                        '@input_semantic': 'TEXCOORD',
                                        '@input_set': 0,
                                    },
                                })),
                            },
                        },
                    };
                    node.instance_controller.push(instance);
                }
            });
            if (isArmatureNode) {
                node['@type'] = 'NODE';
                armatures.push(node);
            } else {
                const parentNode = nodeMap[sourceNode.parentId];
                const isJointNode = sourceNode.instances.length === 0;
                if (isJointNode) {
                    node['@type'] = 'JOINT';
                } else {
                    node['@type'] = 'NODE';
                    if (parentNode['@type'] === 'JOINT') {
                        parentNode['@type'] = 'NODE';
                    }
                }
                parentNode.node.push(node);
            }
            nodeMap[sourceNode.id] = node;
        });
        return armatures;
    }
}

module.exports = Node;
