const mongoose = require('mongoose')

mongoose.connect(`mongodb+srv://user:12345@bd-lr.5dypf.gcp.mongodb.net/league-of-stats?retryWrites=true&w=majority`,{
    useNewUrlParser: true,
    useUnifiedTopology:true
})