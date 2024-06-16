const express = require('express');
const mongoose = require('mongoose');
const cors  = require('cors');

const PORT = process.env.BACKEND_PORT || 3001;
const dbURI = `mongodb://${process.env.MONGO_ROOT_USER}:${process.env.MONGO_ROOT_PASSWORD}@mongo:27017/modes?authSource=admin`;

const app = express();

app.use(cors({
    credentials: true,
    origin: '*'
}));
app.use(express.json());

//app.use('/api/search/', authentificationRouter);
//app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(dbURI, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    }   
    catch(error) {
        console.log(error);
    }
}

start();