import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'API de Estudiantes',
        description: 'Documentación automática generada para el bootcamp',
        version: '1.0.0',
    },
    host: '', // Swagger usa el host y puerto de la página actual.
    schemes: ['http'],
};

const outputFile = 'swagger-output.json';

const endpointsFiles = ['./src/index.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(async () => {
    await import('../index.js');
});
