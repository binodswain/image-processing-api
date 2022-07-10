import express from 'express';

import imageRoutes from './routes/imageRoute';
import indexRoutes from './routes/indexRoute';
import dirRoutes from './routes/directoryRoute';
import { errorHandler } from './middleware/globalErrorHandler';

const app = express();
app.use(express.static(__dirname + '/views'));

const port = 3000;

app.use('/', indexRoutes);
app.use('/api', imageRoutes);
app.use('/api', dirRoutes);

app.listen(port, () => {
    console.log(`server started at localhost:${port}`)
});

app.use(errorHandler)

export default app;