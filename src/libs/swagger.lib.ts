import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'API de Estudiantes',
        description: 'Documentación automática generada para el bootcamp',
        version: '1.0.0',
    },
    host: 'localhost:3000',
    schemes: ['http'],
};

const outputFile = 'swagger-output.json';

const endpointsFiles = [
    './src/controllers/productoController.ts',
    './src/controllers/customerController.ts',
];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(async () => {
    await import('../index.js');
});