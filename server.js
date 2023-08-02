require('./database/database');
const express = require('express');
const userRouter = require('./routes/userRouter');
const menuRouter = require('./routes/menuRouter')
const resRouter = require('./routes/restaurantRouter')
const cors = require('cors')

const PORT = 1800;

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', userRouter);
app.use('/api', menuRouter);
app.use('/api', resRouter);


app.listen(PORT, () => {
    console.log(`Server is listening to PORT: ${PORT}`);
})
