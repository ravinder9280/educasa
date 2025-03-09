import express from 'express';
const app=express()
import cors from 'cors'
import { addSchoolController, listSchoolsControllers } from './controller/school.js';
app.use(express.json())
app.use(cors())
app.get('/',(req,res)=>{
    res.send('Hello World I AM Root')

})
app.post('/addSchool',addSchoolController)
app.get('/listSchools',listSchoolsControllers)
app.listen(3000,()=>{
    console.log('Server is running on port 3000')
})