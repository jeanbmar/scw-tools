class Geometry {
    static from(scGeometry) {
        const geoId = `${scGeometry.id}-mesh`;
        const geometry = {
            '@id': geoId,
            mesh: {
                source: [],
                vertices: {},
                triangles: [],
            },
        };

        // position
        const sourcePosition = scGeometry.sources.find((source) => source.semantic === 'POSITION');
        const position = {
            '@id': `${geoId}-position`,
            float_array: {
                '@id': `${geoId}-position-array`,
                '@count': sourcePosition.count * sourcePosition.stride,
                '#text': sourcePosition.data.flat().map((scalar) => scalar * sourcePosition.scale).join(' '),
            },
            technique_common: {
                accessor: {
                    '@source': `#${geoId}-position-array`,
                    '@count': sourcePosition.count,
                    '@stride': sourcePosition.stride,
                    param: [
                        { '@name': 'X', '@type': 'float' },
                        { '@name': 'Y', '@type': 'float' },
                        { '@name': 'Z', '@type': 'float' },
                    ],
                },
            },
        };
        geometry.mesh.source.push(position);
        geometry.mesh.vertices = {
            '@id': `${geoId}-vertices`,
            input: {
                '@semantic': 'POSITION',
                '@source': `#${geoId}-position`,
            },
        };

        // normal
        const sourceNormal = scGeometry.sources.find((source) => source.semantic === 'NORMAL');
        const normal = {
            '@id': `${geoId}-normal`,
            float_array: {
                '@id': `${geoId}-normal-array`,
                '@count': sourceNormal.count * sourceNormal.stride,
                '#text': sourceNormal.data.flat().map((scalar) => scalar * sourceNormal.scale).join(' '),
            },
            technique_common: {
                accessor: {
                    '@source': `#${geoId}-normal-array`,
                    '@count': sourceNormal.count,
                    '@stride': sourceNormal.stride,
                    param: [
                        { '@name': 'X', '@type': 'float' },
                        { '@name': 'Y', '@type': 'float' },
                        { '@name': 'Z', '@type': 'float' },
                    ],
                },
            },
        };
        geometry.mesh.source.push(normal);

        // texcoord
        const sourceTexcoord = scGeometry.sources.find((source) => source.semantic === 'TEXCOORD');
        const texcoord = {
            '@id': `${geoId}-texcoord`,
            float_array: {
                '@id': `${geoId}-texcoord-array`,
                '@count': sourceTexcoord.count * sourceTexcoord.stride,
                '#text': sourceTexcoord.data.flat().map((scalar) => scalar * sourceTexcoord.scale).join(' '),
            },
            technique_common: {
                accessor: {
                    '@source': `#${geoId}-texcoord-array`,
                    '@count': sourceTexcoord.count,
                    '@stride': sourceTexcoord.stride,
                    param: [
                        { '@name': 'S', '@type': 'float' },
                        { '@name': 'T', '@type': 'float' },
                    ],
                },
            },
        };
        geometry.mesh.source.push(texcoord);

        // triangles
        scGeometry.indices.forEach((sourceElement) => {
            const triangle = {
                '@count': sourceElement.elementCount,
                '@material': sourceElement.material !== '' ? sourceElement.material : undefined,
                input: [
                    {
                        '@semantic': 'VERTEX',
                        '@source': `#${geoId}-vertices`,
                        '@offset': sourcePosition.offset,
                    },
                    {
                        '@semantic': 'NORMAL',
                        '@source': `#${geoId}-normal`,
                        '@offset': sourceNormal.offset,
                    },
                    {
                        '@semantic': 'TEXCOORD',
                        '@source': `#${geoId}-texcoord`,
                        '@offset': sourceTexcoord.offset,
                        '@set': 0,
                    },
                ],
                p: sourceElement.primitives.flat().flat().join(' '),
            };
            geometry.mesh.triangles.push(triangle);
        });
        return geometry;
    }
}

module.exports = Geometry;
